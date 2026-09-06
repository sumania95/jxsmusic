import React, { useState } from 'react'
import {
  PlusCircle,
  LoaderIcon,
  CalendarIcon,
  TicketPercent,
} from 'lucide-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { format } from 'date-fns'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { api } from '@/utils/api'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'


/* =========================================================
   VALIDATION
========================================================= */

const couponSchema = Yup.object().shape({
  name: Yup.string()
    .required('Coupon name is required'),

  code: Yup.string()
    .required('Coupon code is required'),

  value: Yup.number()
    .min(1, 'Minimum 1%')
    .max(100, 'Maximum 100%')
    .required('Discount percentage is required'),

  minSpend: Yup.number()
    .min(0)
    .required(),

  year: Yup.number()
    .required(),

  startsAt: Yup.date()
    .required(),

  expiresAt: Yup.date()
    .min(
      Yup.ref('startsAt'),
      'Expiry must be after start date'
    )
    .required(),
})


/* =========================================================
   COMPONENT
========================================================= */

const AdminNewFormCoupon = () => {
  const utils = api.useUtils()

  const [open, setOpen] =
    useState(false)


  const {
    mutateAsync: createCoupon
  } =
    api.coupon.create.useMutation({
      onSuccess: async () => {
        toast.success(
          'Coupon created successfully'
        )

        await utils.coupon.getAll.invalidate()

        resetForm()

        setOpen(false)
      },

      onError: (error) =>
        toast.error(
          error.message
        ),
    })


  const {
    values,
    errors,
    touched,
    isSubmitting,
    resetForm,
    handleChange,
    handleSubmit,
    setFieldValue,
  } =
    useFormik({
      initialValues: {
        name: '',
        code: '',
        value: 10,
        minSpend: 200000,
        year:
          new Date().getFullYear(),

        startsAt:
          new Date(),

        expiresAt:
          new Date(
            new Date().setMonth(
              new Date().getMonth() + 1
            )
          ),
      },

      validationSchema:
        couponSchema,

      onSubmit: async (
        values
      ) => {
        await createCoupon({
          ...values,

          code:
            values.code.toUpperCase(),
        })
      },
    })


  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      {/* =====================================================
          TRIGGER
      ===================================================== */}
      <AlertDialogTrigger asChild>
        <Button
          className="
            flex
            h-10
            items-center
            gap-2
            rounded-xl
            bg-[#B9FF00]
            px-4
            text-xs
            font-semibold
            text-black
            shadow-[0_0_18px_rgba(185,255,0,0.08)]
            hover:bg-[#B9FF00]
          "
        >
          <PlusCircle className="h-4 w-4" />

          Add Coupon
        </Button>
      </AlertDialogTrigger>


      {/* =====================================================
          DIALOG
      ===================================================== */}
      <AlertDialogContent
        className="
          max-h-[90vh]
          max-w-xl
          overflow-y-auto
          rounded-3xl
          border
          border-white/10
          bg-zinc-950
          p-0
          text-zinc-200
          shadow-[0_30px_80px_rgba(0,0,0,0.65)]
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


        <form
          onSubmit={handleSubmit}
          className="relative"
        >
          <AlertDialogHeader>
            {/* =================================================
                HEADER
            ================================================= */}
            <div
              className="
                border-b
                border-white/[0.06]
                px-6
                pb-5
                pt-6
                text-left
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
                  Jeff92 & Ayan Sumania Coupons
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
                  <TicketPercent className="h-4 w-4" />
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
                    Create Coupon
                  </AlertDialogTitle>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-zinc-500
                    "
                  >
                    Create a discount coupon with usage dates and minimum spend.
                  </p>
                </div>
              </div>
            </div>


            {/* =================================================
                FORM BODY
            ================================================= */}
            <AlertDialogDescription
              className="
                grid
                gap-5
                px-6
                py-6
                text-left
              "
            >
              {/* COUPON NAME */}
              <Field
                label="Coupon Name"
                error={
                  touched.name &&
                  errors.name
                }
              >
                <Input
                  name="name"
                  placeholder="Valentines Sales"
                  value={values.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={inputClassName}
                />
              </Field>


              {/* COUPON CODE */}
              <Field
                label="Coupon Code"
                helper="The code customers will enter during checkout."
                error={
                  touched.code &&
                  errors.code
                }
              >
                <Input
                  name="code"
                  placeholder="SAVE10"
                  value={values.code}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`
                    ${inputClassName}
                    uppercase
                  `}
                />
              </Field>


              {/* DISCOUNT / YEAR */}
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <Field
                  label="Discount (%)"
                  helper="Percentage discount applied to total amount."
                  error={
                    touched.value &&
                    errors.value
                  }
                >
                  <Input
                    type="number"
                    name="value"
                    min={1}
                    max={100}
                    value={values.value}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={inputClassName}
                  />
                </Field>


                <Field
                  label="Year"
                >
                  <Input
                    type="number"
                    name="year"
                    value={values.year}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={inputClassName}
                  />
                </Field>
              </div>


              {/* MINIMUM SPEND */}
              <Field
                label={`Minimum Spend (${formatCurrency(
                  values.minSpend
                )})`}
                helper="Minimum order amount required before this coupon can be applied."
              >
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  disabled={isSubmitting}
                  id="minSpend"
                  name="minSpend"
                  autoComplete="off"
                  value={
                    values.minSpend > 0
                      ? values.minSpend / 100
                      : ""
                  }
                  onChange={(e) => {
                    const raw =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )


                    if (raw === "") {
                      void setFieldValue(
                        "minSpend",
                        0
                      )

                      return
                    }


                    const dollars =
                      parseInt(
                        raw,
                        10
                      )


                    void setFieldValue(
                      "minSpend",
                      dollars * 100
                    )
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "." ||
                      e.key === ","
                    ) {
                      e.preventDefault()
                    }
                  }}
                  className={inputClassName}
                />
              </Field>


              {/* =================================================
                  DATE PICKERS
              ================================================= */}
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <DatePicker
                  label="Starts At"
                  value={
                    values.startsAt
                  }
                  onChange={(date) =>
                    setFieldValue(
                      'startsAt',
                      date
                    )
                  }
                  error={
                    touched.startsAt &&
                    typeof errors.startsAt === 'string'
                      ? errors.startsAt
                      : false
                  }
                />


                <DatePicker
                  label="Expires At"
                  value={
                    values.expiresAt
                  }
                  onChange={(date) =>
                    setFieldValue(
                      'expiresAt',
                      date
                    )
                  }
                  error={
                    touched.expiresAt &&
                    typeof errors.expiresAt === 'string'
                      ? errors.expiresAt
                      : false
                  }
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>


          {/* =================================================
              FOOTER
          ================================================= */}
          <AlertDialogFooter
            className="
              border-t
              border-white/[0.06]
              px-6
              py-5
            "
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setOpen(false)
              }
              disabled={isSubmitting}
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
              type="submit"
              disabled={isSubmitting}
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
              Create

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
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}


