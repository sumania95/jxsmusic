import { useFormik } from "formik"
import { LoaderIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import * as Yup from "yup"
import { api } from "@/utils/api"
import AuthLayout from "@/components/layout/auth-layout"
import { useState } from "react"
import { ProfileMeta } from "@/components/common/metadata"


export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
})


export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const { mutateAsync: requestPassword } =
    api.forgotPassword.sendv2.useMutation({
      onSuccess: () => {
        setSent(true)

        toast.success(
          "If the email exists, you’ll receive reset instructions."
        )
      },

      onError: (err) => {
        toast.warning(err.message)
      },
    })


  const formik = useFormik({
    initialValues: {
      email: ""
    },

    validationSchema: forgotPasswordSchema,

    onSubmit: async (values, { resetForm }) => {
      await requestPassword(values)

      resetForm()
    },
  })


  return (
    <AuthLayout>
      <ProfileMeta
        title="Forgot Password"
        description="Collection of DJ Music"
      />


      <form
        onSubmit={formik.handleSubmit}
        className="space-y-5"
      >
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div>
          <h1
            className="
              text-2xl
              font-semibold
              tracking-tight
              text-white
            "
          >
            Forgot Password
          </h1>

          <p
            className="
              mt-1.5
              text-xs
              leading-5
              text-zinc-500
            "
          >
            Enter your email and we’ll send you instructions to reset your
            password.
          </p>
        </div>


        {/* =====================================================
            EMAIL
        ===================================================== */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.13em]
              text-zinc-600
            "
          >
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={sent}
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
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          />

          {formik.touched.email &&
            formik.errors.email && (
              <p className="text-[10px] text-red-400">
                {formik.errors.email}
              </p>
            )
          }
        </div>


        {/* =====================================================
            SUBMIT
        ===================================================== */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#B9FF00]
            px-4
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
            <LoaderIcon className="h-4 w-4 animate-spin" />
          )}

          {formik.isSubmitting
            ? "Sending..."
            : sent
            ? "Email Sent"
            : "Reset Password"
          }
        </button>


        {/* =====================================================
            SUCCESS MESSAGE
        ===================================================== */}
        {sent && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-green-500/10
              bg-green-500/[0.04]
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
                bg-green-400
                shadow-[0_0_8px_rgba(74,222,128,0.5)]
              "
            />

            <p
              className="
                text-[10px]
                leading-5
                text-green-400
              "
            >
              If the email exists, instructions have been sent.
            </p>
          </div>
        )}


        {/* =====================================================
            BACK TO LOGIN
        ===================================================== */}
        <div
          className="
            border-t
            border-white/[0.06]
            pt-4
          "
        >
          <p className="text-center text-xs text-zinc-600">
            Remember your password?{" "}

            <Link
              href="/auth/login"
              className="
                font-medium
                text-[#B9FF00]
                transition-colors
                hover:text-[#B9FF00]
                hover:underline
              "
            >
              Back to login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}