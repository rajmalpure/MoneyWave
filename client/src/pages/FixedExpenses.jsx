import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";
import { FixedExpenseForm } from "../components/fixedExpenses/FixedExpenseForm";
import { FixedExpenseList } from "../components/fixedExpenses/FixedExpenseList";

export const FixedExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/fixed-expenses");
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching fixed expenses:", error);
      console.error("Request URL:", error.config?.url);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleCreate = async (payload, reset) => {
    setSubmitting(true);
    try {
      const body = {
        title: payload.title,
        amount: Number(payload.amount),
        category: payload.category,
        dueDate: payload.dueDate,
        notes: payload.notes || "",
      };

      if (editing) {
        await api.put(`/fixed-expenses/${editing._id}`, body);
        setEditing(null);
      } else {
        await api.post("/fixed-expenses", body);
      }
      reset();
      fetchExpenses();
    } catch (error) {
      console.error("Error saving fixed expense:", error);
      console.error("Request URL:", error.config?.url);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      alert("Failed to save fixed expense. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fixed expense?")) {
      return;
    }
    try {
      await api.delete(`/fixed-expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting fixed expense:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Fixed Expenses</h1>
        <p className="text-slate-400">
          Manage your recurring monthly expenses like rent, subscriptions, and bills.
        </p>
      </div>

      <FixedExpenseForm
        onSubmit={handleCreate}
        submitting={submitting}
        initialData={
          editing
            ? {
                ...editing,
                amount: editing.amount.toString(),
                dueDate: new Date(editing.dueDate).toISOString().split("T")[0],
              }
            : undefined
        }
        buttonLabel={editing ? "Update fixed expense" : "Add fixed expense"}
        resetAfterSubmit={!editing}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Fixed Expenses</h2>
        {editing && (
          <button
            className="text-sm text-slate-400 hover:text-white"
            onClick={() => setEditing(null)}
          >
            Cancel edit
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading fixed expenses...</p>
      ) : (
        <FixedExpenseList
          expenses={expenses}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

