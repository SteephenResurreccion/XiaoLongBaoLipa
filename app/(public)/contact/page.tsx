const FB_URL = "https://www.facebook.com/share/1Gm8jj1p9N/?mibextid=wwXIfr";
const TIKTOK_URL = "#"; // Add TikTok URL when available

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-10">
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#E83A87] mb-2">Get in touch</p>
          <h1 className="text-4xl md:text-5xl font-black">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 py-12">
        <p className="text-gray-500 text-base mb-10 leading-relaxed">
          The fastest way to reach us is through our social media pages. Message us on Facebook or TikTok and we&apos;ll get back to you as soon as possible.
        </p>

        {/* Social cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <a href={FB_URL} target="_blank" rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-4 hover:border-black transition-colors">
            <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-black group-hover:text-[#1877F2] transition-colors">Facebook</p>
              <p className="text-gray-400 text-xs mt-0.5">Xiao Long Bow</p>
            </div>
          </a>

          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-4 hover:border-black transition-colors">
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-black group-hover:text-gray-600 transition-colors">TikTok</p>
              <p className="text-gray-400 text-xs mt-0.5">@XiaoLongBow</p>
            </div>
          </a>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl border border-gray-100 p-7">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Location</p>
          <p className="font-black text-lg mb-1">Xiao Long Bow</p>
          <p className="text-gray-600 text-sm">Brgy. Tibig, Lipa City, Batangas 4217</p>
          <p className="text-gray-400 text-xs mt-3">
            Exact pickup address shared via SMS after your order is confirmed.
          </p>
          <div className="mt-5 pt-5 border-t border-gray-100 text-sm text-gray-500 space-y-1">
            <p>
              For order inquiries →{" "}
              <a href="/track" className="font-bold text-black underline underline-offset-2">
                Track Order
              </a>
            </p>
            <p>
              Want to partner with us →{" "}
              <a href="/reseller" className="font-bold text-black underline underline-offset-2">Reseller</a>
              {" "}·{" "}
              <a href="/commissioner" className="font-bold text-black underline underline-offset-2">Affiliate</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
