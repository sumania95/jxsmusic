import { atom } from "jotai"

export type GenreItem = {
  id: string
  name: string
  slug: string
}

export const genreItemsAtom = atom<GenreItem[]>([])

/**
 * Optional derived atoms (nice to have)
 */
export const genreByIdAtom = atom((get) =>
  Object.fromEntries(get(genreItemsAtom).map(g => [g.id, g]))
)

export const genreBySlugAtom = atom((get) =>
  Object.fromEntries(get(genreItemsAtom).map(g => [g.slug, g]))
)
