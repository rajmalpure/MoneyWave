import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const colors = ["#6366f1", "#f97316", "#22c55e", "#eab308", "#ec4899"];

export const CategoryPie = ({ data }) => {
  if (!data.length) {
    return <p className="text-sm text-slate-400">No data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.category}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

