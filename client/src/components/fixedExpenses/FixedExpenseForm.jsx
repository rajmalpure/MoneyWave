import { useEffect, useState } from "react";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";

const emptyState = {
  title: "",
  amount: "",
  category: "",
  dueDate: new Date().toISOString().split("T")[0],
  notes: "",
};

const categories = [
  "Rent",
  "EMI",
  "Subscriptions",
  "Insurance",
  "Phone Bill",
  "Internet",
  "Utilities",
  "Other",
];

export const FixedExpenseForm = ({
  onSubmit,
  submitting,
  initialData = emptyState,
  buttonLabel = "Save fixed expense",
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
        required
      />
      <TextInput
        label="Amount"
        type="number"
        step="0.01"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-300">Category</span>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>
      <TextInput
        label="Due Date"
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        required
      />
      <label className="flex flex-col gap-1 text-sm md:col-span-2">
        <span className="text-slate-300">Notes</span>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
          rows={3}
          placeholder="Optional notes about this expense..."
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

