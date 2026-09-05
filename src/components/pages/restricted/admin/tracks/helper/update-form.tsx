import React, { useState } from "react";
import {
  AlertCircle,
  Check,
  CircleAlert,
  LoaderIcon,
  PenBox,
  Save,
  ShieldOff,
  X,
} from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { idAdminTracks } from "@/state/globalState";

/* =========================================================
   VALIDATION
========================================================= */

export const postSchema = Yup.object().shape({
  is_disabled: Yup.boolean(),

  title: Yup.string()
    .trim()
    .required("Title is required"),

  artist: Yup.string()
    .trim()
    .required("Artist is required"),
});

/* =========================================================
   TYPES
========================================================= */

interface Props {
  id: string;
}

interface NamingWithErrorProps {
  title: string;
  message?: string;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

const AdminTrackUpdateUploadedForm = ({
  id,
}: Props) => {
  const [trackId, setTrackId] =
    useAtom(idAdminTracks);

  const [open, setOpen] =
    useState(false);

  const utils = api.useUtils();

  const {
    data: track,
    isLoading,
  } =
    api.adminTrack.getIdTrackAdmin.useQuery(
      {
        id: trackId,
      },
      {
        enabled: !!trackId,
      }
    );

  const {
    mutateAsync: updateTrack,
    isPending: isUpdating,
  } =
    api.adminTrack.updateTrackAdmin.useMutation({
      onSuccess: async () => {
        await Promise.all([
          utils.track.getAllReleases.invalidate(),

          utils.adminTrack.getIdTrackAdmin.invalidate({
            id,
          }),
        ]);

        toast.success(
          "Track successfully updated"
        );

        resetForm();
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
    setFieldValue,
    resetForm,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    enableReinitialize: true,

    initialValues: {
      title:
        track?.title ?? "",

      artist:
        track?.artist ?? "",

      is_disabled:
        Boolean(
          track?.is_disabled
        ),
    },

    validationSchema:
      postSchema,

    onSubmit: async (
      formValues
    ) => {
      await updateTrack({
        id,
        title:
          formValues.title.trim(),

        artist:
          formValues.artist.trim(),

        is_disabled:
          formValues.is_disabled,
      });
    },
  });

  const busy =
    isSubmitting ||
    isLoading ||
    isUpdating;

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
          variant="ghost"
          size="icon"
          onClick={() =>
            setTrackId(id)
          }
          className="
            h-9
            w-9
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.02]
            text-zinc-500
            transition-all
            hover:border-[#B9FF00]/20
            hover:bg-[#B9FF00]/[0.08]
            hover:text-[#B9FF00]
          "
        >
          <PenBox className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      {/* =====================================================
          DIALOG
      ===================================================== */}
      <AlertDialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-[720px]
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
            right-[-120px]
            top-[-180px]
            h-[340px]
            w-[340px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[100px]
          "
        />

        <form
          onSubmit={handleSubmit}
          className="relative"
        >
          {/* =================================================
              HEADER
          ================================================= */}
          <AlertDialogHeader
            className="
              border-b
              border-white/[0.06]
              px-5
              py-5
              text-left
              sm:px-6
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-[#B9FF00]
                      shadow-[0_0_8px_rgba(185,255,0,0.6)]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.17em]
                      text-zinc-600
                    "
                  >
                    Track Administration
                  </span>
                </div>

                <AlertDialogTitle
                  className="
                    max-w-[520px]
                    truncate
                    text-base
                    font-semibold
                    text-white
                    sm:text-lg
                  "
                >
                  {isLoading
                    ? "Loading track details..."
                    : values.title ||
                      "Update Track"}
                </AlertDialogTitle>

                <AlertDialogDescription className="mt-1 text-xs leading-5 text-zinc-500">
                  Update the public
                  track information or
                  disable this release.
                </AlertDialogDescription>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={busy}
                onClick={
                  closeDialog
                }
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
          <div
            className="
              max-h-[65vh]
              overflow-y-auto
              px-5
              py-5
              sm:px-6
            "
          >
            {isLoading ? (
              <TrackFormSkeleton />
            ) : (
              <div className="space-y-5">
                {/* INFORMATION */}
                <section
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-white/[0.015]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      border-b
                      border-white/[0.05]
                      px-4
                      py-3
                    "
                  >
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-200">
                        Basic Information
                      </h3>

                      <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                        Public track
                        metadata
                      </p>
                    </div>

                    <span
                      className="
                        rounded-full
                        border
                        border-white/[0.06]
                        bg-white/[0.025]
                        px-2.5
                        py-1
                        text-[9px]
                        text-zinc-600
                      "
                    >
                      Admin Edit
                    </span>
                  </div>

                  <div className="space-y-5 p-4">
                    {/* TITLE */}
                    <FieldGroup
                      label="Title"
                      error={
                        touched.title
                          ? errors.title
                          : undefined
                      }
                    >
                      <Input
                        type="text"
                        placeholder="Track title"
                        disabled={busy}
                        id="title"
                        name="title"
                        value={
                          values.title
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        className={
                          inputClassName
                        }
                      />
                    </FieldGroup>

                    {/* ARTIST */}
                    <FieldGroup
                      label="Artist"
                      error={
                        touched.artist
                          ? errors.artist
                          : undefined
                      }
                    >
                      <Input
                        type="text"
                        placeholder="Artist"
                        disabled={busy}
                        id="artist"
                        name="artist"
                        value={
                          values.artist
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          handleBlur
                        }
                        className={
                          inputClassName
                        }
                      />
                    </FieldGroup>
                  </div>
                </section>

                {/* STATUS */}
                <section
                  className={`
                    overflow-hidden
                    rounded-2xl
                    border
                    transition-colors
                    ${
                      values.is_disabled
                        ? "border-red-500/15 bg-red-500/[0.035]"
                        : "border-white/[0.06] bg-white/[0.015]"
                    }
                  `}
                >
                  <label
                    htmlFor="is_disabled"
                    className="
                      flex
                      cursor-pointer
                      items-start
                      justify-between
                      gap-4
                      p-4
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          ${
                            values.is_disabled
                              ? "border-red-500/15 bg-red-500/[0.08] text-red-400"
                              : "border-white/[0.06] bg-white/[0.025] text-zinc-600"
                          }
                        `}
                      >
                        <ShieldOff className="h-4 w-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-zinc-300">
                            Disable this
                            track
                          </p>

                          <StatusBadge
                            disabled={
                              values.is_disabled
                            }
                          />
                        </div>

                        <p className="mt-1 max-w-[460px] text-[10px] leading-5 text-zinc-600">
                          Disabled
                          tracks are
                          hidden from
                          public listings
                          but remain
                          available in
                          administration.
                        </p>
                      </div>
                    </div>

                    <Checkbox
                      id="is_disabled"
                      checked={
                        values.is_disabled
                      }
                      disabled={busy}
                      onCheckedChange={(
                        checked
                      ) =>
                        void setFieldValue(
                          "is_disabled",
                          checked === true
                        )
                      }
                      className="
                        mt-1
                        border-white/20
                        data-[state=checked]:border-red-500
                        data-[state=checked]:bg-red-500
                        data-[state=checked]:text-white
                      "
                    />
                  </label>

                  {values.is_disabled && (
                    <div
                      className="
                        flex
                        items-start
                        gap-2
                        border-t
                        border-red-500/10
                        px-4
                        py-3
                        text-[10px]
                        leading-5
                        text-red-400
                      "
                    >
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                      This track will
                      not appear in
                      public Jeff92 & Ayan Sumania
                      listings while
                      disabled.
                    </div>
                  )}
                </section>
              </div>
            )}
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
              sm:px-6
            "
          >
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={
                closeDialog
              }
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
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Track
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminTrackUpdateUploadedForm;

/* =========================================================
   STATUS
========================================================= */

const StatusBadge = ({
  disabled,
}: {
  disabled: boolean;
}) => {
  return disabled ? (
    <span
      className="
        inline-flex
        items-center
        gap-1
        rounded-full
        border
        border-red-500/15
        bg-red-500/[0.07]
        px-2
        py-0.5
        text-[8px]
        font-semibold
        uppercase
        tracking-wider
        text-red-400
      "
    >
      Disabled
    </span>
  ) : (
    <span
      className="
        inline-flex
        items-center
        gap-1
        rounded-full
        border
        border-emerald-500/15
        bg-emerald-500/[0.07]
        px-2
        py-0.5
        text-[8px]
        font-semibold
        uppercase
        tracking-wider
        text-emerald-400
      "
    >
      <Check className="h-2.5 w-2.5" />
      Active
    </span>
  );
};

/* =========================================================
   FIELD COMPONENT
========================================================= */

const inputClassName = `
  h-11
  rounded-xl
  border-white/[0.08]
  bg-white/[0.025]
  px-3
  text-sm
  text-zinc-200
  placeholder:text-zinc-700
  selection:bg-yellow-100
  selection:text-black
  focus-visible:border-[#B9FF00]/30
  focus-visible:ring-[#B9FF00]/10
`;

type FieldGroupProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

const FieldGroup = ({
  label,
  error,
  children,
}: FieldGroupProps) => {
  return (
    <div className="grid gap-2">
      <NamingWithError
        title={label}
        message={error}
      />

      {children}

      {error && (
        <p
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
          {error}
        </p>
      )}
    </div>
  );
};

/* =========================================================
   LABEL + TOOLTIP
========================================================= */

const NamingWithError = ({
  title,
  message,
}: NamingWithErrorProps) => {
  return (
    <div className="flex items-center gap-2">
      <label
        className="
          text-[11px]
          font-medium
          text-zinc-400
        "
      >
        {title}
      </label>

      {message && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              asChild
            >
              <button
                type="button"
                className="text-red-400"
              >
                <CircleAlert className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>

            <TooltipContent>
              <p>{message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

/* =========================================================
   LOADING
========================================================= */

const TrackFormSkeleton = () => {
  return (
    <div className="space-y-5">
      <div
        className="
          rounded-2xl
          border
          border-white/[0.06]
          bg-white/[0.015]
          p-4
        "
      >
        <div className="mb-4 h-3 w-32 animate-pulse rounded bg-white/5" />

        <div className="space-y-4">
          <div>
            <div className="mb-2 h-2.5 w-12 animate-pulse rounded bg-white/5" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-white/5" />
          </div>

          <div>
            <div className="mb-2 h-2.5 w-12 animate-pulse rounded bg-white/5" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-white/5" />
          </div>
        </div>
      </div>

      <div className="h-24 w-full animate-pulse rounded-2xl bg-white/[0.025]" />
    </div>
  );
};