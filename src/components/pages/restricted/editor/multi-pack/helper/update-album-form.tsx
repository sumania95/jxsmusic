import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import {
  CircleAlert,
  ImageIcon,
  LoaderIcon,
} from "lucide-react";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { ImageDropzone } from "@/components/common/dropzone-cover-image";
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export const albumSchema = (
  hasExistingImage: boolean
) =>
  Yup.object().shape({
    name: Yup.string()
      .required("Album name is required"),

    artist: Yup.string()
      .required("Artists is required"),

    price: Yup.number()
      .min(20000, "Minimum $200.00")
      .max(500000, "Maximum $5,000")
      .required("Price is required"),

    coverFile: Yup.mixed<File>()
      .nullable()
      .test(
        "required-if-no-existing",
        "Album cover is required",
        (file) => {
          if (hasExistingImage) return true;

          return file instanceof File;
        }
      )
      .test(
        "fileType",
        "Only image files are allowed",
        (file) =>
          !file ||
          (
            file instanceof File &&
            [
              "image/jpeg",
              "image/png",
              "image/webp"
            ].includes(file.type)
          )
      )
      .test(
        "fileSize",
        "Image size must be less than 5MB",
        (file) =>
          !file ||
          (
            file instanceof File &&
            file.size <= 5 * 1024 * 1024
          )
      ),
  });


