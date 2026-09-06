"use client";

import React, { useState } from "react";
import { CalendarIcon, Loader2, Pencil } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { toast } from "sonner";

import { api } from "@/utils/api";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const couponSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Coupon name is required"),

  code: Yup.string()
    .trim()
    .required("Coupon code is required"),

  value: Yup.number()
    .integer("Discount must be a whole number")
    .min(1, "Minimum discount is 1%")
    .max(100, "Maximum discount is 100%")
    .required("Discount is required"),

  minSpend: Yup.number()
    .integer()
    .min(0, "Minimum spend cannot be negative")
    .required(),

  year: Yup.number()
    .integer()
    .min(2000)
    .max(2200)
    .required("Year is required"),

  startsAt: Yup.date()
    .required("Start date is required"),

  expiresAt: Yup.date()
    .min(
      Yup.ref("startsAt"),
      "Expiry must be after start date",
    )
    .required("Expiry date is required"),

  isActive: Yup.boolean().required(),
});

interface Props {
  id: string;
  name: string | null;
  code: string;
  value: number;
  minSpend: number;
  year: number;
  isActive: boolean;
  startsAt: Date | null;
  expiresAt: Date | null;
}

export default function AdminCouponUpdate({
  id,
  name,
  code,
  value,
  minSpend,
  year,
  isActive,
  startsAt,
  expiresAt,
}: Props) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  const updateCoupon = api.coupon.update.useMutation({
    onSuccess: async () => {
      toast.success("Coupon updated successfully");

      setOpen(false);

      await utils.coupon.getAll.invalidate();
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: name ?? "",
      code,
      value,
      minSpend,
      year,
      startsAt: startsAt
        ? new Date(startsAt)
        : new Date(),
    startsAtChanged:false,
      expiresAt: expiresAt
        ? new Date(expiresAt)
        : new Date(
            new Date().setMonth(
              new Date().getMonth() + 1,
            ),
          ),
          expiresAtChanged:false,
    
      isActive,
    },

    validationSchema: couponSchema,

    onSubmit: async (values) => {
      await updateCoupon.mutateAsync({
        id,
        name: values.name.trim(),
        code: values.code.trim().toUpperCase(),
        value: values.value,
        minSpend: values.minSpend,
        year: values.year,
        startsAt: values.startsAt,
        expiresAt: values.expiresAt,
        isActive: values.isActive,
        startsAtChanged:values.startsAtChanged,
        expiresAtChanged:values.expiresAtChanged,
      });
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (formik.isSubmitting) {
      return;
    }

    setOpen(nextOpen);

    if (nextOpen) {
      formik.resetForm();
      updateCoupon.reset();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Edit coupon"
          className="h-9 w-9 rounded-xl border-white/[0.08] bg-white/[0.025] text-zinc-500 hover:border-[#B9FF00]/20 hover:bg-[#B9FF00]/10 hover:text-[#B9FF00]"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Edit coupon</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-0 text-zinc-200 shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader className="border-b border-white/[0.06] px-6 pb-5 pt-6 text-left">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_8px_rgba(185,255,0,0.7)]" />

              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                Coupon management
              </span>
            </div>

            <DialogTitle className="text-lg font-semibold text-zinc-100">
              Update coupon
            </DialogTitle>

            <DialogDescription className="text-xs text-zinc-500">
              Update the discount, dates, minimum spend, and
              availability.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 px-6 py-6">
            <Field
              label="Coupon name"
              error={
                formik.touched.name
                  ? formik.errors.name
                  : undefined
              }
            >
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
                className={inputClassName}
              />
            </Field>

            <Field
              label="Coupon code"
              helper="The code entered by customers during checkout."
              error={
                formik.touched.code
                  ? formik.errors.code
                  : undefined
              }
            >
              <Input
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
                className={`${inputClassName} uppercase`}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Discount (%)"
                error={
                  formik.touched.value
                    ? formik.errors.value
                    : undefined
                }
              >
                <Input
                  type="number"
                  name="value"
                  min={1}
                  max={100}
                  step={1}
                  value={formik.values.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className={inputClassName}
                />
              </Field>

              <Field
                label="Year"
                error={
                  formik.touched.year
                    ? formik.errors.year
                    : undefined
                }
              >
                <Input
                  type="number"
                  name="year"
                  min={2000}
                  max={2200}
                  step={1}
                  value={formik.values.year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className={inputClassName}
                />
              </Field>
            </div>

            <Field
              label={`Minimum spend (${formatCurrency(
                formik.values.minSpend,
              )})`}
              helper="Minimum order amount required before this coupon can be applied."
              error={
                formik.touched.minSpend
                  ? formik.errors.minSpend
                  : undefined
              }
            >
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="minSpend"
                autoComplete="off"
                value={
                  formik.values.minSpend > 0
                    ? formik.values.minSpend / 100
                    : ""
                }
                onChange={(event) => {
                  const raw = event.target.value.replace(
                    /\D/g,
                    "",
                  );

                  void formik.setFieldValue(
                    "minSpend",
                    raw === ""
                      ? 0
                      : Number.parseInt(raw, 10) * 100,
                  );
                }}
                onBlur={() =>
                  formik.setFieldTouched(
                    "minSpend",
                    true,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "." ||
                    event.key === ","
                  ) {
                    event.preventDefault();
                  }
                }}
                disabled={formik.isSubmitting}
                className={inputClassName}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DatePicker
                label="Starts at"
                value={formik.values.startsAt}
                onChange={(date) => {
                  if (date) {
                    void formik.setFieldValue(
                      "startsAt",
                      date,
                    );
                    void formik.setFieldValue("startsAtChanged",true)
                  }
                }}
                error={
                  formik.touched.startsAt &&
                  typeof formik.errors.startsAt === "string"
                    ? formik.errors.startsAt
                    : undefined
                }
              />

              <DatePicker
                label="Expires at"
                value={formik.values.expiresAt}
                onChange={(date) => {
                  if (date) {
                    void formik.setFieldValue(
                      "expiresAt",
                      date,
                    );
                    void formik.setFieldValue("expiresAtChanged",true)
                  }
                }}
                error={
                  formik.touched.expiresAt &&
                  typeof formik.errors.expiresAt === "string"
                    ? formik.errors.expiresAt
                    : undefined
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div>
                <p className="text-xs font-medium text-zinc-300">
                  Active coupon
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  Customers can use this coupon during checkout.
                </p>
              </div>

              <Switch
                checked={formik.values.isActive}
                onCheckedChange={(checked) =>
                  formik.setFieldValue(
                    "isActive",
                    checked,
                  )
                }
                disabled={formik.isSubmitting}
              />
            </div>

            {updateCoupon.error && (
              <p className="text-xs text-red-400">
                {updateCoupon.error.message}
              </p>
            )}
          </div>

          <DialogFooter className="border-t border-white/[0.06] px-6 py-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={formik.isSubmitting}
              className="h-10 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 text-xs text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                formik.isSubmitting ||
                !formik.isValid
              }
              className="h-10 rounded-xl bg-[#B9FF00] px-5 text-xs font-semibold text-black hover:bg-[#B9FF00]/90"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update coupon"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const inputClassName = `
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
  disabled:cursor-not-allowed
  disabled:opacity-50
`;

type FieldProps = {
  label: string;
  children: React.ReactNode;
  helper?: string;
  error?: string;
};

function Field({
  label,
  children,
  helper,
  error,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-medium uppercase tracking-[0.13em] text-zinc-600">
        {label}
      </label>

      {children}

      {helper && (
        <p className="text-[10px] leading-5 text-zinc-700">
          {helper}
        </p>
      )}

      {error && (
        <p className="text-[10px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type DatePickerProps = {
  label: string;
  value: Date;
  onChange: (date: Date | undefined) => void;
  error?: string;
};

function DatePicker({
  label,
  value,
  onChange,
  error,
}: DatePickerProps) {
  const [month, setMonth] = useState<Date | undefined>(
    value,
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-medium uppercase tracking-[0.13em] text-zinc-600">
        {label}
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="h-11 w-full justify-start rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-left text-xs font-normal text-zinc-400 shadow-none hover:border-[#B9FF00]/20 hover:bg-white/[0.04] hover:text-zinc-200"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[#B9FF00]" />

            {format(value, "PPP")}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-auto rounded-2xl border border-white/10 bg-zinc-950 p-2 text-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <Calendar
            mode="single"
            selected={value}
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              onChange(date);

              if (date) {
                setMonth(date);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-[10px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}