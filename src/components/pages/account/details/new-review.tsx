"use client"

import { useState } from "react"
import { toast } from "sonner"

import { api } from "@/utils/api"

const NewReview = () => {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")

  const create = api.reviews.create.useMutation({
    onSuccess: () => {
      setRating(5)
      setTitle("")
      setMessage("")
      toast.success("Review submitted")
    },
    onError: (error) => {
      toast.error(error.message || "Unable to submit review")
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    create.mutate({
      rating,
      title: title.trim() || undefined,
      message: message.trim(),
    })
  }

  return (
    <div className="w-full text-white">
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-[#171d20] p-5 sm:p-6"
      >
        <label className="block text-sm font-medium text-white/70">
          Rating

          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#111518] p-3 text-white outline-none transition focus:border-[#B9FF00]/60 focus:ring-1 focus:ring-[#B9FF00]/30"
          >
            {[5, 4, 3, 2, 1].map((number) => (
              <option key={number} value={number}>
                {number} {number === 1 ? "star" : "stars"}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-white/70">
          Review title
          <span className="ml-1 text-white/30">(optional)</span>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={100}
            placeholder="Give your review a title"
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#111518] p-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#B9FF00]/60 focus:ring-1 focus:ring-[#B9FF00]/30"
          />
        </label>

        <label className="block text-sm font-medium text-white/70">
          Your review

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            minLength={10}
            maxLength={2000}
            required
            rows={6}
            placeholder="Tell other DJs about your experience"
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#111518] p-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#B9FF00]/60 focus:ring-1 focus:ring-[#B9FF00]/30"
          />

          <span className="mt-1 block text-right text-xs text-white/30">
            {message.length}/2000
          </span>
        </label>

        <button
          type="submit"
          disabled={create.isPending || message.trim().length < 10}
          className="rounded-xl bg-[#B9FF00] px-5 py-3 font-bold text-black transition hover:bg-[#a7e600] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {create.isPending ? "Submitting..." : "Submit review"}
        </button>
      </form>
    </div>
  )
}

export default NewReview