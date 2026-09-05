import { api } from "@/utils/api";
import { useFormik } from "formik";
import { LoaderIcon, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import * as Yup from "yup";

export const Schema = Yup.object().shape({
  referenceId: Yup.string(),
});

type Props = {
  referenceId: string;
  skip: number;
  take: number;
};

const CancelOrderComponents = (props: Props) => {
  const utils = api.useUtils();

  const { mutateAsync: cancelInvoice } = api.paypal.cancelCheckout.useMutation({
    onSuccess: async () => {
      await utils.order.getAll.invalidate({
        skip: props.skip,
        take: props.take,
      });

      await utils.cart.getAll.invalidate();

      await utils.cart.counter.invalidate();

      toast.success("Successfully cancelled");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { isSubmitting, values, handleSubmit } = useFormik({
    enableReinitialize: true,

    initialValues: {
      referenceId: props.referenceId,
    },

    validationSchema: Schema,

    onSubmit: async () => {
      await cancelInvoice({
        orderId: values.referenceId,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // ✅ REQUIRED
        e.stopPropagation(); // ✅ CRITICAL
        handleSubmit(e);
      }}
    >
      <button
        onClick={(e) => e.stopPropagation()} // ✅ ALSO REQUIRED
        disabled={isSubmitting}
        type="submit"
        className="flex h-8 min-w-[74px] cursor-pointer items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.08] px-3 text-[10px] font-semibold whitespace-nowrap text-red-400 transition-all hover:border-red-500/25 hover:bg-red-500/[0.14] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50 lg:min-w-[92px]"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-1.5">
            <LoaderIcon className="h-3.5 w-3.5 animate-spin" />
            <span className="hidden lg:inline">Cancelling</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <X className="hidden h-3.5 w-3.5 lg:flex" />
            Cancel
          </span>
        )}
      </button>
    </form>
  );
};

export default CancelOrderComponents;
