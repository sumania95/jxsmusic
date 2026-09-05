import { atom } from "jotai"

export type CartItem = {
  id: string
  trackId: string | null
  albumId: string | null
}


export const cartItemsAtom = atom<CartItem[]>([])

export const cartByTrackIdAtom = atom((get) => {
  const items = get(cartItemsAtom)
  const map = new Map<string, CartItem>()

  for (const item of items) {
    if (item.trackId) map.set(item.trackId, item)
    if (item.albumId) map.set(item.albumId, item)
  }

  return map
})


export const cartCountAtom = atom((get) => {
  return get(cartItemsAtom).length
})