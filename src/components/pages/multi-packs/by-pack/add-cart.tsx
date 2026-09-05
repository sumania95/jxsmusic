import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { cartByTrackIdAtom, cartItemsAtom } from '@/state/cartAtoms'
import { api } from '@/utils/api'
import { useFormik } from 'formik'
import { useAtom } from 'jotai'
import { LoaderIcon, PenBox, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { toast } from 'sonner'
import * as Yup from 'yup'

export const Schema = Yup.object().shape({
  id: Yup.string(),
})

type Props = {
  trackId: string | null
  albumId: string | null
  price: number
  id: string | null
}

const AddCartMultiPackComponent = (props: Props) => {
  const utils = api.useUtils()
  const router = useRouter()
  const { data: session } = useSession()

  const [, setCart] = useAtom(cartItemsAtom)

  // const {data:checkExist,isLoading} = api.cart.checkExistInCart.useQuery({
  //   trackId:props.trackId,
  //   albumId:props.albumId,
  // },{
  //   enabled:!!session?.user
  // })

  const [cartMap] = useAtom(cartByTrackIdAtom)

  const checkExist =
    props.trackId
      ? cartMap.get(props.trackId)
      : props.albumId
        ? cartMap.get(props.albumId)
        : null

  const { mutateAsync: addCart } = api.cart.add.useMutation({
    onSuccess: async (data) => {
      // await utils.cart.checkExistInCart.invalidate({
      //   albumId:props.albumId,
      //   trackId:props.trackId
      // })
      // await utils.cart.counter.invalidate()

      setCart((prev) => [
        ...prev,
        {
          id: data.id,
          trackId: data.trackId ?? null,
          albumId: data.albumId ?? null,
        },
      ])

      toast.success('Successfully added')
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })

  const { isSubmitting, handleSubmit } = useFormik({
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
          price: props.price,
        })
      } else {
        await router.push('/auth/login')
      }
    },
  })

  return (
    <div className="w-full flex flex-col items-center md:items-start justify-end gap-1 pb-1">
      {/* <div className='flex items-center justify-center'>
        <Button
          variant={'default'}
          className='bg-transparent -mx-1 hover:bg-transparent focus:bg-transparent cursor-pointer'
        >
          <Heart className='w-5 h-5 text-white'/>
        </Button>
      </div> */}

      {Boolean(checkExist) === false ? (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center"
          >
            <Button
              disabled={isSubmitting}
              type="submit"
              variant={'default'}
              className="bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 w-42 md:w-72 py-4 md:py-8 rounded-none text-sm cursor-pointer"
            >
              {isSubmitting ? (
                <LoaderIcon className="w-5 h-5 text-white animate-spin" />
              ) : (
                ''
              )}
              Add To Cart
            </Button>
          </form>
        </>
      ) : (
        <RemoveComponent
          id={String(checkExist?.id)}
          trackId={String(checkExist?.trackId)}
          albumId={String(checkExist?.albumId)}
        />
      )}
    </div>
  )
}

export default AddCartMultiPackComponent

type RemoveProps = {
  id: string
  trackId: string | null
  albumId: string | null
}

const RemoveComponent = (props: RemoveProps) => {
  const utils = api.useUtils()
  const { data: session } = useSession()
  const router = useRouter()

  const [, setCart] = useAtom(cartItemsAtom)

  const { mutateAsync: removeCart } = api.cart.remove.useMutation({
    onSuccess: async () => {
      // await utils.cart.checkExistInCart.invalidate({
      //   trackId:props.trackId
      // })
      // await utils.cart.checkExistInCart.invalidate({
      //   albumId:props.albumId
      // })
      // await utils.cart.getAll.invalidate()
      // await utils.cart.counter.invalidate()

      setCart((prev) => prev.filter((i) => i.id !== props.id))

      toast.success('Successfully removed')
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })

  const { isSubmitting, handleSubmit } = useFormik({
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
        await router.push('/auth/login')
      }
    },
  })

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center"
      >
        <Button
          disabled={isSubmitting}
          type="submit"
          variant={'default'}
          className="bg-red-500 w-42 md:w-72 py-4 md:py-8 hover:bg-red-400 rounded-none cursor-pointer"
        >
          {isSubmitting ? (
            <LoaderIcon className="w-5 h-5 text-white animate-spin" />
          ) : (
            ''
          )}
          Remove To Cart
        </Button>
      </form>
    </>
  )
}