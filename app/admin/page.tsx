"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Clock, TrendingUp, Calendar } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

interface Order {
  id: string;
  orderRef: string;
  customerName: string;
  mobileNumber: string;
  total: number;
  status: string;
  scheduledDate: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = format(new Date(), "yyyy-MM-dd");
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const todayOrders = orders.filter((o) => o.scheduledDate === today).length;
  const totalRevenue = orders
    .filter((o) => o.status !== "PENDING")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "bg-blue-50 text-blue-700" },
    { label: "Pending", value: pendingOrders, icon: Clock, color: "bg-yellow-50 text-yellow-700" },
    { label: "Today's Orders", value: todayOrders, icon: Calendar, color: "bg-green-50 text-green-700" },
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "bg-rose-50 text-rose-700" },
  ];

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    DELIVERED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#3D1A00] mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className={`inline-flex p-2 rounded-xl mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-[#3D1A00]">Recent Orders</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Ref", "Customer", "Mobile", "Total", "Date", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 10).map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{o.orderRef}</td>
                    <td className="px-4 py-3">{o.customerName}</td>
                    <td className="px-4 py-3 text-gray-500">{o.mobileNumber}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3 text-gray-500">{o.scheduledDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[o.status]}`}>
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
