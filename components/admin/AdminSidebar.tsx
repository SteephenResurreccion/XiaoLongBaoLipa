"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarOff,
  Tag,
  Users,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/availability", label: "Availability", icon: CalendarOff },
  { href: "/admin/promo-codes", label: "Promo Codes", icon: Tag },
  { href: "/admin/applications", label: "Applications", icon: Users },
];

export default function AdminSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#3D1A00] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-[#7B3F00]">
        <div className="text-2xl mb-1">🥟</div>
        <p className="font-bold text-lg">Xiao Long Bow</p>
        <p className="text-rose-300 text-xs">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                active
                  ? "bg-rose-300 text-[#3D1A00]"
                  : "text-rose-100 hover:bg-[#7B3F00]"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#7B3F00]">
        {email && (
          <p className="text-rose-300 text-xs mb-3 truncate">{email}</p>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 text-rose-200 hover:text-white text-sm transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
