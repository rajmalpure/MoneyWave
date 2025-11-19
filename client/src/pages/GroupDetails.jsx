import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Plus,
  TrendingUp,
  Calendar,
  Trash2,
  UserPlus,
  DollarSign,
} from "lucide-react";
import api from "../lib/api";
import { AddMemberModal } from "../components/groups/AddMemberModal";
import { GroupTransactionForm } from "../components/groups/GroupTransactionForm";

export const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");

  useEffect(() => {
    fetchGroupDetails();
    fetchTransactions();
    fetchBalances();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      const { data } = await api.get(`/groups/${id}`);
      setGroup(data);
    } catch (error) {
      console.error("Error fetching group:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get(`/groups/${id}/transactions`);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchBalances = async () => {
    try {
      const { data } = await api.get(`/groups/${id}/balances`);
      setBalances(data);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await api.delete(`/groups/${id}/transactions/${transactionId}`);
      fetchTransactions();
      fetchBalances();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Group not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/groups")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Groups
      </button>

      {/* Group Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            {group.description && (
              <p className="text-blue-100 mb-4">{group.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{group.members.length} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(group.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddMember(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Member
            </button>
            <button
              onClick={() => setShowAddTransaction(true)}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Members
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {group.members.map((member) => (
            <div
              key={member._id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500">@{member.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "transactions"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab("balances")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "balances"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Balances
          </button>
        </div>
      </div>

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No transactions yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first group expense
              </p>
              <button
                onClick={() => setShowAddTransaction(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add First Expense
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {transaction.title}
                        </h3>
                        {transaction.category && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {transaction.category}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          Paid by{" "}
                          <span className="font-medium text-gray-900">
                            {transaction.paidBy.name}
                          </span>
                        </p>
                        <p>
                          Split {transaction.splitType} among{" "}
                          {transaction.participants.length} people
                        </p>
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(transaction.date)}
                        </p>
                        {transaction.notes && (
                          <p className="text-gray-500 italic">{transaction.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Balances Tab */}
      {activeTab === "balances" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {balances.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No balance data
              </h3>
              <p className="text-gray-600">
                Add transactions to see balances
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {balances.map((balance) => (
                  <div
                    key={balance.user._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {balance.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {balance.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{balance.user.username}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Paid:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(balance.paid)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Owes:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(balance.owes)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">
                          Net Balance:
                        </span>
                        <span
                          className={`font-bold ${
                            balance.balance > 0
                              ? "text-green-600"
                              : balance.balance < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {balance.balance > 0 ? "+" : ""}
                          {formatCurrency(balance.balance)}
                        </span>
                      </div>
                      {balance.balance > 0 && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ Gets back {formatCurrency(balance.balance)}
                        </p>
                      )}
                      {balance.balance < 0 && (
                        <p className="text-xs text-red-600 mt-2">
                          ⚠ Owes {formatCurrency(Math.abs(balance.balance))}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddMember && (
        <AddMemberModal
          groupId={id}
          onClose={() => setShowAddMember(false)}
          onSuccess={() => {
            fetchGroupDetails();
          }}
        />
      )}

      {showAddTransaction && group && (
        <GroupTransactionForm
          groupId={id}
          members={group.members}
          onClose={() => setShowAddTransaction(false)}
          onSuccess={() => {
            fetchTransactions();
            fetchBalances();
          }}
        />
      )}
    </div>
  );
};
