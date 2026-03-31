"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const FB_URL = "https://www.facebook.com/share/1Gm8jj1p9N/?mibextid=wwXIfr";

const navLinks = [
  { href: "/menu", label: "Order" },
  { href: "/track", label: "Track" },
  { href: "/reseller", label: "Resellers" },
  { href: "/commissioner", label: "Affiliates" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-black text-white text-[11px] py-2.5 overflow-hidden">
        <div className="marquee-track whitespace-nowrap font-medium tracking-[0.15em] uppercase">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="px-10">
              Handmade in Lipa City &nbsp;·&nbsp; Order for delivery &amp; pickup &nbsp;·&nbsp; No minimum order &nbsp;·&nbsp; Molten chocolate inside every bite
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#ffefda] border-b border-[#c6c6c6]">
        <div className="max-w-7xl mx-auto px-6 h-16 grid grid-cols-3 items-center">

          {/* Left: desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black hover:text-[#e83a87] transition-colors duration-[250ms]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile: hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="text-black p-2 -ml-2 touch-manipulation"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Center: logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex flex-col items-center gap-0.5 leading-none">
              <span className="font-display text-lg font-black tracking-tight text-black uppercase whitespace-nowrap">
                Xiao Long Bow
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#939393] uppercase font-medium">
                Chocolate XLB
              </span>
            </Link>
          </div>

          {/* Right: links + cart */}
          <div className="flex items-center justify-end gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black hover:text-[#e83a87] transition-colors duration-[250ms]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link href="/menu" className="relative text-black hover:text-[#e83a87] transition-colors duration-[250ms]">
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#e83a87] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden bg-[#ffefda] border-t border-[#c6c6c6] px-6 py-5 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-bold tracking-[0.2em] uppercase text-black hover:text-[#e83a87] transition-colors py-3.5 border-b border-[#c6c6c6] last:border-0 touch-manipulation"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={FB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold tracking-[0.2em] uppercase text-[#939393] hover:text-black transition-colors pt-4 touch-manipulation"
            >
              Facebook
            </a>
          </div>
        )}
      </nav>
    </>
  );
}
