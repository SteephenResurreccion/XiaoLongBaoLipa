"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";

interface OrderResult {
  orderRef: string;
  customerName: string;
  mobileNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryMethod: string;
  deliveryAddress?: string;
  deliveryFee: number;
  total: number;
  remainingBalance: number;
  paymentMethod: string;
  scheduledDate: string;
  timeSlot: string;
  status: string;
  orderNotes?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  PENDING:   { label: "Pending",   color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200",   desc: "Your order has been received. We'll confirm within 24 hours." },
  CONFIRMED: { label: "Confirmed", color: "text-green-700",  bg: "bg-green-50 border-green-200",    desc: "Your order is confirmed! We will contact you with pickup or delivery details." },
  DELIVERED: { label: "Delivered", color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",      desc: "Order complete. Thank you for ordering from Xiao Long Bow!" },
};

function TrackForm() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) { setQuery(q); doTrack(q); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doTrack(q: string) {
    setLoading(true); setError(""); setOrder(null);
    try {
      const res = await fetch(`/api/track?q=${encodeURIComponent(q)}`);
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Order not found."); }
      const data = await res.json();
      setOrder(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Order not found.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    doTrack(query.trim());
  }

  const statusInfo = order ? (STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-10">
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#E83A87] mb-2">Order Status</p>
          <h1 className="text-4xl md:text-5xl font-black">Track Order</h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 py-10">
        {/* Search */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Mobile number or order ref (XLB-XXXXXX)"
            className="border border-gray-200 rounded-xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white"
          />
          <button type="submit" disabled={loading}
            className="bg-black text-white hover:bg-gray-800 rounded-full px-6 py-3 text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-40">
            {loading ? "..." : "Track"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-[#E83A87] text-sm font-medium mb-6">
            {error}
          </div>
        )}

        {order && statusInfo && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Status banner */}
            <div className={`border-b px-6 py-5 ${statusInfo.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-gray-500 tracking-widest">{order.orderRef}</span>
                <span className={`font-black text-sm uppercase tracking-widest ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-sm text-gray-600">{statusInfo.desc}</p>
            </div>

            {/* Order details */}
            <div className="px-6 py-6 space-y-5">
              {/* Customer */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Name", value: order.customerName },
                  { label: "Mobile", value: order.mobileNumber },
                  { label: "Date", value: order.scheduledDate },
                  { label: "Time", value: order.timeSlot },
                  { label: "Method", value: order.deliveryMethod === "PICKUP" ? "Pickup (Free)" : "Delivery" },
                  { label: "Payment", value: order.paymentMethod },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-0.5">{label}</p>
                    <p className="font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              {order.deliveryAddress && (
                <div className="text-sm">
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-0.5">Delivery Address</p>
                  <p className="font-semibold">{order.deliveryAddress}</p>
                </div>
              )}

              {/* Items */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Items</p>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.size} × {item.qty} ({item.pieces * item.qty} pcs)</span>
                      <span className="font-bold">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Discount</span><span>−{formatPrice(order.discount)}</span>
                  </div>
                )}
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span><span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-base border-t border-gray-100 pt-2">
                  <span>Total Paid</span><span>{formatPrice(order.total)}</span>
                </div>
              </div>

              {order.orderNotes && (
                <div className="border-t border-gray-100 pt-4 text-sm">
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Notes</p>
                  <p className="text-gray-700">{order.orderNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    }>
      <TrackForm />
    </Suspense>
  );
}
