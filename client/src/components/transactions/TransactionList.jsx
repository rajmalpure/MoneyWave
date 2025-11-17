export const TransactionList = ({ transactions, onEdit, onDelete }) => {
  if (!transactions.length) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-6 text-center text-slate-400">
        No transactions yet. Start by adding your first one above.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx._id}
          className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="font-semibold">{tx.title}</p>
            <p className="text-xs text-slate-400">
              {new Date(tx.date).toLocaleDateString()} • {tx.category}
            </p>
            {tx.notes && (
              <p className="text-xs text-slate-500 mt-1">{tx.notes}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <p
              className={`text-lg font-semibold ${
                tx.type === "income" ? "text-success" : "text-danger"
              }`}
            >
              {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
            </p>
            <div className="flex gap-2">
              <button
                className="text-sm text-primary hover:underline"
                onClick={() => onEdit(tx)}
              >
                Edit
              </button>
              <button
                className="text-sm text-red-400 hover:underline"
                onClick={() => onDelete(tx._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

