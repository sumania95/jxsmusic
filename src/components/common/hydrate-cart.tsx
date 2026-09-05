import { useAtom } from "jotai"
import { useEffect } from "react"
import { api } from "@/utils/api"
import { cartItemsAtom } from "@/state/cartAtoms"
import { useSession } from "next-auth/react"

const CartHydrator = () => {
  const [, setCart] = useAtom(cartItemsAtom)
  const { data: session } = useSession()

  const { data } = api.cart.getAll.useQuery(undefined, {
    enabled: !!session?.user,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    // logout → clear cart
    if (!session?.user) {
      setCart([])
      return
    }

    // logged in + data ready → hydrate
    if (data) {
      const normalized = data.map(item => ({
        id: item.id,
        trackId: item.track?.id ?? null,
        albumId: item.album?.id ?? null,
      }))

      setCart(normalized)
    }
  }, [session?.user, data, setCart])

  return null
}

export default CartHydrator
