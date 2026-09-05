import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { ProfileMeta } from "@/components/common/metadata";
import BannerTitleComponent from "@/components/common/banner-title";
import {
  AlertTriangle,
  FileWarning,
  Loader2,
  ShieldCheck,
} from "lucide-react";


const dmcaSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  companyName: Yup.string().required("Company name is required"),
  address: Yup.string().required("Address is required"),
  zipCode: Yup.string().required("Zip code is required"),
  telephone: Yup.string().required("Telephone is required"),
  relationship: Yup.string().required("Relationship is required"),
  contentTitle: Yup.string().required("Content title is required"),
  contentUrl: Yup.string()
    .url("Must be a valid URL")
    .required("Content URL is required"),
  additionalComments: Yup.string(),
});


interface DMCAFormValues {
  name: string;
  email: string;
  companyName: string;
  address: string;
  zipCode: string;
  telephone: string;
  relationship: string;
  contentTitle: string;
  contentUrl: string;
  additionalComments: string;
}


export default function DMCAForm() {
  const mutation = api.dmca.submit.useMutation({
    onSuccess() {
      toast.success("DMCA request submitted and developer notified");
      formik.resetForm();
    },
    onError(err) {
      toast.error(err.message || "Something went wrong");
    },
  });


  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      companyName: "",
      address: "",
      zipCode: "",
      telephone: "",
      relationship: "",
      contentTitle: "",
      contentUrl: "",
      additionalComments: "",
    },
    validationSchema: dmcaSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });


  return (
    <div className="w-full">
      <ProfileMeta
        title="DMCA Request"
        description="Submit a Digital Millennium Copyright Act request to notify infringement."
      />

      {/* =====================================================
          JEFF92 & AYAN SUMANIA HEADER
      ===================================================== */}
      <section
        className="
          relative
          mb-8
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
        {/* Ambient glow */}
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
              Jeff92 & Ayan Sumania Legal
            </span>
          </div>

          <BannerTitleComponent
            title="DMCA Request"
            description="Please fill the form below to report copyright infringement."
          />
        </div>
      </section>

      <div className="flex w-full flex-col gap-5">
        {/* =====================================================
            DISCLAIMER
        ===================================================== */}
        <section
          className="
            overflow-hidden
            rounded-3xl
            border
            border-[#B9FF00]/15
            bg-[#B9FF00]/[0.035]
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
              border-b
              border-[#B9FF00]/10
              px-4
              py-4
              sm:px-5
            "
          >
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
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                Disclaimer – DMCA
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
                Copyright infringement notice
              </p>
            </div>
          </div>

          <div
            className="
              space-y-3
              px-4
              py-4
              text-xs
              leading-6
              text-zinc-500
              sm:px-5
              sm:text-sm
              sm:leading-7
            "
          >
            <p>
              Jeff92 & Ayan Sumania respects the intellectual property rights of others.
              Per the DMCA, Jeff92 & Ayan Sumania will respond expeditiously to claims of
              copyright infringement if submitted as described below. Upon
              receipt of a notice alleging copyright infringement, Jeff92 & Ayan Sumania
              may take action including removal of the allegedly infringing
              materials.
            </p>

            <p>
              If you believe that your intellectual property rights have been
              violated, please notify us with a written communication including
              all required information.
            </p>
          </div>
        </section>

        {/* =====================================================
            FORM
        ===================================================== */}
        <section
          className="
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              border-b
              border-white/[0.06]
              px-4
              py-4
              sm:px-5
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#B9FF00]/10
                text-[#B9FF00]
              "
            >
              <FileWarning className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Copyright Infringement Report
              </h3>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Complete all required information
              </p>
            </div>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="
              grid
              grid-cols-1
              gap-4
              p-4
              sm:p-5
              md:grid-cols-2
            "
          >
            {Object.entries(formik.initialValues).map(([key, _]) => {
              const typedKey = key as keyof DMCAFormValues;

              const isTextArea =
                typedKey === "additionalComments";

              return (
                <div
                  key={typedKey}
                  className={`
                    flex
                    flex-col
                    gap-1.5

                    ${
                      typedKey === "contentUrl" ||
                      typedKey === "additionalComments"
                        ? "md:col-span-2"
                        : ""
                    }
                  `}
                >
                  <label
                    htmlFor={typedKey}
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.13em]
                      text-zinc-600
                    "
                  >
                    {typedKey.replace(/([A-Z])/g, " $1")}
                  </label>

                  {isTextArea ? (
                    <textarea
                      id={typedKey}
                      name={typedKey}
                      placeholder={typedKey}
                      rows={5}
                      className="
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
                      "
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[typedKey]}
                    />
                  ) : (
                    <input
                      id={typedKey}
                      name={typedKey}
                      placeholder={typedKey}
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-white/[0.08]
                        bg-white/[0.025]
                        px-3
                        text-sm
                        text-zinc-300
                        outline-none
                        transition-all
                        placeholder:text-zinc-700
                        focus:border-[#B9FF00]/30
                        focus:bg-white/[0.04]
                      "
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[typedKey]}
                    />
                  )}

                  {formik.touched[typedKey] &&
                    formik.errors[typedKey] && (
                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          font-medium
                          text-red-400
                        "
                      >
                        {formik.errors[typedKey]}
                      </p>
                    )
                  }
                </div>
              );
            })}

            {/* =================================================
                NOTICE
            ================================================= */}
            <div
              className="
                md:col-span-2
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-white/[0.05]
                bg-white/[0.015]
                px-4
                py-3
              "
            >
              <ShieldCheck
                className="
                  mt-0.5
                  h-4
                  w-4
                  shrink-0
                  text-[#B9FF00]
                "
              />

              <p
                className="
                  text-[10px]
                  leading-5
                  text-zinc-600
                "
              >
                By submitting this request, you confirm that the information
                provided is accurate and that you are authorized to report the
                alleged infringement.
              </p>
            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="
                md:col-span-2
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#B9FF00]
                px-5
                text-xs
                font-semibold
                text-black
                transition-all
                hover:bg-[#B9FF00]
                disabled:cursor-not-allowed
                disabled:bg-[#B9FF00]/40
                disabled:text-black/60
              "
            >
              {formik.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              Submit DMCA Request
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}