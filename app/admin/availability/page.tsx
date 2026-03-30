"use client";

import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { Trash2 } from "lucide-react";

interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
}

interface SiteSettings {
  isOpen: boolean;
  closedMessage: string;
  pickupAddress: string;
}

export default function AvailabilityPage() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    isOpen: true,
    closedMessage: "We're currently closed. Check back soon!",
    pickupAddress: "Lipa City, Batangas",
  });
  const [newDate, setNewDate] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [newReason, setNewReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/dates").then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => r.json()),
    ]).then(([dates, s]) => {
      setBlockedDates(dates);
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const blockDate = async () => {
    if (!newDate) return;
    setBlocking(true);
    const res = await fetch("/api/admin/dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, reason: newReason || undefined }),
    });
    if (res.ok) {
      const blocked = await res.json();
      setBlockedDates((prev) => [...prev, blocked]);
      setNewReason("");
    }
    setBlocking(false);
  };

  const unblockDate = async (date: string) => {
    await fetch(`/api/admin/dates/${date}`, { method: "DELETE" });
    setBlockedDates((prev) => prev.filter((d) => d.date !== date));
  };

  const saveSettings = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-[#3D1A00]">Availability</h1>

      {/* Site Open/Closed Toggle */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-[#3D1A00]">Site Status</h2>
        <div className="flex items-center gap-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.isOpen}
              onChange={(e) =>
                setSettings((s) => ({ ...s, isOpen: e.target.checked }))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
          <span className="font-semibold">
            {settings.isOpen ? "Site is OPEN" : "Site is CLOSED"}
          </span>
        </div>

        {!settings.isOpen && (
          <div>
            <label className="block text-sm font-semibold text-[#3D1A00] mb-1">
              Closed Message
            </label>
            <input
              value={settings.closedMessage}
              onChange={(e) =>
                setSettings((s) => ({ ...s, closedMessage: e.target.value }))
              }
              className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-[#3D1A00] mb-1">
            Pickup Address
          </label>
          <input
            value={settings.pickupAddress}
            onChange={(e) =>
              setSettings((s) => ({ ...s, pickupAddress: e.target.value }))
            }
            className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-[#3D1A00] text-white rounded-full px-6 py-2 font-semibold hover:bg-[#7B3F00] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Block Dates */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-[#3D1A00]">Block Dates</h2>
        <p className="text-sm text-gray-500">
          Customers cannot select blocked dates when ordering.
        </p>

        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={newDate}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => setNewDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <input
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="Reason (optional)"
            className="border border-gray-200 rounded-lg px-4 py-2 flex-1 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <button
            onClick={blockDate}
            disabled={blocking}
            className="bg-[#3D1A00] text-white rounded-full px-6 py-2 font-semibold hover:bg-[#7B3F00] transition-colors disabled:opacity-50"
          >
            {blocking ? "Blocking..." : "Block Date"}
          </button>
        </div>

        <div className="space-y-2 mt-4">
          {blockedDates.length === 0 ? (
            <p className="text-gray-400 text-sm">No dates blocked</p>
          ) : (
            blockedDates.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                <div>
                  <span className="font-semibold text-red-700">{d.date}</span>
                  {d.reason && (
                    <span className="text-gray-500 text-sm ml-2">
                      — {d.reason}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => unblockDate(d.date)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
