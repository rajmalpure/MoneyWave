import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";

export const IncomeExpenseBar = ({ data }) => {
  if (!data.length) {
    return <p className="text-sm text-slate-400">No data available</p>;
  }

  const formatted = data.map((item) => ({
    name: `${item.month}/${item.year}`,
    income: item.income,
    expense: item.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip />
        <Bar dataKey="income" fill="#22c55e" />
        <Bar dataKey="expense" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
};

