import Link from "next/link";

const FB_URL = "https://www.facebook.com/share/1Gm8jj1p9N/?mibextid=wwXIfr";
const TIKTOK_URL = "#"; // Add TikTok URL when available

const links = [
  { label: "Order Now", href: "/menu" },
  { label: "Track Order", href: "/track" },
  { label: "Contact", href: "/contact" },
  { label: "Become a Reseller", href: "/reseller" },
  { label: "Become an Affiliate", href: "/commissioner" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-5 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-2xl font-black tracking-tight mb-1">Xiao Long Bow</p>
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-5">
              Chocolate XLB · Brgy. Tibig, Lipa City, Philippines
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Handmade Chocolate Xiao Long Bao. Molten filling, delicate dough, made fresh for every order. Since 2026.
            </p>
            <div className="flex gap-4 mt-6">
              <a href={FB_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-5">Navigate</p>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-5">Order</p>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              Fresh Chocolate XLB, made to order. Pay securely online via GCash or card.
            </p>
            <Link
              href="/menu"
              className="inline-block bg-[#E83A87] text-white rounded-full px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
            >
              Order Now
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-600 text-xs">
          <p>© 2026 Xiao Long Bow. Handmade in Brgy. Tibig, Lipa City, Batangas 4217.</p>
          <p>Chocolate Xiao Long Bao · Philippines</p>
        </div>
      </div>
    </footer>
  );
}
