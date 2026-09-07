import { useState } from "react";
import { api } from "@/utils/api";
import { toast } from "sonner";
import HeaderWithCouponBanner from "../home/coupon";

export default function NewReview() {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const create = api.reviews.create.useMutation({
    onSuccess: () => {
      setTitle("");
      setMessage("");
      toast.success("Review submitted");
    }
  });
  return (
    <main className="w-full text-white">
      <HeaderWithCouponBanner
        title="Write a review"
        description="Your review appears publicly only after administrator approval."
      />
      <form className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-[#171d20] p-6" onSubmit={(e) => { e.preventDefault(); create.mutate({ rating, title: title || undefined, message }); }}>
        <label className="block text-sm">
          Rating
          <select value={rating} onChange={e => setRating(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-white/10 bg-[#111518] p-3">
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} stars</option>)}
          </select>
        </label>
        <input value={title} onChange={e => setTitle(e.target.value)} maxLength={100} placeholder="Review title (optional)" className="w-full rounded-xl border border-white/10 bg-[#111518] p-3" />
        <textarea value={message} onChange={e => setMessage(e.target.value)} minLength={10} required rows={6} placeholder="Tell other DJs about your experience" className="w-full rounded-xl border border-white/10 bg-[#111518] p-3" />
        <button disabled={create.isPending} className="rounded-xl bg-[#B9FF00] px-5 py-3 font-bold text-black">
          Submit review
        </button>
      </form>
    </main>
  )
}
