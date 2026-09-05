import { atom } from "jotai";

export type UploadItem = {
  id: string;
  name: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string
};

export const uploadListAtom = atom<UploadItem[]>([]);

export const addUploadsAtom = atom(
  null,
  (get, set, items: UploadItem[]) => {
    const existing = get(uploadListAtom)

    const merged = [
      ...existing,
      ...items.filter(
        (item) => !existing.some((u) => u.id === item.id)
      ),
    ]

    set(uploadListAtom, merged)
  }
)

export const updateUploadAtom = atom(
  null,
  (get, set, payload: Partial<UploadItem> & { id: string }) => {
    const updated = get(uploadListAtom).map((u) =>
      u.id === payload.id ? { ...u, ...payload } : u
    )

    // ✅ APPLY UPDATE
    set(uploadListAtom, updated)

    // ✅ Remove completed uploads after delay
    if (payload.status === "done") {
        const id = payload.id

        setTimeout(() => {
            const current = get(uploadListAtom)
            set(
            uploadListAtom,
            current.filter((u) => u.id !== id)
            )
        }, 300)
    }

  }
)


export const removeUploadAtom = atom(
  null,
  (get, set, id: string) => {
    const current = get(uploadListAtom)

    set(
      uploadListAtom,
      current.filter((u) => u.id !== id)
    )
  }
)


export type UploadedTrack = {
  id: string
  download_key: string | null
  title: string | null
  artist: string | null
  filename: string | null
  description: string | null
  duration: number
  bpm_start: number
  bpm_end: number
  in_key: string | null
  releaseAt: Date
}

export type UploadedTracksState = {
  count: {
    _count: {
      id: number
    }
  }
  tracks: UploadedTrack[]
}

export const uploadedTracksAtom = atom<UploadedTracksState>({
  count: { _count: { id: 0 } },
  tracks: [],
})


export const addUploadedTrackAtom = atom(
  null,
  (
    get,
    set,
    payload: {
      track: UploadedTrack
      limit: number
      page: number
    }
  ) => {
    const current = get(uploadedTracksAtom)

    // ✅ Always update TOTAL count
    const nextCount = {
      _count: {
        id: current.count._count.id + 1,
      },
    }

    // ❌ Only mutate tracks on page 1
    if (payload.page !== 1) {
      set(uploadedTracksAtom, {
        count: nextCount,
        tracks: current.tracks,
      })
      return
    }

    // Add to top
    const nextTracks = [payload.track, ...current.tracks]

    // Trim to page size
    const trimmed =
      nextTracks.length > payload.limit
        ? nextTracks.slice(0, payload.limit)
        : nextTracks

    set(uploadedTracksAtom, {
      count: nextCount,
      tracks: trimmed,
    })
  }
)
