import { Button } from '@/components/ui/button'
import { api } from '@/utils/api'
import {
  CheckCircle,
  ExternalLink,
  Loader2,
  Mail,
  Music2,
  UserRound,
} from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  id: string
  name: string | null
  username: string | null
  email: string | null
  linkToListen: string | null
  expireAt: Date
}

const AdminUserItem = (props: Props) => {
  const [loading, setLoading] = useState(false)
  const utils = api.useUtils()

  const { mutateAsync: approveEditor } =
    api.editor.approveEditor.useMutation({
      onSuccess: async () => {
        toast.success('Editor successfully approved')
        await utils.user.getAllRequest.invalidate()
      },
      onError: (e) => {
        toast.error(e.message)
      },
      onSettled: () => {
        setLoading(false)
      },
    })

  const urlRegex =
    /(https?:\/\/[^\s]+)/g

  const renderTextWithLinks = (text: string) => {
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              gap-1
              break-all
              font-mono
              text-xs
              text-[#B9FF00]
              transition-colors
              hover:text-[#B9FF00]
              hover:underline
            "
          >
            {part}

            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        )
      }

      return (
        <span
          key={index}
          className="whitespace-pre-wrap"
        >
          {part}
        </span>
      )
    })
  }

  return (
    <div className="w-full text-zinc-300">
      {/* =====================================================
          USER INFORMATION
      ===================================================== */}
      <div
        className="
          flex
          flex-col
          gap-4
          p-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        {/* USER */}
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.025]
              text-zinc-600
              transition-all
              group-hover:border-[#B9FF00]/15
              group-hover:bg-[#B9FF00]/[0.06]
              group-hover:text-[#B9FF00]
            "
          >
            <UserRound className="h-4 w-4" />
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-3 sm:gap-6">
            {/* FULL NAME */}
            <div className="min-w-0">
              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-700
                "
              >
                Full Name
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-semibold
                  text-zinc-200
                "
              >
                {props.name ?? '—'}
              </p>
            </div>

            {/* DJ NAME */}
            <div className="min-w-0">
              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-700
                "
              >
                DJ Name
              </p>

              <p className="mt-1 truncate text-xs font-medium text-zinc-400">
                @{props.username ?? '—'}
              </p>
            </div>

            {/* EMAIL */}
            <div className="min-w-0">
              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-700
                "
              >
                Email
              </p>

              <div className="mt-1 flex min-w-0 items-center gap-1.5">
                <Mail className="h-3 w-3 shrink-0 text-zinc-700" />

                <p className="truncate text-xs text-zinc-500">
                  {props.email ?? '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            APPROVE
        ===================================================== */}
        <Button
          disabled={loading}
          onClick={async () => {
            setLoading(true)
            await approveEditor({
              userId: props.id,
            })
          }}
          className="
            h-10
            w-full
            shrink-0
            rounded-xl
            bg-[#B9FF00]
            px-4
            text-xs
            font-semibold
            text-black
            hover:bg-[#B9FF00]
            disabled:bg-[#B9FF00]/40
            disabled:text-black/60
            md:w-auto
          "
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Editor
            </>
          )}
        </Button>
      </div>

      {/* =====================================================
          DEMO LINK
      ===================================================== */}
      {props.linkToListen && (
        <div
          className="
            border-t
            border-white/[0.05]
            px-4
            py-4
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-[#B9FF00]/[0.07]
                text-[#B9FF00]
              "
            >
              <Music2 className="h-3.5 w-3.5" />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-700
                "
              >
                Sample / Demo Link
              </p>

              <div
                className="
                  mt-2
                  rounded-xl
                  border
                  border-white/[0.05]
                  bg-white/[0.015]
                  px-3
                  py-2.5
                  text-xs
                  leading-5
                  text-zinc-500
                "
              >
                {renderTextWithLinks(
                  props.linkToListen
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserItem