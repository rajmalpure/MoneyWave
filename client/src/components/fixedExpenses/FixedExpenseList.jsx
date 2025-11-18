import { Calendar } from "lucide-react";

export const FixedExpenseList = ({ expenses, onEdit, onDelete }) => {
  const totalMonthly = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (!expenses.length) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-6 text-center text-slate-400">
        No fixed expenses yet. Start by adding your first one above.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Total Monthly Fixed Cost</p>
            <p className="text-3xl font-bold text-primary mt-1">
              ${totalMonthly.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => {
          const dueDate = new Date(expense.dueDate);
          const isOverdue = dueDate < new Date() && dueDate.getDate() !== new Date().getDate();
          const isDueSoon = dueDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) && !isOverdue;

          return (
            <div
              key={expense._id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:flex-row md:items-center md:justify-between hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">{expense.title}</p>
                  {isOverdue && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                      Overdue
                    </span>
                  )}
                  {isDueSoon && !isOverdue && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                      Due Soon
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {dueDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span>{expense.category}</span>
                </div>
                {expense.notes && (
                  <p className="text-xs text-slate-500 mt-1">{expense.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold text-danger">
                  ${expense.amount.toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <button
                    className="text-sm text-primary hover:underline"
                    onClick={() => onEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-400 hover:underline"
                    onClick={() => onDelete(expense._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

