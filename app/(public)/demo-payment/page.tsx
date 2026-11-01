"use client";

import { Suspense, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";

// Portfolio demo only: stands in for the PayMongo (GCash) and Stripe (card) checkout.
// The order exists only in this browser tab; "paying" just marks it confirmed there.
interface DemoOrder {
  orderRef: string;
  items: CartItem[];
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: string;
}

const storageKey = (ref: string) => `xlb-demo-order:${ref}`;
// sessionStorage never changes under this page, so there is nothing to subscribe to.
const subscribe = () => () => {};

function DemoPayment() {
  const router = useRouter();
  const ref = useSearchParams().get("ref")?.toUpperCase() ?? "";
  // undefined on the server (storage unknown), then the saved order string or null in the browser.
  const saved = useSyncExternalStore(
    subscribe,
    () => (ref ? sessionStorage.getItem(storageKey(ref)) : null),
    () => undefined
  );
  const order: DemoOrder | null = saved ? JSON.parse(saved) : null;

  function pay() {
    if (!order) return;
    sessionStorage.setItem(storageKey(order.orderRef), JSON.stringify({ ...order, status: "CONFIRMED" }));
    router.push(`/track?q=${order.orderRef}`);
  }

  if (saved === undefined) return null;

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-5 py-16 text-center">
        <h1 className="text-3xl font-black mb-3">No demo order found</h1>
        <p className="text-gray-500 mb-6">Demo orders live only in the browser tab that placed them.</p>
        <Link href="/menu" className="inline-block bg-[#E83A87] text-white font-bold px-6 py-3 rounded-full">
          Place a demo order
        </Link>
      </div>
    );
  }

  const method = order.paymentMethod === "CARD" ? "card" : "GCash";
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-5 py-10">
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#E83A87] mb-2">Test payment</p>
          <h1 className="text-4xl md:text-5xl font-black">Pay with {method}</h1>
        </div>
      </div>
      <div className="max-w-xl mx-auto px-5 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">Order {order.orderRef}</p>
          <ul className="text-sm mb-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between py-1">
                <span>{item.qty}x {item.size} ({item.pieces} pcs)</span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-700 py-1">
              <span>Discount</span>
              <span>&minus;{formatPrice(order.discount)}</span>
            </div>
          )}
          {order.deliveryFee > 0 && (
            <div className="flex justify-between text-sm py-1">
              <span>Delivery (sample fee)</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-3">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          In the real flow this step opens the {method} checkout. In this demo no money moves: the button
          below only marks the order as paid in this browser tab.
        </p>
        <button
          type="button"
          onClick={pay}
          className="w-full bg-[#E83A87] text-white font-bold py-4 rounded-full"
        >
          Pay {formatPrice(order.total)} (test)
        </button>
      </div>
    </div>
  );
}

export default function DemoPaymentPage() {
  return (
    <Suspense>
      <DemoPayment />
    </Suspense>
  );
}