const AlbumUpdateForm = () => {
  const utils = api.useUtils();

  const router = useRouter();

  const albumId =
    Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;


  const {
    data: album,
    isLoading
  } = api.album.getIdUpdate.useQuery(
    {
      id: String(albumId)
    },
    {
      enabled: !!albumId
    }
  );


  const [preview, setPreview] =
    useState<string | null>(
      album?.image ?? null
    );


  useEffect(() => {
    if (album?.image) {
      setPreview(
        album.image
      );
    }
  }, [album?.image]);


  const {
    mutateAsync: updateAlbum
  } = api.album.update.useMutation({
    onSuccess: async () => {
      await utils.album.getAll.invalidate();

      await utils.album.getIdUpdate.invalidate({
        id: albumId
      });

      resetForm();

      await router.push(
        "/restricted/editor/multi-pack"
      );

      toast.success(
        "Successfully updated"
      );
    },

    onError: (error) => {
      toast.error(
        error.message
      );
    }
  });


  const {
    mutateAsync: getUploadUrl
  } =
    api.album.getCoverUploadUrl.useMutation();


  const hasExistingImage =
    Boolean(album?.image);


  const {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    handleChange,
    handleSubmit,
    handleBlur,
    resetForm
  } = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: albumId,
      name: album?.name ?? "",
      artist: album?.artist ?? "",
      price: album?.price ?? 0,
      isActive: album?.isActive ?? false,
      coverFile:
        null as File | null,
    },

    validationSchema:
      albumSchema(
        hasExistingImage
      ),

    onSubmit: async (values) => {
      let coverUrl:
        string | null = null;

      let coverKey:
        string | null = null;


      if (values.coverFile) {
        const {
          uploadUrl,
          fileUrl,
          key
        } =
          await getUploadUrl({
            filename:
              values.coverFile.name,

            filetype:
              values.coverFile.type,
          });


        await fetch(
          uploadUrl,
          {
            method: "PUT",
            body:
              values.coverFile,

            headers: {
              "Content-Type":
                values.coverFile.type,
            },
          }
        );


        coverUrl =
          fileUrl;

        coverKey =
          key;
      }


      if (albumId) {
        await updateAlbum({
          id:
            albumId,

          name:
            values.name,

          price:
            values.price,

          artist:
            values.artist,

          image:
            coverUrl,

          imageKey:
            coverKey,

          isActive:
            values.isActive,
        });
      }
    },
  });


  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(
          preview
        );
      }
    };
  }, [preview]);


  return (
    <div
      className="
        mt-5
        flex
        w-full
        flex-col
        gap-4
      "
    >
      {/* =====================================================
          ALBUM INFORMATION
      ===================================================== */}
      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-140px]
            top-[-180px]
            h-[360px]
            w-[360px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[110px]
          "
        />


        {/* HEADER */}
        <div
          className="
            relative
            border-b
            border-white/[0.06]
            px-5
            py-5
            sm:px-6
          "
        >
          <div className="flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#B9FF00]
                shadow-[0_0_8px_rgba(185,255,0,0.7)]
              "
            />

            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-zinc-600
              "
            >
              Jeff92 & Ayan Sumania Multipack
            </span>
          </div>

          <h2
            className="
              mt-2
              text-lg
              font-semibold
              tracking-tight
              text-zinc-100
            "
          >
            Album Information
          </h2>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-zinc-500
            "
          >
            Update the album details,
            cover image, price, and
            publishing status.
          </p>
        </div>


        {/* BODY */}
        <div
          className="
            relative
            space-y-6
            p-5
            sm:p-6
          "
        >
          {/* =================================================
              IMAGE NOTICE
          ================================================= */}
          <Alert
            variant="warning"
            className="
              rounded-2xl
              border-[#B9FF00]/15
              bg-[#B9FF00]/[0.035]
              text-zinc-400
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
                  rounded-xl
                  bg-[#B9FF00]/10
                  text-[#B9FF00]
                "
              >
                <ImageIcon className="h-4 w-4" />
              </div>

              <AlertTitle
                className="
                  text-xs
                  font-medium
                  leading-6
                  text-zinc-400
                "
              >
                {`Dont have album cover Image? Just prompt in ChatGPT "Create a cover image (about your album info)"`}.
              </AlertTitle>
            </div>
          </Alert>


          {/* =================================================
              COVER IMAGE
          ================================================= */}
          <div
            className="
              rounded-2xl
              border
              border-white/[0.06]
              bg-[#111518]/20
              p-3
            "
          >
            <div className="mb-3">
              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-300
                "
              >
                Album Cover
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-zinc-700
                "
              >
                JPG, PNG or WebP.
                Maximum file size 5MB.
              </p>
            </div>

            <ImageDropzone
              preview={preview}
              onFileSelect={(file) => {
                void setFieldValue(
                  "coverFile",
                  file
                );

                setPreview(
                  URL.createObjectURL(
                    file
                  )
                );
              }}
              onRemove={() => {
                void setFieldValue(
                  "coverFile",
                  null
                );

                if (preview) {
                  URL.revokeObjectURL(
                    preview
                  );
                }

                setPreview(null);
              }}
            />

            {errors.coverFile && (
              <p
                className="
                  mt-2
                  text-[10px]
                  text-red-400
                "
              >
                {errors.coverFile}
              </p>
            )}
          </div>


          {/* =================================================
              BASIC DETAILS
          ================================================= */}
          <div
            className="
              grid
              grid-cols-1
              gap-5
              lg:grid-cols-2
            "
          >
            {/* ALBUM NAME */}
            <div className="flex flex-col gap-1.5">
              <NamingWithError
                title="Album Name"
                message={
                  errors.name
                }
              />

              <Input
                name="name"
                value={
                  values.name
                }
                placeholder="Enter Album Name"
                onChange={
                  handleChange
                }
                onBlur={
                  handleBlur
                }
                className="
                  h-11
                  rounded-xl
                  border-white/[0.08]
                  bg-white/[0.025]
                  text-sm
                  text-zinc-300
                  shadow-none
                  placeholder:text-zinc-700
                  focus-visible:border-[#B9FF00]/30
                  focus-visible:ring-[#B9FF00]/10
                  selection:bg-yellow-100
                  selection:text-black
                "
              />

              {errors.name && (
                <p className="text-[10px] text-red-400">
                  {errors.name}
                </p>
              )}
            </div>


            {/* ARTISTS */}
            <div className="flex flex-col gap-1.5">
              <NamingWithError
                title="Artists"
                message={
                  errors.artist
                }
              />

              <Input
                name="artist"
                value={
                  values.artist
                }
                placeholder="Enter Artists"
                onChange={
                  handleChange
                }
                onBlur={
                  handleBlur
                }
                className="
                  h-11
                  rounded-xl
                  border-white/[0.08]
                  bg-white/[0.025]
                  text-sm
                  text-zinc-300
                  shadow-none
                  placeholder:text-zinc-700
                  focus-visible:border-[#B9FF00]/30
                  focus-visible:ring-[#B9FF00]/10
                  selection:bg-yellow-100
                  selection:text-black
                "
              />

              {errors.artist && (
                <p className="text-[10px] text-red-400">
                  {errors.artist}
                </p>
              )}
            </div>


            {/* PRICE */}
            <div className="flex flex-col gap-1.5">
              <NamingWithError
                title={`Price (${Number(
                  values.price / 100
                ).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD"
                  }
                )})`}
                message={
                  errors.price
                }
              />

              <Input
                inputMode="numeric"
                value={
                  values.price
                    ? values.price / 100
                    : ""
                }
                placeholder="Enter Price"
                onChange={(e) => {
                  const raw =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  void setFieldValue(
                    "price",
                    raw
                      ? parseInt(
                          raw,
                          10
                        ) * 100
                      : 0
                  );
                }}
                className="
                  h-11
                  rounded-xl
                  border-white/[0.08]
                  bg-white/[0.025]
                  text-sm
                  text-zinc-300
                  shadow-none
                  placeholder:text-zinc-700
                  focus-visible:border-[#B9FF00]/30
                  focus-visible:ring-[#B9FF00]/10
                  selection:bg-yellow-100
                  selection:text-black
                "
              />

              {errors.price && (
                <p className="text-[10px] text-red-400">
                  {errors.price}
                </p>
              )}
            </div>


            {/* =================================================
                STATUS
            ================================================= */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.015]
                px-4
                py-3
              "
            >
              <div>
                <Label
                  className="
                    text-xs
                    font-medium
                    text-zinc-300
                  "
                >
                  Album Status
                </Label>

                <p
                  className="
                    mt-1
                    text-[10px]
                    leading-5
                    text-zinc-600
                  "
                >
                  Enable to make this
                  album visible to users
                </p>
              </div>


              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-3
                "
              >
                <span
                  className={`
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    ${
                      values.isActive
                        ? "text-[#B9FF00]"
                        : "text-zinc-700"
                    }
                  `}
                >
                  {values.isActive
                    ? "Active"
                    : "Inactive"}
                </span>

                <Switch
                  checked={
                    values.isActive
                  }
                  onCheckedChange={(
                    checked
                  ) =>
                    setFieldValue(
                      "isActive",
                      checked
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          SUBMIT
      ===================================================== */}
      <form
        onSubmit={
          handleSubmit
        }
      >
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            (
              !hasExistingImage &&
              !values.coverFile
            )
          }
          className="
            h-11
            w-full
            rounded-xl
            bg-[#B9FF00]
            text-xs
            font-semibold
            uppercase
            tracking-[0.08em]
            text-black
            shadow-[0_0_18px_rgba(185,255,0,0.08)]
            hover:bg-[#B9FF00]
            disabled:bg-[#B9FF00]/30
            disabled:text-black/50
          "
        >
          UPDATE ALBUM

          {(isSubmitting ||
            isLoading) && (
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
    </div>
  );
};


export default AlbumUpdateForm;


/* =========================================================
   LABEL WITH ERROR
========================================================== */

export const NamingWithError = ({
  title,
  message,
}: {
  title: string;
  message?: string;
}) => (
  <div
    className="
      flex
      items-center
      gap-2
    "
  >
    <h3
      className="
        text-[9px]
        font-medium
        uppercase
        tracking-[0.13em]
        text-zinc-300
      "
    >
      {title}
    </h3>

    {message && (
      <span className="text-[11px] font-medium bg-red-500 text-red-100 px-2">REQUIRED</span>
    )}
  </div>
);