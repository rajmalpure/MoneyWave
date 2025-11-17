export const TransactionFilters = ({ filters, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid gap-4 md:grid-cols-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <select
        name="type"
        value={filters.type}
        onChange={handleChange}
        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input
        type="text"
        name="category"
        value={filters.category}
        onChange={handleChange}
        placeholder="Category"
        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
      />
      <input
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={handleChange}
        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
      />
      <input
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={handleChange}
        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
      />
    </div>
  );
};

