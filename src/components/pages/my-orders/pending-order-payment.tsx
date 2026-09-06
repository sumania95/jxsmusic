import { useState } from "react";
import { CreditCard, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { PayPalCheckoutButton } from "@/components/common/paypal-checkout-button";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  referenceId: string;
};

export default function PendingOrderPayment({ referenceId }: Props) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const resume = api.paypal.resumeCheckout.useMutation();
  const capture = api.paypal.captureCheckout.useMutation();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="h-9 w-auto gap-2 rounded-xl bg-[#B9FF00] text-xs font-semibold text-black hover:bg-[#B9FF00]/90">
          <CreditCard className="h-4 w-4" />
          Pay Now
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-white/10 bg-[#171d20] text-[#F5F3EA] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Complete payment</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-500">
            Choose PayPal or an eligible debit/credit card. Your order stays
            pending if you close this dialog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="min-h-20 py-2">
          <PayPalCheckoutButton
            createOrder={async () => {
              const result = await resume.mutateAsync({ referenceId });
              return result.orderId;
            }}
            captureOrder={async (orderId) => {
              await capture.mutateAsync({ orderId });
            }}
            onSuccess={() => {
              setOpen(false);
              toast.success("Payment completed");
              void utils.order.getAll.invalidate();
            }}
            onCancel={() =>
              toast.info("Payment cancelled. The order remains pending.")
            }
            onError={(error) => {
              console.error(error);
              toast.error(
                error instanceof Error
                  ? error.message
                  : "PayPal checkout failed",
              );
            }}
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#111518] p-3 text-[11px] text-zinc-500">
          <LockKeyhole className="h-4 w-4 text-[#B9FF00]" />
          Payment details are handled securely by PayPal.
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.05]">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
