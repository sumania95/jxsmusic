export default function AdminUserItemSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-xl bg-white/[0.06]" />

        <div className="min-w-0 flex-1">
          <div className="h-3.5 w-36 rounded bg-white/[0.06]" />
          <div className="mt-2 h-2.5 w-24 rounded bg-white/[0.04]" />
          <div className="mt-2 h-2.5 w-44 rounded bg-white/[0.04]" />
        </div>
      </div>

      <div className="hidden w-[110px] shrink-0 justify-center sm:flex">
        <div className="h-7 w-20 rounded-full bg-white/[0.05]" />
      </div>

      <div className="flex w-full justify-end gap-2 border-t border-white/[0.05] pt-3 lg:w-auto lg:min-w-[330px] lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
        <div className="hidden h-12 w-24 rounded-xl bg-white/[0.04] md:block" />
        <div className="h-12 w-24 rounded-xl bg-white/[0.04]" />
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2">
        <div className="h-9 w-9 rounded-xl bg-white/[0.05]" />
        <div className="h-9 w-9 rounded-xl bg-white/[0.05]" />
        <div className="h-9 w-9 rounded-xl bg-white/[0.05]" />
      </div>
    </div>
  );
}