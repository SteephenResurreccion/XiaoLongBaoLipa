"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { MENU_ITEMS, TIME_SLOTS, formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { Minus, Plus, X } from "lucide-react";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

const schema = z.object({
  scheduledDate: z.string().min(1, "Please select a date"),
  timeSlot: z.string().min(1, "Please select a time slot"),
  deliveryMethod: z.enum(["PICKUP", "DELIVERY"]),
  promoCode: z.string().optional(),
  orderNotes: z.string().optional(),
  paymentMethod: z.enum(["GCASH", "CARD"]),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  mobileNumber: z.string().regex(/^09\d{9}$/, "Format: 09XXXXXXXXX"),
});

type FormValues = z.infer<typeof schema>;

const PRODUCT_IMAGES: Record<string, string> = {
  small: "/size-small.jpg",
  medium: "/size-medium.jpg",
  large: "/size-large.jpg",
};

const inputClass =
  "border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white";
const labelClass = "block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2";
const sectionClass = "bg-white rounded-2xl border border-gray-100 p-6 md:p-8";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {error && <p className="text-[#E83A87] text-xs mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

export default function MenuPage() {
  const { items, addToCart, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const router = useRouter();

  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [fetchingFee, setFetchingFee] = useState(false);
  const [deliveryFeeChecked, setDeliveryFeeChecked] = useState(false);
  const [mapAddress, setMapAddress] = useState("");
  const [mapLat, setMapLat] = useState<number | null>(null);
  const [mapLng, setMapLng] = useState<number | null>(null);
  const [addressError, setAddressError] = useState("");
  const [promoResult, setPromoResult] = useState<{
    valid: boolean; discountType?: string; discountValue?: number;
    partnerName?: string; message?: string;
  } | null>(null);
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { deliveryMethod: "PICKUP", paymentMethod: "GCASH" },
  });

  const deliveryMethod = watch("deliveryMethod");
  const promoCodeValue = watch("promoCode");
  const paymentMethod = watch("paymentMethod");
  const scheduledDate = watch("scheduledDate");

  const subtotal = cartTotal;
  const effectiveDeliveryFee = deliveryMethod === "DELIVERY" ? deliveryFee : 0;
  const total = subtotal - discount + effectiveDeliveryFee;

  useEffect(() => {
    fetch("/api/blocked-dates")
      .then((r) => r.json())
      .then((data) => setBlockedDates(data.map?.((d: { date: string }) => d.date) ?? []))
      .catch(() => {});
  }, []);

  // Reset delivery state when method changes
  useEffect(() => {
    if (deliveryMethod === "PICKUP") {
      setDeliveryFee(0);
      setDeliveryFeeChecked(false);
      setDeliveryAvailable(true);
      setAddressError("");
    }
  }, [deliveryMethod]);

  function handleMapSelect(address: string, lat: number, lng: number) {
    setMapAddress(address);
    setMapLat(lat);
    setMapLng(lng);
    setAddressError("");
    // Reset delivery fee when location changes
    setDeliveryFeeChecked(false);
    setDeliveryFee(0);
  }

  async function handleGetDeliveryFee() {
    if (!mapLat || !mapLng) {
      setAddressError("Please pin your location on the map first.");
      return;
    }
    setFetchingFee(true);
    setDeliveryFeeChecked(false);
    try {
      const res = await fetch("/api/delivery-fee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dropLat: mapLat, dropLng: mapLng, dropAddress: mapAddress }),
      });
      const data = await res.json();
      setDeliveryFee(data.fee ?? 0);
      setDeliveryAvailable(data.available ?? false);
      setDeliveryFeeChecked(true);
    } catch {
      setDeliveryAvailable(false);
      setDeliveryFeeChecked(true);
    } finally {
      setFetchingFee(false);
    }
  }

  async function handleApplyPromo() {
    if (!promoCodeValue) return;
    try {
      const res = await fetch(`/api/promo?code=${encodeURIComponent(promoCodeValue)}`);
      const data = await res.json();
      setPromoResult(data);
      if (data.valid) {
        setDiscount(data.discountType === "fixed"
          ? data.discountValue
          : Math.floor((subtotal * data.discountValue) / 100));
      } else {
        setDiscount(0);
      }
    } catch {
      setPromoResult({ valid: false, message: "Failed to apply promo." });
    }
  }

  async function onSubmit(values: FormValues) {
    if (items.length === 0) { setSubmitError("Your cart is empty."); return; }

    // Client-side delivery address check
    if (values.deliveryMethod === "DELIVERY" && !mapAddress) {
      setAddressError("Please pin your delivery location on the map.");
      return;
    }

    // Client-side blocked date check
    if (blockedDates.includes(values.scheduledDate)) {
      setSubmitError("The selected date is unavailable. Please choose another date.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const orderPayload = {
        customerName: values.customerName,
        mobileNumber: values.mobileNumber,
        items,
        subtotal,
        promoCode: values.promoCode || undefined,
        discount,
        deliveryMethod: values.deliveryMethod,
        deliveryAddress: values.deliveryMethod === "DELIVERY" ? mapAddress : undefined,
        deliveryFee: effectiveDeliveryFee,
        total,
        remainingBalance: 0,
        paymentMethod: values.paymentMethod,
        orderNotes: values.orderNotes || undefined,
        scheduledDate: values.scheduledDate,
        timeSlot: values.timeSlot,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create order");
      }

      const { orderId, orderRef } = await res.json();

      if (values.paymentMethod === "GCASH") {
        const payRes = await fetch("/api/payment/gcash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, amount: total }),
        });
        if (!payRes.ok) throw new Error("Failed to create GCash payment link.");
        const payData = await payRes.json();
        if (payData.checkoutUrl) {
          clearCart(); // Only clear after payment link is confirmed
          window.location.href = payData.checkoutUrl;
        } else {
          throw new Error("Failed to create GCash payment link.");
        }
      } else {
        clearCart();
        router.push(`/track?q=${orderRef}`);
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const isDateBlocked = (date: string) => blockedDates.includes(date);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-5 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#E83A87] mb-2">Chocolate XLB</p>
          <h1 className="text-4xl md:text-5xl font-black">Order Now</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Products (always first) ── */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-3 gap-4">
              {MENU_ITEMS.map((item) => {
                const cartItem = items.find((i) => i.id === item.id && i.size === item.size);
                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={PRODUCT_IMAGES[item.id]}
                        alt={`${item.size} — ${item.pieces} pieces`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-black text-lg">{item.size}</p>
                          <p className="text-gray-400 text-xs">{item.pieces} pieces</p>
                        </div>
                        <p className="font-black text-lg text-[#E83A87]">{formatPrice(item.price)}</p>
                      </div>
                      {cartItem ? (
                        <div className="flex items-center justify-between border border-gray-200 rounded-full px-1 py-1">
                          <button type="button" onClick={() => updateQty(item.id, item.size, cartItem.qty - 1)}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors touch-manipulation">
                            <Minus size={14} />
                          </button>
                          <span className="font-black text-sm w-6 text-center">{cartItem.qty}</span>
                          <button type="button" onClick={() => updateQty(item.id, item.size, cartItem.qty + 1)}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors touch-manipulation">
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button type="button"
                          onClick={() => addToCart({ id: item.id, size: item.size, pieces: item.pieces, price: item.price, qty: 1 })}
                          className="w-full bg-black text-white rounded-full py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
                          + Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Sticky cart (spans both rows on desktop) ── */}
          <div className="lg:col-span-1 lg:row-span-2">
            <div className="sticky top-20 bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="font-black text-lg">Your Cart</p>
              </div>

              {items.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-gray-400 text-sm">No items yet.</p>
                  <p className="text-gray-300 text-xs mt-1">Add sizes above to start your order.</p>
                </div>
              ) : (
                <div className="px-6 py-5">
                  <div className="space-y-4 mb-5">
                    {items.map((item: CartItem) => (
                      <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image src={PRODUCT_IMAGES[item.id]} alt={item.size} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm">{item.size}</p>
                          <p className="text-gray-400 text-xs">{item.pieces} pcs · {formatPrice(item.price)} each</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button type="button" onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors touch-manipulation">
                            <Minus size={12} />
                          </button>
                          <span className="w-5 text-center font-black text-sm">{item.qty}</span>
                          <button type="button" onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors touch-manipulation">
                            <Plus size={12} />
                          </button>
                          <button type="button" onClick={() => removeFromCart(item.id, item.size)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors touch-manipulation">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-bold text-black">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-bold">−{formatPrice(discount)}</span>
                      </div>
                    )}
                    {deliveryMethod === "DELIVERY" && effectiveDeliveryFee > 0 && (
                      <div className="flex justify-between text-gray-500">
                        <span>Delivery</span>
                        <span className="font-bold text-black">{formatPrice(effectiveDeliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-base border-t border-gray-100 pt-2">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Form (below products on desktop) ── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Schedule */}
              <div className={sectionClass}>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E83A87] mb-1">Step 1</p>
                <h2 className="font-black text-xl mb-5">Schedule</h2>
                <div className="grid sm:grid-cols-2 gap-4 overflow-hidden">
                  <Field label="Date" error={errors.scheduledDate?.message}>
                    <input
                      type="date"
                      min={format(addDays(new Date(), 1), "yyyy-MM-dd")}
                      {...register("scheduledDate")}
                      className={`${inputClass} min-w-0 max-w-full ${scheduledDate && isDateBlocked(scheduledDate) ? "border-red-400 ring-2 ring-red-200" : ""}`}
                    />
                    {scheduledDate && isDateBlocked(scheduledDate) && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">This date is unavailable. Please choose another.</p>
                    )}
                    {blockedDates.length > 0 && !(scheduledDate && isDateBlocked(scheduledDate)) && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        Unavailable dates: {blockedDates.join(", ")}
                      </p>
                    )}
                  </Field>
                  <Field label="Time Slot" error={errors.timeSlot?.message}>
                    <select {...register("timeSlot")} className={inputClass}>
                      <option value="">Select a time slot</option>
                      {TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Delivery */}
              <div className={sectionClass}>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E83A87] mb-1">Step 2</p>
                <h2 className="font-black text-xl mb-5">Delivery Method</h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { value: "PICKUP", label: "Pickup", sub: "Free · Brgy. Tibig, Lipa City" },
                    { value: "DELIVERY", label: "Delivery", sub: "Via Lalamove · fee calculated" },
                  ].map((opt) => (
                    <label key={opt.value}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${deliveryMethod === opt.value ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}>
                      <input type="radio" value={opt.value} {...register("deliveryMethod")} className="sr-only" />
                      <p className="font-black text-sm">{opt.label}</p>
                      <p className={`text-xs mt-0.5 ${deliveryMethod === opt.value ? "text-gray-300" : "text-gray-400"}`}>{opt.sub}</p>
                    </label>
                  ))}
                </div>

                {deliveryMethod === "DELIVERY" && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Pin Your Location</label>
                      <MapPicker onSelect={handleMapSelect} />
                      {addressError && (
                        <p className="text-[#E83A87] text-xs mt-1.5 font-medium">{addressError}</p>
                      )}
                    </div>
                    <button type="button" onClick={handleGetDeliveryFee} disabled={fetchingFee || !mapAddress}
                      className="border border-black rounded-full px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all disabled:opacity-40">
                      {fetchingFee ? "Calculating..." : "Get Delivery Fee"}
                    </button>
                    {deliveryFeeChecked && deliveryAvailable && deliveryFee > 0 && (
                      <p className="text-sm font-bold text-green-700">
                        Delivery fee: {formatPrice(deliveryFee)}
                      </p>
                    )}
                    {deliveryFeeChecked && !deliveryAvailable && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
                        Delivery unavailable for this area. Please select Pickup instead.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Promo */}
              <div className={sectionClass}>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E83A87] mb-1">Step 3</p>
                <h2 className="font-black text-xl mb-5">Promo Code <span className="text-gray-400 font-normal text-base">(optional)</span></h2>
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter promo code"
                    {...register("promoCode")} className={`${inputClass} flex-1 uppercase`} />
                  <button type="button" onClick={handleApplyPromo}
                    className="bg-black text-white rounded-full px-5 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors whitespace-nowrap">
                    Apply
                  </button>
                </div>
                {promoResult && (
                  <p className={`text-sm mt-2 font-bold ${promoResult.valid ? "text-green-600" : "text-[#E83A87]"}`}>
                    {promoResult.valid
                      ? `${promoResult.partnerName} promo applied! You save ${formatPrice(discount)}`
                      : (promoResult.message ?? "Invalid or inactive promo code.")}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className={sectionClass}>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E83A87] mb-1">Step 4</p>
                <h2 className="font-black text-xl mb-5">Order Notes <span className="text-gray-400 font-normal text-base">(optional)</span></h2>
                <textarea rows={3} placeholder="Any special requests or instructions..."
                  {...register("orderNotes")}
                  className={`${inputClass} resize-none`} />
              </div>

              {/* Payment */}
              <div className={sectionClass}>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E83A87] mb-1">Step 5</p>
                <h2 className="font-black text-xl mb-5">Payment Method</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "GCASH", label: "GCash", sub: "via PayMongo" },
                    { value: "CARD", label: "Card", sub: "Credit / Debit" },
                  ].map((opt) => (
                    <label key={opt.value}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === opt.value ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}>
                      <input type="radio" value={opt.value} {...register("paymentMethod")} className="sr-only" />
                      <p className="font-black text-sm">{opt.label}</p>
                      <p className={`text-xs mt-0.5 ${paymentMethod === opt.value ? "text-gray-300" : "text-gray-400"}`}>{opt.sub}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer info */}
              <div className={sectionClass}>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E83A87] mb-1">Step 6</p>
                <h2 className="font-black text-xl mb-5">Your Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name" error={errors.customerName?.message}>
                    <input type="text" placeholder="Juan dela Cruz"
                      {...register("customerName")} className={inputClass} />
                  </Field>
                  <Field label="Mobile Number" error={errors.mobileNumber?.message}>
                    <input type="tel" placeholder="09XXXXXXXXX"
                      {...register("mobileNumber")} className={inputClass} />
                  </Field>
                </div>
              </div>

              {/* Cancellation notice */}
              <div className="border-2 border-black rounded-2xl p-5 bg-black text-white">
                <p className="font-black text-sm tracking-wide">
                  ⚠ NO CANCELLATIONS
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  Once your order is submitted, it cannot be cancelled. Your ₱50 reservation fee is non-refundable. Please review your order carefully before proceeding.
                </p>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-[#E83A87] text-sm font-medium">
                  {submitError}
                </div>
              )}

              <button type="submit" disabled={submitting || items.length === 0}
                className="w-full bg-[#E83A87] text-white hover:bg-black rounded-full py-5 font-black text-sm tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                {submitting ? "Processing..." : `Pay ${formatPrice(total)}`}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
