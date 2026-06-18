import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Package, ShoppingBag, TrendingUp, Clock, Loader2 } from "lucide-react";

const formatPrice = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Kebaya.list("-created_date", 100),
      base44.entities.Order.list("-created_date", 100),
    ]).then(([kebayaList, orderList]) => {
      const totalRevenue = orderList.reduce((acc, o) => acc + (o.total_price || 0), 0);
      const pendingOrders = orderList.filter((o) => o.status === "pending").length;
      setStats({
        totalKebaya: kebayaList.length,
        totalOrders: orderList.length,
        totalRevenue,
        pendingOrders,
      });
      setRecentOrders(orderList.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-background/50" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Kebaya", value: stats?.totalKebaya || 0, icon: Package, color: "bg-blue-500/20 text-blue-400" },
    { label: "Total Pesanan", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "bg-green-500/20 text-green-400" },
    { label: "Total Pendapatan", value: formatPrice(stats?.totalRevenue || 0), icon: TrendingUp, color: "bg-yellow-500/20 text-yellow-400" },
    { label: "Pesanan Pending", value: stats?.pendingOrders || 0, icon: Clock, color: "bg-red-500/20 text-red-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-light tracking-wider text-background mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="bg-background/5 border border-background/10 p-6 rounded">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded flex items-center justify-center ${s.color}`}>
                <s.icon size={18} />
              </div>
              <span className="font-body text-xs text-background/50 tracking-wider uppercase">
                {s.label}
              </span>
            </div>
            <p className="font-display text-2xl font-semibold text-background">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-background/5 border border-background/10 rounded p-6">
        <h2 className="font-display text-xl font-light tracking-wider text-background mb-6">
          Pesanan Terbaru
        </h2>
        {recentOrders.length === 0 ? (
          <p className="font-body text-sm text-background/40">Belum ada pesanan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-background/10">
                  <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">No. Order</th>
                  <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Pelanggan</th>
                  <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Kebaya</th>
                  <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Total</th>
                  <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-background/5">
                    <td className="py-3 font-body text-sm text-background">{o.order_number}</td>
                    <td className="py-3 font-body text-sm text-background/70">{o.customer_name}</td>
                    <td className="py-3 font-body text-sm text-background/70">{o.kebaya_name}</td>
                    <td className="py-3 font-body text-sm text-background">{formatPrice(o.total_price || 0)}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-1 text-xs font-body rounded ${
                        o.status === "completed" ? "bg-green-500/20 text-green-400" :
                        o.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        o.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}