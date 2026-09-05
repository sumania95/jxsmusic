import AuthLayout from "@/components/layout/auth-layout"
import { useFormik } from "formik"
import { LoaderIcon } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { toast } from "sonner"
import * as Yup from "yup"
import { FcGoogle } from "react-icons/fc"
import { ProfileMeta } from "@/components/common/metadata"


const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required"),
})


export default function LoginPage() {
  const router = useRouter()


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginSchema,

    onSubmit: async (values) => {
      const res = await signIn("credentials", {
        ...values,
        redirect: false,
      })


      if (!res || res.error) {
        toast.error("Invalid email or password");
        return;
      }


      toast.success("Welcome back 👋")

      await router.push("/")
    },
  })


  return (
    <AuthLayout>
      <ProfileMeta
        title="Login"
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
            Welcome Back
          </h1>

          <p
            className="
              mt-1.5
              text-xs
              leading-5
              text-zinc-500
            "
          >
            Enter your credentials to continue to Jeff92 & Ayan Sumania.
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
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
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
            PASSWORD
        ===================================================== */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.13em]
              text-zinc-600
            "
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
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

          {formik.touched.password &&
            formik.errors.password && (
              <p className="text-[10px] text-red-400">
                {formik.errors.password}
              </p>
            )
          }
        </div>


        {/* =====================================================
            LOGIN
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
            ? "Signing In..."
            : "Login"
          }
        </button>


        {/* =====================================================
            DIVIDER
        ===================================================== */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/[0.06]" />
          </div>

          <div
            className="
              relative
              flex
              justify-center
              text-[9px]
              uppercase
              tracking-[0.13em]
            "
          >
            <span className="bg-zinc-950 px-3 text-zinc-100">
              Or continue with
            </span>
          </div>
        </div>


        {/* =====================================================
            GOOGLE
        ===================================================== */}
        <button
          type="button"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/"
            })
          }
          className="
            flex
            h-11
            w-full
            cursor-pointer
            items-center
            justify-center
            gap-3
            rounded-xl
            border
            border-white/[0.08]
            bg-white/[0.025]
            px-4
            text-xs
            font-medium
            text-zinc-300
            transition-all
            hover:border-white/[0.15]
            hover:bg-white/[0.05]
            hover:text-white
          "
        >
          <FcGoogle className="h-5 w-5" />

          <span>
            Continue with Google
          </span>
        </button>


        {/* =====================================================
            LINKS
        ===================================================== */}
        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            border-white/[0.06]
            pt-4
          "
        >
          <p className="text-xs text-zinc-600">
            Don&apos;t have an account yet?{" "}

            <Link
              href="/auth/register"
              className="
                font-medium
                text-[#B9FF00]
                transition-colors
                hover:text-[#B9FF00]
                hover:underline
              "
            >
              Register
            </Link>
          </p>


          <p className="text-xs text-zinc-600">
            Forgot your password?{" "}

            <Link
              href="/auth/forgot-password"
              className="
                font-medium
                text-[#B9FF00]
                transition-colors
                hover:text-[#B9FF00]
                hover:underline
              "
            >
              Reset Password
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}