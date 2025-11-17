import { useEffect, useState } from "react";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";

const emptyState = {
  title: "",
  amount: "",
  type: "expense",
  category: "",
  date: new Date().toISOString().split("T")[0],
  notes: "",
};

export const TransactionForm = ({
  onSubmit,
  submitting,
  initialData = emptyState,
  buttonLabel = "Save transaction",
  resetAfterSubmit = true,
}) => {
  const [form, setForm] = useState(() => ({ ...initialData }));

  useEffect(() => {
    setForm(initialData ? { ...initialData } : { ...emptyState });
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, () => {
      if (resetAfterSubmit) {
        setForm({ ...emptyState });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 md:grid-cols-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
    >
      <TextInput
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
      />
      <TextInput
        label="Amount"
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
      />
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-300">Type</span>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>
      <TextInput
        label="Category"
        name="category"
        value={form.category}
        onChange={handleChange}
      />
      <TextInput
        label="Date"
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />
      <label className="flex flex-col gap-1 text-sm md:col-span-2">
        <span className="text-slate-300">Notes</span>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
          rows={3}
        />
      </label>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : buttonLabel}
        </Button>
      </div>
    </form>
  );
};

