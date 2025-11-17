import { useEffect, useState } from "react";
import api from "../lib/api";
import { CategoryPie } from "../components/charts/CategoryPie";
import { MonthlyTrend } from "../components/charts/MonthlyTrend";
import { IncomeExpenseBar } from "../components/charts/IncomeExpenseBar";

export const Analytics = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categories, monthly] = await Promise.all([
          api.get("/analytics/categories"),
          api.get("/analytics/monthly"),
        ]);
        setCategoryData(categories.data);
        setMonthlyData(monthly.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading analytics...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold mb-4">Category breakdown</h2>
          <CategoryPie data={categoryData} />
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Income vs expense comparison
          </h2>
          <IncomeExpenseBar data={monthlyData} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly trends</h2>
        <MonthlyTrend data={monthlyData} />
      </div>
    </div>
  );
};

