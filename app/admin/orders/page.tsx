"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  size: string;
  pieces: number;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  orderRef: string;
  customerName: string;
  mobileNumber: string;
  items: OrderItem[];
  subtotal: number;
  promoCode: string | null;
  discount: number;
  reservationFee: number;
  deliveryMethod: string;
  deliveryAddress: string | null;
  deliveryFee: number;
  total: number;
  remainingBalance: number;
  paymentMethod: string;
  orderNotes: string | null;
  scheduledDate: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "DELIVERED"];

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  DELIVERED: "bg-gray-100 text-gray-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#3D1A00] mb-8">Orders</h1>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No orders yet</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm font-bold text-[#3D1A00]">
                      {o.orderRef}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <p className="font-semibold">{o.customerName}</p>
                  <p className="text-gray-500 text-sm">{o.mobileNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#3D1A00]">
                    {formatPrice(o.total)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Remaining: {formatPrice(o.remainingBalance)}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Items</p>
                  {o.items.map((item, i) => (
                    <p key={i}>
                      {item.qty}× {item.size} ({item.pieces}pcs) —{" "}
                      {formatPrice(item.price * item.qty)}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Schedule</p>
                  <p>{o.scheduledDate}</p>
                  <p className="text-gray-500">{o.timeSlot}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Delivery</p>
                  <p className="capitalize">{o.deliveryMethod}</p>
                  {o.deliveryAddress && (
                    <p className="text-gray-500 text-xs">{o.deliveryAddress}</p>
                  )}
                  {o.deliveryFee > 0 && (
                    <p className="text-gray-500 text-xs">
                      Fee: {formatPrice(o.deliveryFee)}
                    </p>
                  )}
                </div>
              </div>

              {(o.promoCode || o.orderNotes) && (
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  {o.promoCode && (
                    <p>
                      Promo: <span className="font-mono">{o.promoCode}</span>{" "}
                      (−{formatPrice(o.discount)})
                    </p>
                  )}
                  {o.orderNotes && <p>Notes: {o.orderNotes}</p>}
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <label className="text-sm text-gray-500">Update status:</label>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  disabled={updating === o.id || o.status === "DELIVERED"}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {updating === o.id && (
                  <span className="text-gray-400 text-sm">Updating...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
