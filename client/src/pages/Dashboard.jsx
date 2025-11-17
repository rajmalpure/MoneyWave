import { useEffect, useState } from "react";
import api from "../lib/api";

const StatCard = ({ label, value, accent }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
    <p className="text-sm uppercase text-slate-400">{label}</p>
    <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
  </div>
);

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/analytics/dashboard");
        setData(data);
      } catch (err) {
        setError("Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total income"
          value={`₹${data.totalIncome.toFixed(2)}`}
          accent="text-success"
        />
        <StatCard
          label="Total expenses"
          value={`₹${data.totalExpense.toFixed(2)}`}
          accent="text-danger"
        />
        <StatCard
          label="Balance"
          value={`₹${data.balance.toFixed(2)}`}
          accent="text-white"
        />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold">Recent transactions</h2>
        <div className="mt-4 space-y-3">
          {data.recent?.length ? (
            data.recent.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-3"
              >
                <div>
                  <p className="font-medium">{tx.title}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(tx.date).toLocaleDateString()} &middot;{" "}
                    {tx.category}
                  </p>
                </div>
                <p
                  className={
                    tx.type === "income" ? "text-success font-semibold" : "text-danger font-semibold"
                  }
                >
                  {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              No transactions added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

