const TrackListHeader = () => {
  return (
    <div
      className="
        hidden
        w-full
        grid-cols-[40px_40px_minmax(180px,1fr)_56px_80px_128px_64px_56px_154px]
        items-center
        gap-4
        border-b
        border-white/[0.06]
        bg-white/[0.015]
        px-4
        py-3
        md:grid
      "
    >
      {/* Play */}
      <div />

      {/* Avatar */}
      <div />

      {/* Track */}
      <div>
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
          Track
        </span>
      </div>

      {/* Key */}
      <div className="text-center">
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
          Key
        </span>
      </div>

      {/* BPM */}
      <div className="text-center">
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
          BPM
        </span>
      </div>

      {/* Genre */}
      <div>
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
          Genre
        </span>
      </div>

      {/* Type */}
      <div>
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
          Type
        </span>
      </div>

      {/* Duration */}
      <div className="text-center">
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
          Time
        </span>
      </div>

      {/* Price */}
      <div className="text-end mr-2">
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
          Price
        </span>
      </div>
    </div>
  )
}

export default TrackListHeader