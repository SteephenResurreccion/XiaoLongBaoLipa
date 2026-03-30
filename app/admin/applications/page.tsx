"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

interface ResellerApp {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  reason: string;
  experience: string | null;
  createdAt: string;
}

interface CommissionerApp {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  platform: string;
  followers: string | null;
  reason: string;
  createdAt: string;
}

type Tab = "resellers" | "commissioners";

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("resellers");
  const [resellers, setResellers] = useState<ResellerApp[]>([]);
  const [commissioners, setCommissioners] = useState<CommissionerApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((data) => {
        setResellers(data.resellers || []);
        setCommissioners(data.commissioners || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-[#3D1A00] mb-8">Applications</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["resellers", "commissioners"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors capitalize ${
              activeTab === tab
                ? "bg-[#3D1A00] text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab} ({tab === "resellers" ? resellers.length : commissioners.length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : activeTab === "resellers" ? (
        resellers.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No reseller applications</div>
        ) : (
          <div className="space-y-4">
            {resellers.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div>
                    <p className="font-bold text-[#3D1A00]">{a.name}</p>
                    <p className="text-gray-500 text-sm">
                      {a.mobile} · {a.email}
                    </p>
                    <p className="text-gray-500 text-sm">{a.address}</p>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {format(new Date(a.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Why they want to resell</p>
                    <p className="text-gray-700">{a.reason}</p>
                  </div>
                  {a.experience && (
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Experience</p>
                      <p className="text-gray-700">{a.experience}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : commissioners.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No commissioner applications</div>
      ) : (
        <div className="space-y-4">
          {commissioners.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-[#3D1A00]">{a.name}</p>
                  <p className="text-gray-500 text-sm">
                    {a.mobile} · {a.email}
                  </p>
                  <p className="text-gray-500 text-sm">{a.address}</p>
                </div>
                <p className="text-gray-400 text-xs">
                  {format(new Date(a.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Platform</p>
                  <p className="text-gray-700">{a.platform}</p>
                </div>
                {a.followers && (
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Audience</p>
                    <p className="text-gray-700">{a.followers}</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <p className="text-gray-400 text-xs mb-0.5">Why they want to partner</p>
                  <p className="text-gray-700">{a.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