/* =========================================================
   INPUT STYLE
========================================================= */

const inputClassName = `
  h-11
  rounded-xl
  border-white/[0.08]
  bg-white/[0.025]
  text-sm
  text-zinc-300
  shadow-none
  placeholder:text-zinc-700
  selection:bg-yellow-100
  selection:text-black
  focus-visible:border-[#B9FF00]/30
  focus-visible:ring-[#B9FF00]/10
  disabled:cursor-not-allowed
  disabled:opacity-50
`


/* =========================================================
   FIELD
========================================================= */

const Field = ({
  label,
  children,
  helper,
  error,
}: {
  label: string
  children: React.ReactNode
  helper?: string
  error?: string | false
}) => (
  <div
    className="
      flex
      flex-col
      gap-1.5
    "
  >
    <label
      className="
        text-[9px]
        font-medium
        uppercase
        tracking-[0.13em]
        text-zinc-600
      "
    >
      {label}
    </label>


    {children}


    {helper && (
      <p
        className="
          text-[10px]
          leading-5
          text-zinc-700
        "
      >
        {helper}
      </p>
    )}


    {error && (
      <p
        className="
          text-[10px]
          text-red-400
        "
      >
        {error}
      </p>
    )}
  </div>
)


/* =========================================================
   DATE PICKER
========================================================= */

const DatePicker = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: Date
  onChange:
    (
      date:
        Date | undefined
    ) => void
  error?: string | false
}) => {
  const [
    month,
    setMonth
  ] =
    React.useState<
      Date | undefined
    >(value)


  return (
    <div
      className="
        flex
        flex-col
        gap-1.5
      "
    >
      <label
        className="
          text-[9px]
          font-medium
          uppercase
          tracking-[0.13em]
          text-zinc-600
        "
      >
        {label}
      </label>


      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="
              h-11
              w-full
              justify-start
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              px-3
              text-left
              text-xs
              font-normal
              text-zinc-400
              shadow-none
              hover:border-[#B9FF00]/20
              hover:bg-white/[0.04]
              hover:text-zinc-200
            "
          >
            <CalendarIcon
              className="
                mr-2
                h-4
                w-4
                text-[#B9FF00]
              "
            />

            {value
              ? format(
                  value,
                  'PPP'
                )
              : 'Pick a date'}
          </Button>
        </PopoverTrigger>


        <PopoverContent
          className="
            w-auto
            rounded-2xl
            border
            border-white/10
            bg-zinc-950
            p-2
            text-zinc-200
            shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          "
          align="start"
        >
          <Calendar
            mode="single"
            selected={value}
            month={month}
            onMonthChange={
              setMonth
            }
            onSelect={(date) => {
              onChange(date)

              setMonth(date)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>


      {error && (
        <p
          className="
            text-[10px]
            text-red-400
          "
        >
          {error}
        </p>
      )}
    </div>
  )
}


export default AdminNewFormCoupon