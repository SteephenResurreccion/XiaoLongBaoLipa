"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const FB_URL = "https://www.facebook.com/share/1Gm8jj1p9N/?mibextid=wwXIfr";
const TIKTOK_URL = "#"; // Add TikTok URL when available

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

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
      <div className="bg-black text-white text-xs py-2.5 overflow-hidden">
        <div className="marquee-track whitespace-nowrap font-medium tracking-wide">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="px-8">
              🥟 Handmade in Brgy. Tibig, Lipa City &nbsp;·&nbsp; Order now for delivery &amp; pickup &nbsp;·&nbsp; No minimum order &nbsp;·&nbsp; Molten chocolate inside every bite
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 h-14 grid grid-cols-3 items-center">

          {/* Left: desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold tracking-widest uppercase text-black hover:text-[#E83A87] transition-colors"
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
              className="text-black p-1"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Center: logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex flex-col items-center leading-none">
              <span className="text-base font-black tracking-tight text-black uppercase whitespace-nowrap">
                Xiao Long Bow
              </span>
              <span className="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-medium">
                Chocolate XLB
              </span>
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center justify-end gap-6">
            <div className="hidden md:flex items-center gap-7">
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-semibold tracking-widest uppercase text-black hover:text-[#E83A87] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a href={FB_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="text-black hover:text-[#E83A87] transition-colors hidden sm:block">
                <FacebookIcon />
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="text-black hover:text-[#E83A87] transition-colors hidden sm:block">
                <TikTokIcon />
              </a>
              <Link href="/menu" className="relative text-black hover:text-[#E83A87] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E83A87] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden bg-white border-t border-gray-100 px-5 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold tracking-widest uppercase text-black hover:text-[#E83A87] transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <a href={FB_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="text-black hover:text-[#E83A87] transition-colors">
                <FacebookIcon />
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="text-black hover:text-[#E83A87] transition-colors">
                <TikTokIcon />
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
