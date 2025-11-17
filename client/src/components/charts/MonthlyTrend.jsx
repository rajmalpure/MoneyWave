import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export const MonthlyTrend = ({ data }) => {
  if (!data.length) {
    return <p className="text-sm text-slate-400">No monthly trends yet</p>;
  }

  const formatted = data.map((item) => ({
    name: `${item.month}/${item.year}`,
    income: item.income,
    expense: item.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
        <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

