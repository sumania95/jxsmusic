import {
  CircleAlert,
  Layers3,
  LoaderIcon,
  PlusCircle,
  X,
} from "lucide-react";
import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as Yup from "yup";
import { useFormik } from "formik";
import { api } from "@/utils/api";
import { toast } from "sonner";

export const postSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Genre name is required"),
});

const AdminNewFormGenre = () => {
  const utils = api.useUtils();

  const [open, setOpen] = useState(false);

  const {
    mutateAsync: createGenre,
    isPending: isCreating,
  } = api.genre.create.useMutation({
    onSuccess: async () => {
      await utils.genre.getAllMain.invalidate();

      resetForm();

      toast.success(
        "Genre successfully created"
      );

      setOpen(false);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    resetForm,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: "",
    },

    validationSchema: postSchema,

    onSubmit: async (values) => {
      await createGenre({
        name: values.name.trim(),
      });
    },
  });

  const busy =
    isSubmitting ||
    isCreating;

  const closeDialog = () => {
    if (busy) return;

    setOpen(false);
    resetForm();
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (busy) return;

        setOpen(value);

        if (!value) {
          resetForm();
        }
      }}
    >
      {/* =====================================================
          TRIGGER
      ===================================================== */}
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          className="
            h-10
            w-full
            rounded-xl
            bg-[#B9FF00]
            px-4
            text-xs
            font-semibold
            text-black
            hover:bg-[#B9FF00]
            sm:w-auto
          "
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Genre
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

        <form
          onSubmit={handleSubmit}
          className="relative"
        >
          {/* HEADER */}
          <AlertDialogHeader
            className="
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
                  <Layers3 className="h-5 w-5" />
                </div>

                <div>
                  <AlertDialogTitle className="text-base font-semibold text-white sm:text-lg">
                    Create New Genre
                  </AlertDialogTitle>

                  <AlertDialogDescription className="mt-1 text-xs leading-5 text-zinc-500">
                    Add a new genre to the Jeff92 & Ayan Sumania track library.
                  </AlertDialogDescription>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={busy}
                onClick={closeDialog}
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

          {/* CONTENT */}
          <div className="px-5 py-5">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="name"
                  className="
                    text-[11px]
                    font-medium
                    text-zinc-400
                  "
                >
                  Genre Name
                </label>

                {touched.name &&
                  errors.name && (
                    <CircleAlert className="h-3.5 w-3.5 text-red-400" />
                  )}
              </div>

              <Input
                type="text"
                id="name"
                name="name"
                autoComplete="off"
                placeholder="e.g. House, Hip-Hop, R&B..."
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={busy}
                className={`
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
                  ${
                    touched.name &&
                    errors.name
                      ? "border-red-500/30"
                      : ""
                  }
                `}
              />

              {touched.name &&
                errors.name && (
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-[10px]
                      font-medium
                      text-red-400
                    "
                  >
                    <CircleAlert className="h-3 w-3 shrink-0" />
                    <span>
                      {errors.name}
                    </span>
                  </div>
                )}
            </div>

            <div
              className="
                mt-4
                rounded-xl
                border
                border-white/[0.05]
                bg-white/[0.015]
                px-3
                py-3
              "
            >
              <p className="text-[10px] leading-5 text-zinc-600">
                Use a clear genre name that can be understood easily by contributors and customers.
              </p>
            </div>
          </div>

          {/* FOOTER */}
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
              variant="ghost"
              disabled={busy}
              onClick={closeDialog}
              className="
                order-2
                h-11
                rounded-xl
                border
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

            <Button
              type="submit"
              disabled={busy}
              className="
                order-1
                h-11
                rounded-xl
                bg-[#B9FF00]
                px-5
                text-xs
                font-semibold
                text-black
                hover:bg-[#B9FF00]
                disabled:bg-[#B9FF00]/40
                disabled:text-black/60
                sm:order-2
              "
            >
              {busy ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Genre
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminNewFormGenre;