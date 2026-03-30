import Link from "next/link";
import Image from "next/image";

const FB_URL = "https://www.facebook.com/share/1Gm8jj1p9N/?mibextid=wwXIfr";
const TIKTOK_URL = "#"; // Add TikTok URL when available

const steps = [
  { num: "01", title: "Pick Your Size", desc: "Small, Medium, or Large — mix and match in one order." },
  { num: "02", title: "Choose Date & Time", desc: "Select your preferred pickup or delivery schedule." },
  { num: "03", title: "Delivery or Pickup", desc: "Free pickup, or we deliver via Lalamove to your door." },
  { num: "04", title: "Promo Code", desc: "Have a partner code? Apply it for an exclusive discount." },
  { num: "05", title: "Pay Reservation Fee", desc: "Secure your slot with ₱50 — deducted from your total." },
  { num: "06", title: "SMS Confirmation", desc: "We confirm via SMS within 24 hours. That's it." },
];

const sizes = [
  { size: "Small",  pieces: 5,  price: 99,  img: "/size-small.jpg",  desc: "Perfect for one." },
  { size: "Medium", pieces: 10, price: 169, img: "/size-medium.jpg", desc: "Ideal for sharing." },
  { size: "Large",  pieces: 15, price: 219, img: "/size-large.jpg",  desc: "Made for the group." },
];

export default function HomePage() {
  return (
    <div className="bg-white text-black">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden bg-black">
        <Image
          src="/hero.jpg"
          alt="Chocolate Xiao Long Bao with molten chocolate dripping"
          fill
          priority
          className="object-cover object-center opacity-80"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 pb-16 md:pb-24">
          <div className="max-w-2xl fade-in-up">
            <span className="inline-block text-[#E83A87] text-xs font-bold tracking-[0.25em] uppercase mb-5">
              Brgy. Tibig, Lipa City, Batangas · Est. 2026
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6">
              Molten<br />
              <span className="text-[#E83A87]">Chocolate</span><br />
              Inside.
            </h1>
            <p className="text-white/70 text-lg md:text-xl mb-10 font-light max-w-md leading-relaxed">
              Handmade Xiao Long Bao filled with rich, flowing chocolate.
              Made fresh, ordered online, delivered to you in Lipa City.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="bg-[#E83A87] text-white hover:bg-white hover:text-black rounded-full px-8 py-4 font-bold text-sm tracking-widest uppercase transition-all"
              >
                Order Now
              </Link>
              <Link
                href="/track"
                className="border border-white/50 text-white hover:bg-white hover:text-black rounded-full px-8 py-4 font-bold text-sm tracking-widest uppercase transition-all"
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MENU ── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#E83A87] mb-3">The Menu</p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                One flavor.<br />Three sizes.
              </h2>
            </div>
            <Link
              href="/menu"
              className="self-start md:self-auto border border-black rounded-full px-7 py-3 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all"
            >
              Order Now →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sizes.map((item) => (
              <Link key={item.size} href="/menu" className="group block">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-5">
                  <Image
                    src={item.img}
                    alt={`${item.size} — ${item.pieces} pieces`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-black text-xl">{item.size}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{item.pieces} pcs · {item.desc}</p>
                  </div>
                  <p className="font-black text-xl text-[#E83A87]">₱{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-black py-5 overflow-hidden">
        <div className="marquee-track text-white text-sm font-bold tracking-widest uppercase whitespace-nowrap">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="px-8">
              Chocolate Xiao Long Bao &nbsp;·&nbsp; Made Fresh &nbsp;·&nbsp; Lipa City Batangas &nbsp;·&nbsp; Order Online &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW TO ORDER ── */}
      <section className="py-20 md:py-28 px-5 bg-[#FDF6EC]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#E83A87] mb-3">The Process</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">How to order.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-5">
                <span className="text-3xl font-black text-[#E83A87] leading-none shrink-0">{step.num}</span>
                <div>
                  <h3 className="font-black text-lg mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPLIT FEATURE ── */}
      <section className="grid md:grid-cols-2 min-h-[60vh]">
        <div className="relative min-h-[50vh] md:min-h-0">
          <Image
            src="/product-hero.jpg"
            alt="Chocolate Xiao Long Bao steaming"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="bg-black text-white flex flex-col justify-center px-10 md:px-16 py-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#E83A87] mb-4">No minimum order</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
            Order as many<br />or as few as<br />you want.
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-8 max-w-sm">
            Start with a Small (5 pcs) or go all-in with a Large (15 pcs).
            Mix sizes in one order. Reserve your slot with just ₱50.
          </p>
          <Link
            href="/menu"
            className="self-start bg-[#E83A87] text-white hover:bg-white hover:text-black rounded-full px-8 py-4 font-bold text-sm tracking-widest uppercase transition-all"
          >
            Order Now
          </Link>
        </div>
      </section>

      {/* ── SOCIAL ── */}
      <section className="py-20 md:py-28 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#E83A87] mb-4">Stay Connected</p>
          <h2 className="text-4xl md:text-5xl font-black mb-6">Follow our<br />journey.</h2>
          <p className="text-gray-500 text-base mb-10 leading-relaxed">
            Behind-the-scenes, new updates, and sneak peeks on our social media.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href={FB_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black text-white hover:bg-[#1877F2] rounded-full px-7 py-3.5 font-bold text-sm tracking-widest uppercase transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
              Facebook
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black text-white hover:bg-gray-800 rounded-full px-7 py-3.5 font-bold text-sm tracking-widest uppercase transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z" />
              </svg>
              TikTok
            </a>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[#E83A87] py-20 md:py-28 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready for your<br />molten moment?
          </h2>
          <p className="text-white/80 text-lg mb-10">Small batch. Made fresh. Reserve yours today.</p>
          <Link
            href="/menu"
            className="inline-block bg-black text-white hover:bg-white hover:text-black rounded-full px-10 py-5 font-bold text-sm tracking-widest uppercase transition-all"
          >
            Order Now
          </Link>
        </div>
      </section>

    </div>
  );
}
