import React from "react";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { env } from "@/env";
import { toast } from "sonner";
import {
  CircleDot,
  LoaderIcon,
  LockKeyhole,
} from "lucide-react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import { ProfileMeta } from "@/components/common/metadata";
import AuthLayout from "@/components/layout/auth-layout";


export const changepasswordSchema = Yup.object({
  newpassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  newpasswordConfirmation: Yup.string()
    .oneOf([Yup.ref("newpassword")], "Passwords must match")
    .required("Confirm password is required"),
});


const verifyToken = (token: string): boolean => {
  try {
    jwt.verify(token, String(env.AUTH_SECRET));
    return true;
  } catch {
    return false;
  }
};


interface Repo {
  email: string;
}


export const getServerSideProps: GetServerSideProps<{
  repo: Repo;
}> = async (context) => {
  const token =
    context.query.token as string | undefined;


  if (!token) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }


  const isValid = verifyToken(token);

  if (!isValid) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }


  const { email } =
    jwtDecode<{ email: string }>(token);


  return {
    props: {
      repo: {
        email: email,
      },
    },
  };
};


const TokenVerification = ({
  repo,
}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const router = useRouter();


  const {
    mutateAsync: updateChangePassword
  } = api.user.resetPassword.useMutation({
    onSuccess: async () => {
      toast.success(
        "Password successfully changed"
      );

      await router.push(
        "/auth/login"
      );
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });


  const formik = useFormik({
    initialValues: {
      newpassword: "",
      newpasswordConfirmation: "",
    },

    validationSchema:
      changepasswordSchema,

    onSubmit: async (
      values,
      { resetForm }
    ) => {
      await updateChangePassword({
        email: repo.email,
        newpassword:
          values.newpassword,
      });

      resetForm();
    },
  });


  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleBlur,
  } = formik;


  return (
    <>
      <ProfileMeta
        title="Forgot Password"
        description="Collection of DJ Music"
      />


      <AuthLayout>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* =====================================================
              HEADER
          ===================================================== */}
          <div>
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
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-zinc-600
                "
              >
                Jeff92 & Ayan Sumania Security
              </span>
            </div>


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
                <LockKeyhole className="h-5 w-5" />
              </div>


              <div>
                <h1
                  className="
                    text-xl
                    font-semibold
                    tracking-tight
                    text-white
                    sm:text-2xl
                  "
                >
                  Reset Password
                </h1>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-zinc-500
                  "
                >
                  Create a new password
                  for your Jeff92 & Ayan Sumania account.
                </p>
              </div>
            </div>
          </div>


          {/* =====================================================
              ACCOUNT
          ===================================================== */}
          <div
            className="
              rounded-xl
              border
              border-white/[0.05]
              bg-white/[0.015]
              px-3
              py-3
            "
          >
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-zinc-600
              "
            >
              Account
            </p>

            <p
              className="
                mt-1
                truncate
                text-xs
                text-zinc-400
              "
            >
              {repo.email}
            </p>
          </div>


          {/* =====================================================
              NEW PASSWORD
          ===================================================== */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="newpassword"
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-zinc-600
              "
            >
              New Password
            </label>


            <input
              id="newpassword"
              type="password"
              name="newpassword"
              value={
                values.newpassword
              }
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter password"
              autoComplete="new-password"
              disabled={isSubmitting}
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


            {errors.newpassword && (
              <p
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  text-red-400
                "
              >
                <CircleDot className="h-2 w-2" />

                {errors.newpassword}
              </p>
            )}
          </div>


          {/* =====================================================
              CONFIRM PASSWORD
          ===================================================== */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="newpasswordConfirmation"
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-zinc-600
              "
            >
              Confirm New Password
            </label>


            <input
              id="newpasswordConfirmation"
              type="password"
              name="newpasswordConfirmation"
              value={
                values.newpasswordConfirmation
              }
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm password"
              autoComplete="new-password"
              disabled={isSubmitting}
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


            {errors.newpasswordConfirmation && (
              <p
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  text-red-400
                "
              >
                <CircleDot className="h-2 w-2" />

                {
                  errors.newpasswordConfirmation
                }
              </p>
            )}
          </div>


          {/* =====================================================
              NOTICE
          ===================================================== */}
          <div
            className="
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
                shadow-[0_0_7px_rgba(185,255,0,0.5)]
              "
            />

            <p
              className="
                text-[10px]
                leading-5
                text-zinc-600
              "
            >
              Your new password must be at
              least 8 characters long.
            </p>
          </div>


          {/* =====================================================
              SUBMIT
          ===================================================== */}
          <button
            disabled={isSubmitting}
            type="submit"
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
            {isSubmitting && (
              <LoaderIcon
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />
            )}

            {isSubmitting
              ? "Resetting Password..."
              : "Reset Password"
            }
          </button>
        </form>
      </AuthLayout>
    </>
  )
}


export default TokenVerification