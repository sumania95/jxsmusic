import { atom } from "jotai"

export type TagItem = {
  id: string
  name: string
  slug: string
}

export const tagItemsAtom = atom<TagItem[]>([])

/**
 * Derived helpers (optional but very useful)
 */
export const tagByIdAtom = atom((get) =>
  Object.fromEntries(get(tagItemsAtom).map(t => [t.id, t]))
)

export const tagBySlugAtom = atom((get) =>
  Object.fromEntries(get(tagItemsAtom).map(t => [t.slug, t]))
)

export const tagCountAtom = atom((get) => get(tagItemsAtom).length)
