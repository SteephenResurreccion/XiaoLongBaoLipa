"use client";

import { useEffect, useState } from "react";

interface Settings {
  isOpen: boolean;
  closedMessage: string;
}

export default function SiteClosedBanner() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  if (!settings || settings.isOpen) return null;

  return (
    <div className="bg-rose-300 text-[#3D1A00] text-center px-4 py-3 font-semibold text-sm">
      {settings.closedMessage}
    </div>
  );
}
