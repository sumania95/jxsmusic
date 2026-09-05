import {
  AlertTriangle,
  LoaderIcon,
  Trash,
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
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { api } from '@/utils/api';


export const postSchema = Yup.object().shape({
  id:Yup.string()
  .required('name required'),
});


interface Props {
  id:string
}


const AdminTagDelete = (props:Props) => {
  const utils = api.useUtils()
  const [open, setOpen] = useState(false);

  const {mutateAsync:createtag} = api.tag.delete.useMutation({
    onSuccess:async()=>{
        console.log('success')
        resetForm()
        toast.success("Successfully deleted")
        await utils.tag.getAllMain.invalidate()
        setOpen(!open)
    },
    onError:(error)=>{
        toast.error(error.message)
    }
  })

  const {
    isSubmitting,
    resetForm,
    handleSubmit
  } = useFormik({
    enableReinitialize:true,
    initialValues:{
        id:props.id,
    },
    validationSchema:postSchema,
    onSubmit:async(values) => {
        await createtag({
            id:values.id,
        })
    }
  });

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
            h-9
            w-9
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.02]
            p-0
            text-zinc-500
            transition-all
            hover:border-red-500/20
            hover:bg-red-500/[0.08]
            hover:text-red-400
            dark:border-white/[0.06]
          "
        >
          <Trash className="h-4 w-4" />
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
            bg-red-500/[0.04]
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
                  border
                  border-red-500/15
                  bg-red-500/[0.08]
                  text-red-400
                "
              >
                <AlertTriangle className="h-5 w-5" />
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
                  Delete Tag?
                </AlertDialogTitle>

                <AlertDialogDescription
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-zinc-500
                  "
                >
                  This action cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={()=>setOpen(!open)}
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
              border-red-500/10
              bg-red-500/[0.035]
              px-4
              py-3
            "
          >
            <p
              className="
                text-xs
                leading-6
                text-zinc-400
              "
            >
              This tag will be permanently removed from Jeff92 & Ayan Sumania.
              Make sure this is the correct tag before continuing.
            </p>
          </div>

          <p
            className="
              mt-3
              text-[10px]
              leading-5
              text-zinc-600
            "
          >
            Deleted tags cannot be restored.
          </p>
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
            onClick={()=>setOpen(!open)}
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
              variant={'destructive'}
              className="
                h-11
                w-full
                rounded-xl
                border
                border-red-500/20
                bg-red-500
                px-5
                text-xs
                font-semibold
                text-white
                hover:bg-red-600
                disabled:bg-red-500/40
                disabled:text-white/60
              "
            >
              Delete

              {isSubmitting&&
                <LoaderIcon
                  className="
                    ml-2
                    h-4
                    w-4
                    animate-spin
                  "
                />
              }
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export default AdminTagDelete