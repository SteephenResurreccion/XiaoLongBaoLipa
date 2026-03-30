"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  partnerName: string;
  discountType: string;
  discountValue: number;
  isActive: boolean;
  orders: { id: string; orderRef: string }[];
}

export default function PromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    partnerName: "",
    discountType: "fixed",
    discountValue: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/promo-codes")
      .then((r) => r.json())
      .then((data) => {
        setCodes(data);
        setLoading(false);
      });
  }, []);

  const createCode = async () => {
    setError("");
    if (!form.code || !form.partnerName || !form.discountValue) {
      setError("All fields are required");
      return;
    }
    setCreating(true);
    const res = await fetch("/api/admin/promo-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        code: form.code.toUpperCase(),
        discountValue: parseFloat(form.discountValue),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setCodes((prev) => [{ ...data, orders: [] }, ...prev]);
      setForm({ code: "", partnerName: "", discountType: "fixed", discountValue: "" });
      setShowForm(false);
    } else {
      setError(data.error || "Failed to create code");
    }
    setCreating(false);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const res = await fetch(`/api/admin/promo-codes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) {
      setCodes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c))
      );
    }
  };

  const deleteCode = async (id: string) => {
    await fetch(`/api/admin/promo-codes/${id}`, { method: "DELETE" });
    setCodes((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#3D1A00]">Promo Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#3D1A00] text-white rounded-full px-5 py-2 font-semibold hover:bg-[#7B3F00] transition-colors text-sm"
        >
          <Plus size={16} />
          New Code
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-[#3D1A00] mb-4">Create Promo Code</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#3D1A00] mb-1">
                Code
              </label>
              <input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-rose-300 font-mono uppercase"
                placeholder="PARTNER10"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3D1A00] mb-1">
                Partner Name
              </label>
              <input
                value={form.partnerName}
                onChange={(e) => setForm((f) => ({ ...f, partnerName: e.target.value }))}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Partner / Reseller name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3D1A00] mb-1">
                Discount Type
              </label>
              <select
                value={form.discountType}
                onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                <option value="fixed">Fixed (₱)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#3D1A00] mb-1">
                Discount Value
              </label>
              <input
                type="number"
                min="1"
                value={form.discountValue}
                onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder={form.discountType === "fixed" ? "20" : "10"}
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-3">{error}</p>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={createCode}
              disabled={creating}
              className="bg-[#3D1A00] text-white rounded-full px-6 py-2 font-semibold hover:bg-[#7B3F00] transition-colors disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Code"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-gray-200 rounded-full px-6 py-2 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Codes List */}
      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : codes.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No promo codes yet</div>
      ) : (
        <div className="space-y-3">
          {codes.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-wrap items-center justify-between gap-4 ${
                c.isActive ? "border-gray-100" : "border-gray-100 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-[#3D1A00]">{c.code}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      c.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{c.partnerName}</p>
                <p className="text-sm text-gray-500">
                  {c.discountType === "fixed"
                    ? `${formatPrice(c.discountValue)} off`
                    : `${c.discountValue}% off`}{" "}
                  · Used {c.orders.length} times
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(c.id, c.isActive)}
                  className="text-gray-400 hover:text-[#3D1A00] transition-colors"
                  title={c.isActive ? "Deactivate" : "Activate"}
                >
                  {c.isActive ? (
                    <ToggleRight size={22} className="text-green-600" />
                  ) : (
                    <ToggleLeft size={22} />
                  )}
                </button>
                <button
                  onClick={() => deleteCode(c.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
