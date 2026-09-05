import {
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
  LockKeyhole,
} from 'lucide-react'
import React, {
  useMemo,
  useState
} from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { api } from '@/utils/api'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { useAtom } from 'jotai'
import { changePasswordState } from '@/state/globalState'
import zxcvbn from "zxcvbn"


export const changepasswordSchema =
  Yup.object({
    password: Yup.string()
      .required(
        'Password is required'
      ),

    newpassword: Yup.string()
      .required(
        'Password is required'
      ),

    newpasswordConfirmation:
      Yup.string()
        .required(
          'Password is required'
        )
        .oneOf(
          [
            Yup.ref(
              'newpassword'
            ),
            ''
          ],
          'Passwords must match'
        )
  })


const ChangePasswordFormComponent = () => {
  const [open, setOpen] =
    useAtom(
      changePasswordState
    )


  const {
    mutateAsync:
      updateChangePassword
  } =
    api.user.changepasswordUpdate.useMutation({
      onSuccess: () => {
        toast.success(
          "Password successfully changed"
        )

        resetForm()

        setOpen(false)
      },

      onError: (error) => {
        toast.error(
          error.message
        )
      },
    })


  const {
    values,
    resetForm,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleBlur
  } =
    useFormik({
      enableReinitialize: true,

      initialValues: {
        password: "",
        newpassword: "",
        newpasswordConfirmation: "",
      },

      validationSchema:
        changepasswordSchema,

      onSubmit: async (
        values
      ) => {
        if (
          values.newpassword !==
          values.newpasswordConfirmation
        ) {
          return toast.error(
            'New password does not matched'
          )
        }

        await updateChangePassword({
          password:
            values.password,

          newpassword:
            values.newpassword,

          newpasswordConfirmation:
            values.newpasswordConfirmation,
        })
      }
    })


  /* =====================================================
      SHOW / HIDE PASSWORD
  ===================================================== */
  const [
    showPassword,
    setShowPassword
  ] = useState({
    current: false,
    new: false,
    confirm: false,
  })


  /* =====================================================
      PASSWORD STRENGTH
  ===================================================== */
  const passwordScore =
    useMemo(() => {
      if (
        !values.newpassword
      ) return 0

      return zxcvbn(
        values.newpassword
      ).score
    }, [
      values.newpassword
    ])


  const passwordStrengthLabel = [
    "Very Weak",
    "Weak",
    "Fair",
    "Strong",
    "Very Strong"
  ]


  const passwordStrengthColor = [
    "bg-red-500",
    "bg-orange-400",
    "bg-[#B9FF00]",
    "bg-green-400",
    "bg-green-500"
  ]


  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogContent
        className="
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-zinc-950
          p-0
          text-zinc-200
          shadow-[0_30px_80px_rgba(0,0,0,0.65)]
        "
      >
        {/* =================================================
            AMBIENT GLOW
        ================================================= */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-130px]
            top-[-170px]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[100px]
          "
        />


        {/* =================================================
            HEADER
        ================================================= */}
        <div
          className="
            relative
            border-b
            border-white/[0.06]
            px-6
            pb-5
            pt-6
          "
        >
          <div
            className="
              mb-4
              flex
              items-center
              gap-2
            "
          >
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
              Jeff92 & Ayan Sumania Security
            </span>
          </div>


          <div
            className="
              flex
              items-center
              gap-3
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
                border
                border-[#B9FF00]/10
                bg-[#B9FF00]/[0.06]
                text-[#B9FF00]
              "
            >
              <LockKeyhole
                className="
                  h-4
                  w-4
                "
              />
            </div>


            <div>
              <AlertDialogTitle
                className="
                  text-lg
                  font-semibold
                  tracking-tight
                  text-zinc-100
                "
              >
                Change Password
              </AlertDialogTitle>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-zinc-500
                "
              >
                Make sure your new
                password is strong
                and secure.
              </p>
            </div>
          </div>
        </div>


        {/* =================================================
            FORM
        ================================================= */}
        <form
          onSubmit={handleSubmit}
          className="
            relative
            space-y-5
            px-6
            py-6
          "
        >
          {/* =================================================
              CURRENT PASSWORD
          ================================================= */}
          <div
            className="
              flex
              flex-col
              gap-1.5
            "
          >
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
              Current Password
            </label>


            <div
              className="
                relative
                flex
                items-center
              "
            >
              <Input
                type={
                  showPassword.current
                    ? "text"
                    : "password"
                }
                id="password"
                name="password"
                autoComplete="off"
                value={
                  values.password
                }
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
                  pr-10
                  text-sm
                  text-zinc-300
                  shadow-none
                  placeholder:text-zinc-700
                  focus-visible:border-[#B9FF00]/30
                  focus-visible:ring-[#B9FF00]/10
                "
              />


              <button
                type="button"
                tabIndex={-1}
                onClick={() =>
                  setShowPassword(
                    prev => ({
                      ...prev,
                      current:
                        !prev.current
                    })
                  )
                }
                className="
                  absolute
                  right-3
                  flex
                  h-full
                  items-center
                  justify-center
                  text-zinc-600
                  transition-colors
                  hover:text-[#B9FF00]
                "
              >
                {showPassword.current ? (
                  <EyeOffIcon
                    className="
                      h-4
                      w-4
                      cursor-pointer
                    "
                  />
                ) : (
                  <EyeIcon
                    className="
                      h-4
                      w-4
                      cursor-pointer
                    "
                  />
                )}
              </button>
            </div>


            {errors.password && (
              <p
                className="
                  text-[10px]
                  text-red-400
                "
              >
                {errors.password}
              </p>
            )}
          </div>


          {/* =================================================
              NEW PASSWORD
          ================================================= */}
          <div
            className="
              flex
              flex-col
              gap-1.5
            "
          >
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


            <div
              className="
                relative
                flex
                items-center
              "
            >
              <Input
                type={
                  showPassword.new
                    ? "text"
                    : "password"
                }
                id="newpassword"
                name="newpassword"
                autoComplete="off"
                value={
                  values.newpassword
                }
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
                  pr-10
                  text-sm
                  text-zinc-300
                  shadow-none
                  placeholder:text-zinc-700
                  focus-visible:border-[#B9FF00]/30
                  focus-visible:ring-[#B9FF00]/10
                "
              />


              <button
                type="button"
                tabIndex={-1}
                onClick={() =>
                  setShowPassword(
                    prev => ({
                      ...prev,
                      new:
                        !prev.new
                    })
                  )
                }
                className="
                  absolute
                  right-3
                  flex
                  h-full
                  items-center
                  justify-center
                  text-zinc-600
                  transition-colors
                  hover:text-[#B9FF00]
                "
              >
                {showPassword.new ? (
                  <EyeOffIcon
                    className="
                      h-4
                      w-4
                      cursor-pointer
                    "
                  />
                ) : (
                  <EyeIcon
                    className="
                      h-4
                      w-4
                      cursor-pointer
                    "
                  />
                )}
              </button>
            </div>


            {/* PASSWORD STRENGTH */}
            {values.newpassword && (
              <div
                className="
                  mt-1
                  rounded-xl
                  border
                  border-white/[0.05]
                  bg-white/[0.015]
                  px-3
                  py-3
                "
              >
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-zinc-600
                    "
                  >
                    Password Strength
                  </span>

                  <span
                    className="
                      text-[9px]
                      font-medium
                      text-zinc-400
                    "
                  >
                    {
                      passwordStrengthLabel[
                        passwordScore
                      ]
                    }
                  </span>
                </div>


                <div
                  className="
                    h-1.5
                    w-full
                    overflow-hidden
                    rounded-full
                    bg-white/[0.06]
                  "
                >
                  <div
                    className={`
                      h-full
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        passwordStrengthColor[
                          passwordScore
                        ]
                      }
                    `}
                    style={{
                      width:
                        `${(passwordScore + 1) * 20}%`
                    }}
                  />
                </div>
              </div>
            )}


            {errors.newpassword && (
              <p
                className="
                  text-[10px]
                  text-red-400
                "
              >
                {errors.newpassword}
              </p>
            )}
          </div>


          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}
          <div
            className="
              flex
              flex-col
              gap-1.5
            "
          >
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


            <div
              className="
                relative
                flex
                items-center
              "
            >
              <Input
                type={
                  showPassword.confirm
                    ? "text"
                    : "password"
                }
                id="newpasswordConfirmation"
                name="newpasswordConfirmation"
                autoComplete="off"
                value={
                  values.newpasswordConfirmation
                }
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
                  pr-10
                  text-sm
                  text-zinc-300
                  shadow-none
                  placeholder:text-zinc-700
                  focus-visible:border-[#B9FF00]/30
                  focus-visible:ring-[#B9FF00]/10
                "
              />


              <button
                type="button"
                tabIndex={-1}
                onClick={() =>
                  setShowPassword(
                    prev => ({
                      ...prev,
                      confirm:
                        !prev.confirm
                    })
                  )
                }
                className="
                  absolute
                  right-3
                  flex
                  h-full
                  items-center
                  justify-center
                  text-zinc-600
                  transition-colors
                  hover:text-[#B9FF00]
                "
              >
                {showPassword.confirm ? (
                  <EyeOffIcon
                    className="
                      h-4
                      w-4
                      cursor-pointer
                    "
                  />
                ) : (
                  <EyeIcon
                    className="
                      h-4
                      w-4
                      cursor-pointer
                    "
                  />
                )}
              </button>
            </div>


            {errors.newpasswordConfirmation && (
              <p
                className="
                  text-[10px]
                  text-red-400
                "
              >
                {
                  errors.newpasswordConfirmation
                }
              </p>
            )}
          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}
          <div
            className="
              flex
              flex-col-reverse
              gap-2
              border-t
              border-white/[0.06]
              pt-5
              sm:flex-row
              sm:justify-end
            "
          >
            <Button
              type="button"
              tabIndex={-1}
              variant="ghost"
              onClick={() =>
                setOpen(false)
              }
              className="
                h-10
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                px-4
                text-xs
                font-medium
                text-zinc-500
                hover:border-white/15
                hover:bg-white/[0.05]
                hover:text-zinc-200
              "
            >
              Cancel
            </Button>


            <Button
              disabled={
                isSubmitting
              }
              type="submit"
              className="
                h-10
                rounded-xl
                bg-[#B9FF00]
                px-5
                text-xs
                font-semibold
                text-black
                shadow-[0_0_18px_rgba(185,255,0,0.08)]
                hover:bg-[#B9FF00]
                disabled:bg-[#B9FF00]/30
                disabled:text-black/50
              "
            >
              Change Password

              {isSubmitting && (
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
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export default ChangePasswordFormComponent