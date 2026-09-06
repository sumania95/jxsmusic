const CouponSkeletonComponents = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.015]">
      <div className="flex w-full animate-pulse flex-col gap-4 px-4 py-4 md:grid md:grid-cols-[minmax(220px,1.4fr)_90px_150px_150px_110px_96px] md:items-center md:gap-4">
        {/* Coupon information */}
        <div className="flex min-w-0 items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-white/[0.06]" />

          <div className="min-w-0 flex-1">
            <div className="h-3.5 w-36 max-w-full rounded bg-white/[0.07]" />

            <div className="mt-2 flex items-center gap-2">
              <div className="h-5 w-20 rounded-lg bg-white/[0.05]" />
              <div className="h-5 w-16 rounded-full bg-white/[0.05]" />
            </div>

            {/* Mobile dates */}
            <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
              <div className="h-14 rounded-xl bg-white/[0.035]" />
              <div className="h-14 rounded-xl bg-white/[0.035]" />
            </div>
          </div>
        </div>

        {/* Year */}
        <div className="hidden md:block">
          <div className="h-2 w-8 rounded bg-white/[0.04]" />
          <div className="mt-2 h-3 w-10 rounded bg-white/[0.06]" />
        </div>

        {/* Start date */}
        <div className="hidden md:block">
          <div className="h-2 w-10 rounded bg-white/[0.04]" />

          <div className="mt-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-white/[0.04]" />
            <div className="h-2.5 w-24 rounded bg-white/[0.05]" />
          </div>
        </div>

        {/* Expiry date */}
        <div className="hidden md:block">
          <div className="h-2 w-12 rounded bg-white/[0.04]" />

          <div className="mt-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-white/[0.04]" />
            <div className="h-2.5 w-24 rounded bg-white/[0.05]" />
          </div>
        </div>

        {/* Status */}
        <div>
          <div className="hidden h-2 w-10 rounded bg-white/[0.04] md:block" />
          <div className="mt-2 h-6 w-16 rounded-full bg-white/[0.05]" />
        </div>

        {/* Edit and delete actions */}
        <div className="flex justify-end gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/[0.06]" />
          <div className="h-9 w-9 rounded-xl bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
};

export default CouponSkeletonComponents;