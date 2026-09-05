import {
  LoaderIcon,
  PlusCircle,
  Tags,
  X,
} from 'lucide-react'

import React, { useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { api } from '@/utils/api'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'


export const postSchema = Yup.object().shape({
  name: Yup.string()
    .required('name required'),
})


const AdminNewFormTag = () => {
  const utils = api.useUtils()
  const [open, setOpen] = useState(false)

  const { mutateAsync: createtag } = api.tag.create.useMutation({
    onSuccess: async () => {
      console.log('success')
      resetForm()
      toast.success("Successfully published")
      await utils.tag.getAllMain.invalidate()
      setOpen(!open)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const {
    values,
    isSubmitting,
    resetForm,
    handleChange,
    handleSubmit,
    handleBlur
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
    },
    validationSchema: postSchema,
    onSubmit: async (values) => {
      await createtag({
        name: values.name,
      })
    }
  })

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      {/* =====================================================
          TRIGGER
      ===================================================== */}
      <AlertDialogTrigger asChild>
        <Button
          variant={'outline'}
          className="
            flex
            h-10
            w-full
            items-center
            gap-2
            rounded-xl
            border
            border-[#B9FF00]/20
            bg-[#B9FF00]
            px-4
            text-xs
            font-semibold
            text-black
            transition-all
            hover:border-[#B9FF00]
            hover:bg-[#B9FF00]
            hover:text-black
            sm:w-auto
          "
        >
          <PlusCircle className="h-4 w-4" />
          Add New
        </Button>
      </AlertDialogTrigger>

      {/* =====================================================
          DIALOG
      ===================================================== */}
      <AlertDialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-[480px]
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-zinc-950
          p-0
          text-zinc-300
          shadow-2xl
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-[-140px]
            h-[280px]
            w-[280px]
            rounded-full
            bg-[#B9FF00]/[0.04]
            blur-[90px]
          "
        />

        {/* =================================================
            HEADER
        ================================================= */}
        <AlertDialogHeader
          className="
            relative
            border-b
            border-white/[0.06]
            px-5
            py-5
            text-left
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#B9FF00]/10
                  text-[#B9FF00]
                "
              >
                <Tags className="h-5 w-5" />
              </div>

              <div>
                <AlertDialogTitle
                  className="
                    text-base
                    font-semibold
                    text-white
                    sm:text-lg
                  "
                >
                  Create New Tag
                </AlertDialogTitle>

                <AlertDialogDescription
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-zinc-500
                  "
                >
                  Add a new tag to the Jeff92 & Ayan Sumania track library.
                </AlertDialogDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className="
                h-8
                w-8
                shrink-0
                rounded-lg
                text-zinc-600
                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDialogHeader>

        {/* =================================================
            CONTENT
        ================================================= */}
        <div className="relative px-5 py-5">
          <div
            className="
              rounded-2xl
              border
              border-white/[0.06]
              bg-white/[0.015]
              p-4
            "
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="
                  text-[11px]
                  font-medium
                  text-zinc-400
                "
              >
                Name
              </label>

              <Input
                type="text"
                placeholder="Tag name"
                id="name"
                name="name"
                autoComplete="off"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="
                  h-11
                  rounded-xl
                  border-white/[0.08]
                  bg-white/[0.025]
                  px-3
                  text-sm
                  text-zinc-200
                  selection:bg-yellow-100
                selection:text-black
                  placeholder:text-zinc-700
                  focus-visible:border-[#B9FF00]/30
                  focus-visible:ring-[#B9FF00]/10
                "
              />
            </div>
          </div>

          <div
            className="
              mt-3
              rounded-xl
              border
              border-[#B9FF00]/10
              bg-[#B9FF00]/[0.025]
              px-3
              py-3
            "
          >
            <p
              className="
                text-[10px]
                leading-5
                text-zinc-600
              "
            >
              Tags help organize tracks and make filtering easier for users.
            </p>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}
        <AlertDialogFooter
          className="
            grid
            grid-cols-1
            gap-2
            border-t
            border-white/[0.06]
            bg-[#111518]/10
            px-5
            py-4
            sm:grid-cols-[auto_1fr]
          "
        >
          <Button
            type="button"
            onClick={() => setOpen(!open)}
            variant={'outline'}
            className="
              order-2
              h-11
              rounded-xl
              border-white/[0.06]
              bg-white/[0.02]
              px-5
              text-xs
              text-zinc-500
              hover:bg-white/[0.05]
              hover:text-white
              sm:order-1
            "
          >
            Cancel
          </Button>

          <form
            onSubmit={handleSubmit}
            className="
              order-1
              w-full
              sm:order-2
            "
          >
            <Button
              disabled={isSubmitting}
              type='submit'
              variant={'outline'}
              className="
                h-11
                w-full
                rounded-xl
                border
                border-[#B9FF00]/20
                bg-[#B9FF00]
                px-5
                text-xs
                font-semibold
                text-black
                hover:bg-[#B9FF00]
                hover:text-black
                disabled:bg-[#B9FF00]/40
                disabled:text-black/60
              "
            >
              Create

              {isSubmitting && (
                <LoaderIcon
                  className="
                    ml-2
                    h-4
                    w-4
                    animate-spin
                  "
                />
              )}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export default AdminNewFormTag