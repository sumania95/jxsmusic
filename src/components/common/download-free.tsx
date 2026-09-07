import React from 'react'
import { ImArrowDown } from 'react-icons/im'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { api } from '@/utils/api'
import { useAtom } from 'jotai'
import { downloadingState } from '@/state/globalState'
import { LoaderCircle } from 'lucide-react'


interface Props {
  id: string
}


const DownloadTrackFreeComponent = (props: Props) => {
  const utils = api.useUtils()
  const [downloading, setDownloading] =
    useAtom(downloadingState)

  const { data: session } =
    useSession()

  const router =
    useRouter()


  const {
    mutateAsync: newdownloaded
  } =
    api.signedUrl.downloadObjectAdmin.useMutation({
      onSuccess: async () => {
        toast.success(
          'Successfully downloaded'
        )

        setDownloading({
          ...downloading,
          status: false,
          id: ''
        })
        await utils.credits.balance.invalidate()
      },

      onError: (err) => {
        toast.warning(
          err.message
        )

        setDownloading({
          ...downloading,
          status: false,
          id: ''
        })
      }
    })


  const download = async () => {
    if (!session) {
      return await router.push(
        '/auth/login'
      )
    }


    const a =
      document.createElement('a')


    setDownloading({
      ...downloading,
      status: true,
      id: String(props.id)
    })


    const data =
      await newdownloaded({
        id: String(props.id),
        source: "track",
      })


    a.href =
      data.url

    a.download =
      data.filename

    a.rel =
      'noopener'


    document.body.appendChild(a)

    a.click()

    document.body.removeChild(a)


    setDownloading({
      status: false,
      id: '',
    })
  }


  const isDownloading =
    downloading.status &&
    downloading.id === props.id


  return (
    <>
      {isDownloading ? (
        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            border
            border-[#B9FF00]/15
            bg-[#B9FF00]/[0.05]
            text-[#B9FF00]
          "
        >
          <LoaderCircle
            className="
              h-3.5
              w-3.5
              animate-spin
            "
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={
            downloading.status
              ? undefined
              : download
          }
          disabled={
            downloading.status
          }
          aria-label="Download track"
          className={`
            group
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            border
            transition-all
            duration-200

            ${
              downloading.status
                ? `
                    cursor-not-allowed
                    border-white/[0.04]
                    bg-white/[0.015]
                    text-zinc-700
                    opacity-50
                  `
                : `
                    cursor-pointer
                    border-white/[0.07]
                    bg-white/[0.025]
                    text-zinc-500
                    hover:border-[#B9FF00]/20
                    hover:bg-[#B9FF00]
                    hover:text-black
                  `
            }
          `}
        >
          <ImArrowDown
            className="
              h-3.5
              w-3.5
              transition-transform
              duration-200
              group-hover:translate-y-0.5
            "
          />
        </button>
      )}
    </>
  )
}


export default DownloadTrackFreeComponent
