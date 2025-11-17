import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";
import { TransactionForm } from "../components/transactions/TransactionForm";
import { TransactionList } from "../components/transactions/TransactionList";
import { TransactionFilters } from "../components/transactions/TransactionFilters";

const defaultFilters = {
  type: "",
  category: "",
  startDate: "",
  endDate: "",
};

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [editing, setEditing] = useState(null);

  const fetchTransactions = useCallback(async (params = filters) => {
    setLoading(true);
    try {
      const { data } = await api.get("/transactions", { params });
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions(filters);
  }, [fetchTransactions, filters]);

  const handleCreate = async (payload, reset) => {
    setSubmitting(true);
    try {
      const body = {
        title: payload.title,
        amount: Number(payload.amount),
        type: payload.type,
        category: payload.category,
        date: payload.date,
        notes: payload.notes,
      };

      if (editing) {
        await api.put(`/transactions/${editing._id}`, body);
        setEditing(null);
      } else {
        await api.post("/transactions", body);
      }
      reset();
      fetchTransactions(filters);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    fetchTransactions(filters);
  };

  return (
    <div className="space-y-6">
      <TransactionForm
        onSubmit={handleCreate}
        submitting={submitting}
        initialData={
          editing
            ? {
                ...editing,
                amount: editing.amount.toString(),
                date: new Date(editing.date).toISOString().split("T")[0],
              }
            : undefined
        }
        buttonLabel={editing ? "Update transaction" : "Add transaction"}
        resetAfterSubmit={!editing}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All transactions</h2>
        {editing && (
          <button
            className="text-sm text-slate-400 hover:text-white"
            onClick={() => setEditing(null)}
          >
            Cancel edit
          </button>
        )}
      </div>

      <TransactionFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

