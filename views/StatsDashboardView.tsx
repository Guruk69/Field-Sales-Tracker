import React, { useMemo } from "react";
import { Shop, Task, TaskStatus } from "../types";

interface StatsDashboardViewProps {
  shops: Shop[];
  tasks: Task[];
}

export const StatsDashboardView: React.FC<StatsDashboardViewProps> = ({
  shops,
  tasks,
}) => {
  const stats = useMemo(() => {
    const totalShops = shops.length;

    const byStatus = (status: string) =>
      shops.filter((s) => s.status === status).length;

    const pendingTasks = tasks.filter(
      (t) => t.status !== TaskStatus.COMPLETED
    ).length;

    return {
      totalShops,
      hot: byStatus("HOT"),
      warm: byStatus("WARM"),
      cold: byStatus("COLD"),
      dead: byStatus("DEAD"),
      closed: byStatus("CLOSED"),
      pendingTasks,
    };
  }, [shops, tasks]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-black">
        Business Overview
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Shops" value={stats.totalShops} />
        <StatCard title="Pending Tasks" value={stats.pendingTasks} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard title="🔥 Hot" value={stats.hot} />
        <StatCard title="🌤 Warm" value={stats.warm} />
        <StatCard title="❄ Cold" value={stats.cold} />
        <StatCard title="☠ Dead" value={stats.dead} />
        <StatCard title="🚫 Closed" value={stats.closed} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border">
    <p className="text-xs uppercase tracking-widest text-black opacity-60">
      {title}
    </p>
    <p className="text-3xl font-extrabold text-black mt-2">
      {value}
    </p>
  </div>
);
