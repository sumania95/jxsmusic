import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { api } from '@/utils/api'
import { useFormik } from 'formik'
import { LoaderIcon, PenBox, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FaCaretDown, FaCartArrowDown, FaCartShopping } from 'react-icons/fa6'
import { toast } from 'sonner'
import * as Yup from 'yup'
import {
  cartByTrackIdAtom,
  cartItemsAtom
} from "@/state/cartAtoms"
import { useAtom } from 'jotai'
import DownloadTrackComponent from '@/components/common/download'


export const Schema = Yup.object().shape({
  id: Yup.string(),
})


type Props = {
  trackId: string | null
  albumId: string | null
  price: number
  id: string | null
  credits:number
}


const AddCartComponent = (props: Props) => {
  const router = useRouter()

  const { data: session } = useSession()


  const [, setCart] = useAtom(cartItemsAtom)

  const [cartMap] = useAtom(cartByTrackIdAtom)


  const checkExist =
    props.trackId
      ? cartMap.get(props.trackId)
      : props.albumId
      ? cartMap.get(props.albumId)
      : null


  const { mutateAsync: addCart } =
    api.cart.add.useMutation({
      onSuccess: async (data) => {
        setCart(prev => [
          ...prev,
          {
            id: data.id,
            trackId: data.trackId ?? null,
            albumId: data.albumId ?? null,
          },
        ])

        toast.success("Successfully added")
      },

      onError: (error) => {
        toast.error(error.message)
      }
    })


  const {
    isSubmitting,
    handleSubmit
  } = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: props.trackId ?? props.albumId,
    },

    validationSchema: Schema,

    onSubmit: async () => {
      if (session?.user.id) {
        await addCart({
          trackId: props.trackId,
          albumId: props.albumId ?? null,
          price: props.price
        })
      } else {
        await router.push('/auth/login')
      }
    }
  })


  return (
    <div
      className="
        flex
        w-auto
        flex-col
        items-end
        justify-end
        gap-1
        pr-2
        md:flex-row
        md:items-center
        md:justify-evenly
        md:gap-2
      "
    >
      {/* =====================================================
          ADD TO CART
      ===================================================== */}
      {props.trackId && (props.credits ?? 0) > 0 ? (
        <div className="flex items-end justify-end gap-2 text-xs text-[#B9FF00]"><DownloadTrackComponent id={props.trackId} /></div>
      ) : Boolean(checkExist) === false ? (
        <form
          onSubmit={handleSubmit}
          className="
            flex
            items-end
            justify-end
            md:items-center
            md:justify-center
          "
        >
          <button
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            type="submit"
            className="
              h-full
              w-auto
              cursor-pointer
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <div
              className="
                group
                flex
                h-8 lg:h-9
                lg:min-w-[112px]
                items-center
                justify-between
                overflow-hidden
                rounded-lg
                lg:rounded-xl
                border
                border-[#B9FF00]/15
                bg-[#B9FF00]
                text-xs
                font-semibold
                text-black
                shadow-[0_0_15px_rgba(185,255,0,0.05)]
                transition-all
                duration-200
                hover:bg-[#B9FF00]
              "
            >
              {/* PRICE */}
              <div
                className="
                  hidden
                  lg:flex
                  h-full
                  flex-1
                  items-center
                  justify-center
                  px-3
                  tabular-nums
                "
              >
                {props.price===0?"FREE":formatCurrency(props.price)}
              </div>

              {/* CART ICON */}
              <div
                className="
                  flex
                  h-full
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  lg:border-l
                  border-black/10
                  lg:bg-[#111518]/10
                "
              >
                {isSubmitting ? (
                  <LoaderIcon
                    className="
                      h-3.5
                      w-3.5
                      animate-spin
                      text-black
                    "
                  />
                ) : (
                  <FaCartShopping
                    className="
                      h-3.5
                      w-3.5
                      text-black
                      group-hover:animate-cart-shake
                    "
                  />
                )}
              </div>
            </div>
          </button>
        </form>
      ) : (
        <RemoveComponent
          id={String(checkExist?.id)}
          trackId={String(checkExist?.trackId)}
          albumId={String(checkExist?.albumId)}
        />
      )}


      {/* =====================================================
          EDIT BUTTON
      ===================================================== */}
      {session?.user.id === String(props.id) &&
        router.pathname.startsWith(
          '/restricted/editor/published'
        ) && (
          <Link
            href={`/restricted/editor/published/${props.trackId}`}
            className="
              flex
              h-8 lg:h-9
              w-9
              items-center
              justify-center
              rounded-lg
              lg:rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              text-zinc-400
              transition-all
              hover:border-[#B9FF00]/20
              hover:bg-[#B9FF00]/[0.06]
              hover:text-[#B9FF00]
            "
          >
            <PenBox className="h-4 w-4" />
          </Link>
        )
      }
    </div>
  )
}


export default AddCartComponent


type RemoveProps = {
  id: string
  trackId: string | null
  albumId: string | null
}


const RemoveComponent = (
  props: RemoveProps
) => {
  const utils = api.useUtils()

  const [, setCart] =
    useAtom(cartItemsAtom)

  const { data: session } =
    useSession()

  const router = useRouter()


  const { mutateAsync: removeCart } =
    api.cart.remove.useMutation({
      onSuccess: async () => {
        setCart(prev =>
          prev.filter(
            i => i.id !== props.id
          )
        )

        toast.success(
          "Successfully removed"
        )
      },

      onError: (error) => {
        toast.error(
          error.message
        )
      }
    })


  const {
    isSubmitting,
    handleSubmit
  } = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: props.id,
    },

    validationSchema: Schema,

    onSubmit: async () => {
      if (session?.user.id) {
        await removeCart({
          id: props.id,
        })
      } else {
        await router.push(
          '/auth/login'
        )
      }
    }
  })


  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex
        items-center
        justify-center
      "
    >
      <button
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        type="submit"
        className="
          h-full
          w-auto
          cursor-pointer
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <div
          className="
            group
            flex
            h-8 lg:h-9
            lg:min-w-[112px]
            items-center
            justify-between
            overflow-hidden
            rounded-lg
            lg:rounded-xl
            border
            border-white/[0.07]
            bg-white/[0.035]
            text-xs
            font-semibold
            text-zinc-300
            transition-all
            duration-200
            hover:border-red-500/20
            hover:bg-red-500/[0.05]
          "
        >
          {/* STATUS */}
          <div
            className="
              hidden
              md:flex
              h-full
              flex-1
              items-center
              justify-center
              px-3
              text-[10px]
              uppercase
              tracking-[0.08em]
              text-zinc-400
              group-hover:text-red-300
            "
          >
            IN CART
          </div>

          {/* REMOVE */}
          <div
            className="
              flex
              h-full
              w-9
              shrink-0
              items-center
              justify-center
              border-l
              border-red-500/10
              bg-red-500/[0.08]
              text-red-400
              transition-all
              group-hover:bg-red-500/[0.14]
              group-hover:text-red-300
            "
          >
            {isSubmitting ? (
              <LoaderIcon
                className="
                  h-3.5
                  w-3.5
                  animate-spin
                "
              />
            ) : (
              <>
              <FaCartArrowDown
                className="
                  flex
                  lg:hidden
                  h-3.5
                  w-3.5
                  group-hover:animate-cart-shake
                "
              />
              
              <Trash2
                className="
                  hidden
                  lg:flex
                  h-3.5
                  w-3.5
                  group-hover:animate-cart-shake
                "
              />
              </>
            )}
          </div>
        </div>
      </button>
    </form>
  )
}
