import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Eye, X, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formatPrice = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const statusOptions = ["pending", "confirmed", "shipped", "in_use", "returned", "completed", "cancelled"];
const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  in_use: "bg-cyan-500/20 text-cyan-400",
  returned: "bg-indigo-500/20 text-indigo-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const loadOrders = () => {
    setLoading(true);
    base44.entities.Order.list("-created_date", 100)
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Yakin ingin hapus pesanan ini?")) return;
    await base44.entities.Order.delete(orderId);
    toast({ title: "Pesanan dihapus" });
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrder?.id === orderId) setSelectedOrder(null);
  };

  const updateStatus = async (orderId, newStatus) => {
    await base44.entities.Order.update(orderId, { status: newStatus });
    toast({ title: `Status diubah ke ${newStatus}` });
    loadOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const filtered = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div>
      <h1 className="font-display text-3xl font-light tracking-wider text-background mb-8">
        Kelola Pesanan
      </h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 font-body text-xs tracking-wider uppercase rounded transition-colors ${
            filterStatus === "all" ? "bg-background/10 text-background" : "text-background/40 hover:text-background"
          }`}
        >
          Semua ({orders.length})
        </button>
        {statusOptions.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 font-body text-xs tracking-wider uppercase rounded transition-colors ${
                filterStatus === s ? "bg-background/10 text-background" : "text-background/40 hover:text-background"
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-background/50" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-xl text-background/50">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-background/10">
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">No. Order</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Pelanggan</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Kebaya</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Ukuran</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Tanggal</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Total</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Tipe</th>
                <th className="pb-3 text-left font-body text-xs text-background/50 tracking-wider uppercase">Status</th>
                <th className="pb-3 text-right font-body text-xs text-background/50 tracking-wider uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-background/5">
                  <td className="py-3 font-body text-sm text-background">{o.order_number}</td>
                  <td className="py-3 font-body text-sm text-background/70">{o.customer_name}</td>
                  <td className="py-3 font-body text-sm text-background/70">{o.kebaya_name}</td>
                  <td className="py-3 font-body text-sm text-background/70">{o.size}</td>
                  <td className="py-3 font-body text-xs text-background/50">{o.rental_date}</td>
                  <td className="py-3 font-body text-sm text-background">{formatPrice(o.total_price || 0)}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      o.checkout_type === "escrow" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {o.checkout_type === "escrow" ? "Escrow" : "Booking"}
                    </span>
                  </td>
                  <td className="py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded border-none focus:outline-none cursor-pointer ${statusColors[o.status] || "bg-background/5 text-background/50"}`}
                    >
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 text-right flex items-center justify-end gap-1">
                    <button onClick={() => setSelectedOrder(o)} className="p-2 text-background/40 hover:text-background transition-colors">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => deleteOrder(o.id)} className="p-2 text-red-400/60 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 overflow-y-auto pb-10">
          <div className="bg-foreground border border-background/10 rounded w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-light text-background tracking-wider">
                Detail Pesanan
              </h2>
              <div className="flex items-center gap-3">
                <button onClick={() => deleteOrder(selectedOrder.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-400/30 rounded hover:bg-red-400/10 transition-colors">
                  <Trash2 size={12} /> Hapus
                </button>
                <button onClick={() => setSelectedOrder(null)} className="text-background/50 hover:text-background">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">No. Order</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Status</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${statusColors[selectedOrder.status] || ""}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Pelanggan</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Email</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Telepon</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.customer_phone || "—"}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Tipe Checkout</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.checkout_type === "escrow" ? "Pembayaran Aman" : "Booking"}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Kebaya</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.kebaya_name}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Ukuran</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.size}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Tanggal Sewa</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.rental_date}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Tanggal Kembali</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.return_date}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Total</p>
                  <p className="font-display text-lg font-semibold text-background mt-1">{formatPrice(selectedOrder.total_price || 0)}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Deposit</p>
                  <p className="font-body text-sm text-background mt-1">{formatPrice(selectedOrder.deposit_amount || 0)}</p>
                </div>
              </div>
              {selectedOrder.customer_address && (
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Alamat</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.customer_address}</p>
                </div>
              )}
              {selectedOrder.notes && (
                <div>
                  <p className="font-body text-xs text-background/40 tracking-wider uppercase">Catatan</p>
                  <p className="font-body text-sm text-background mt-1">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}