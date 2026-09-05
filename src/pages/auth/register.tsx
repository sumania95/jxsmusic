import { useFormik } from "formik"
import { LoaderIcon } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { toast } from "sonner"
import * as Yup from "yup"
import { api } from "@/utils/api"
import AuthLayout from "@/components/layout/auth-layout"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { ProfileMeta } from "@/components/common/metadata"


const registerSchema = Yup.object({
  name: Yup.string()
    .required("Name is required"),

  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required"),
})


export default function RegisterPage() {
  const router = useRouter()

  const {
    mutateAsync: registerUser
  } = api.user.create.useMutation()


  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validationSchema: registerSchema,

    onSubmit: async (values) => {
      try {
        await registerUser(values)

        toast.success("Account created 🎉")


        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        })


        await router.push("/")
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    },
  })


  return (
    <AuthLayout>
      <ProfileMeta
        title="Register"
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
            Create Account
          </h1>

          <p
            className="
              mt-1.5
              text-xs
              leading-5
              text-zinc-500
            "
          >
            Join Jeff92 & Ayan Sumania and get started in seconds.
          </p>
        </div>


        {/* =====================================================
            NAME
        ===================================================== */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.13em]
              text-zinc-600
            "
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
            disabled={formik.isSubmitting}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
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

          {formik.touched.name &&
            formik.errors.name && (
              <p className="text-[10px] text-red-400">
                {formik.errors.name}
              </p>
            )
          }
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
            placeholder="Create a password"
            autoComplete="new-password"
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
            REGISTER
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
            ? "Creating Account..."
            : "Continue"
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
            LOGIN LINK
        ===================================================== */}
        <div
          className="
            border-t
            border-white/[0.06]
            pt-4
          "
        >
          <p className="text-xs text-zinc-600">
            Already have an account?{" "}

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
              Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}