"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name:      z.string().min(2, "Name must be at least 2 characters"),
  mobile:    z.string().regex(/^09\d{9}$/, "Format: 09XXXXXXXXX"),
  email:     z.string().email("Please enter a valid email"),
  address:   z.string().min(10, "Please enter your full address"),
  platform:  z.string().min(2, "Please specify your platform"),
  followers: z.string().optional(),
  reason:    z.string().min(20, "Please tell us more (at least 20 characters)"),
});

type FormData = z.infer<typeof schema>;

const inputClass = "border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white";
const labelClass = "block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2";

export default function CommissionerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const res = await fetch("/api/commissioner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#E83A87] flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-black">OK</span>
          </div>
          <h2 className="text-2xl font-black mb-3">Application Received!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Thank you for your interest in becoming a Xiao Long Bow affiliate.
            We will review your application and reach out via SMS soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-5 py-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#E83A87] mb-2">Partner with us</p>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Become an Affiliate</h1>
          <p className="text-gray-500 text-base max-w-lg">
            Promote Xiao Long Bow on your platform and earn commission on every order you drive.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { title: "Earn commission", desc: "Get paid for every order placed through your promo code." },
            { title: "Free samples", desc: "Products to feature and share with your audience." },
            { title: "Exclusive code", desc: "Your own promo code to give your followers a discount." },
          ].map((perk) => (
            <div key={perk.title} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="w-8 h-8 rounded-full bg-[#E83A87] mb-3" />
              <p className="font-black text-sm mb-1">{perk.title}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input {...register("name")} className={inputClass} placeholder="Your full name" />
              {errors.name && <p className="text-[#E83A87] text-xs mt-1.5 font-medium">{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Mobile Number</label>
              <input {...register("mobile")} className={inputClass} placeholder="09XXXXXXXXX" />
              {errors.mobile && <p className="text-[#E83A87] text-xs mt-1.5 font-medium">{errors.mobile.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input {...register("email")} type="email" className={inputClass} placeholder="you@email.com" />
              {errors.email && <p className="text-[#E83A87] text-xs mt-1.5 font-medium">{errors.email.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input {...register("address")} className={inputClass} placeholder="Your full address" />
              {errors.address && <p className="text-[#E83A87] text-xs mt-1.5 font-medium">{errors.address.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Platform / Channel</label>
              <input {...register("platform")} className={inputClass} placeholder="e.g. Facebook, TikTok, Instagram" />
              {errors.platform && <p className="text-[#E83A87] text-xs mt-1.5 font-medium">{errors.platform.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Followers / Audience (optional)</label>
              <input {...register("followers")} className={inputClass} placeholder="e.g. 5,000 followers" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Why do you want to partner with us?</label>
            <textarea {...register("reason")} rows={4} className={`${inputClass} resize-none`}
              placeholder="Tell us about yourself and why you'd be a great partner..." />
            {errors.reason && <p className="text-[#E83A87] text-xs mt-1.5 font-medium">{errors.reason.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-[#E83A87] text-sm font-medium">{error}</div>
          )}

          <button type="submit" disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-[#E83A87] rounded-full py-4 font-black text-sm tracking-widest uppercase transition-all disabled:opacity-40">
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
