import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProfileMeta } from "@/components/common/metadata";
import BannerTitleComponent from "@/components/common/banner-title";
import {
  Headphones,
  Loader2,
  Music2,
  Sparkles,
  UploadCloud,
} from "lucide-react";


const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "DJ Name is required")
    .required("Required"),

  linkToListen: Yup.string()
    .max(500, "Max 500 characters")
    .required("Required"),
});


export default function BecomeEditorForm() {
  const mutation = api.editor.becomeEditor.useMutation({
    onSuccess: () => {
      toast.success('Successfully Sent Request..')
    },

    onError: (e) =>{
      toast.error(`${e.message}`)
    },

    onSettled:()=>{
      formik.resetForm()
    }
  });


  const formik = useFormik({
    initialValues: {
      username: "",
      linkToListen: "",
    },

    validationSchema,

    onSubmit: (values) =>
      mutation.mutate(values),
  });


  return (
    <div className="w-full">
      <ProfileMeta
        title='Become An Editor'
        description='Collection of DJ Music'
      />

      <div className="flex w-full flex-col items-start gap-6">

        {/* =====================================================
            JEFF92 & AYAN SUMANIA HEADER
        ===================================================== */}
        <section
          className="
            relative
            w-full
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
            px-5
            py-8
            sm:px-8
            lg:px-10
          "
        >
          {/* Ambient Glow */}
          <div
            className="
              pointer-events-none
              absolute
              right-[-120px]
              top-[-180px]
              h-[400px]
              w-[400px]
              rounded-full
              bg-[#B9FF00]/[0.035]
              blur-[100px]
            "
          />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#B9FF00]
                  shadow-[0_0_10px_rgba(185,255,0,0.7)]
                "
              />

              <span
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-zinc-600
                "
              >
                Jeff92 & Ayan Sumania Contributors
              </span>
            </div>

            <BannerTitleComponent
              title="Become An Editor"
              description="Apply to join our editor community and start sharing your DJ edits with DJs worldwide. Submit your details and a sample of your work for review."
            />
          </div>
        </section>


        {/* =====================================================
            MAIN PANEL
        ===================================================== */}
        <section
          className="
            grid
            w-full
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
            md:grid-cols-[minmax(0,1fr)_380px]
          "
        >
          {/* =================================================
              FORM
          ================================================= */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3">
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
                  <UploadCloud className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-zinc-100">
                    Editor Application
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      uppercase
                      tracking-[0.14em]
                      text-zinc-600
                    "
                  >
                    Submit your DJ profile and work samples
                  </p>
                </div>
              </div>
            </div>


            <form
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-1 gap-5"
            >
              {/* DJ NAME */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="username"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.13em]
                    text-zinc-600
                  "
                >
                  DJ Name
                </label>

                <Input
                  id="username"
                  name="username"
                  placeholder="Enter DJ Name"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className="
                    h-11
                    rounded-xl
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-3
                    text-sm
                    text-zinc-300
                    shadow-none
                    placeholder:text-zinc-700
                    focus-visible:border-[#B9FF00]/30
                    focus-visible:ring-[#B9FF00]/10
                    disabled:opacity-50
                  "
                />

                {formik.touched.username &&
                  formik.errors.username && (
                    <p className="text-[10px] text-red-400">
                      {formik.errors.username}
                    </p>
                  )
                }
              </div>


              {/* LINK TO LISTEN */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="linkToListen"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.13em]
                    text-zinc-600
                  "
                >
                  Link to listen your works
                </label>

                {/* NOTICE */}
                <div
                  className="
                    mb-1
                    flex
                    items-start
                    gap-2
                    rounded-xl
                    border
                    border-[#B9FF00]/10
                    bg-[#B9FF00]/[0.025]
                    px-3
                    py-3
                  "
                >
                  <span
                    className="
                      mt-1.5
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-[#B9FF00]
                      shadow-[0_0_6px_rgba(185,255,0,0.5)]
                    "
                  />

                  <p
                    className="
                      text-[10px]
                      leading-5
                      text-zinc-500
                    "
                  >
                    Make sure your uploaded tracks have proper filenames with
                    artist &amp; track name. Avoid replacing original artists&apos;
                    names with your DJ name. This helps us keep the catalog clean.
                  </p>
                </div>

                <textarea
                  id="linkToListen"
                  name="linkToListen"
                  value={formik.values.linkToListen}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={5}
                  maxLength={500}
                  disabled={formik.isSubmitting}
                  placeholder="(ex. Mediafire, Google Drive link) include atleast 5 of your best remixes and/or edits."
                  className="
                    min-h-[150px]
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-3
                    py-3
                    text-sm
                    text-zinc-300
                    outline-none
                    transition-all
                    placeholder:text-zinc-700
                    focus:border-[#B9FF00]/30
                    focus:bg-white/[0.04]
                    disabled:opacity-50
                  "
                />

                <div className="mt-1 flex justify-between gap-3 text-[10px]">
                  <span className="text-zinc-600">
                    {formik.values.linkToListen.length}/500 characters
                  </span>

                  {formik.touched.linkToListen &&
                    formik.errors.linkToListen && (
                      <span className="text-red-400">
                        {formik.errors.linkToListen}
                      </span>
                    )
                  }
                </div>
              </div>


              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="
                  h-12
                  w-full
                  rounded-xl
                  bg-[#B9FF00]
                  text-xs
                  font-semibold
                  text-black
                  hover:bg-[#B9FF00]
                  disabled:bg-[#B9FF00]/40
                  disabled:text-black/60
                "
              >
                {formik.isSubmitting && (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                )}

                {formik.isSubmitting
                  ? "Submitting Request..."
                  : "Submit Request"
                }
              </Button>
            </form>
          </div>


          {/* =================================================
              VISUAL / INFO
          ================================================= */}
          <div
            className="
              relative
              hidden
              overflow-hidden
              border-l
              border-white/[0.06]
              bg-[#111518]/20
              p-7
              md:flex
              md:flex-col
              md:justify-between
            "
          >
            {/* Glow */}
            <div
              className="
                pointer-events-none
                absolute
                right-[-100px]
                top-[-120px]
                h-[300px]
                w-[300px]
                rounded-full
                bg-[#B9FF00]/[0.06]
                blur-[100px]
              "
            />

            <div className="relative">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#B9FF00]/10
                  bg-[#B9FF00]/[0.07]
                  text-[#B9FF00]
                "
              >
                <Headphones className="h-6 w-6" />
              </div>

              <h3
                className="
                  mt-6
                  text-2xl
                  font-bold
                  tracking-tight
                  text-zinc-100
                "
              >
                Join as an Editor
              </h3>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-zinc-500
                "
              >
                Share your DJ edits and get discovered by DJs worldwide.
              </p>
            </div>


            {/* FEATURES */}
            <div className="relative mt-10 flex flex-col gap-3">
              <EditorBenefit
                icon={Music2}
                title="Share your edits"
                description="Publish remixes and DJ edits to the Jeff92 & Ayan Sumania community."
              />

              <EditorBenefit
                icon={Sparkles}
                title="Build your profile"
                description="Grow your presence as a Jeff92 & Ayan Sumania contributor."
              />

              <EditorBenefit
                icon={Headphones}
                title="Reach DJs"
                description="Get your work heard by working DJs around the world."
              />
            </div>


            <div
              className="
                relative
                mt-8
                border-t
                border-white/[0.06]
                pt-5
              "
            >
              <div className="flex items-center gap-2">
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
                    tracking-[0.16em]
                    text-zinc-600
                  "
                >
                  Applications are reviewed manually
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


const EditorBenefit = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-2xl
        border
        border-white/[0.05]
        bg-white/[0.015]
        p-3
      "
    >
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-white/[0.025]
          text-zinc-600
        "
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div>
        <h4 className="text-xs font-semibold text-zinc-300">
          {title}
        </h4>

        <p className="mt-1 text-[10px] leading-5 text-zinc-600">
          {description}
        </p>
      </div>
    </div>
  );
};