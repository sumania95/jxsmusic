"use client";

import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/utils/api";

export function UpdatePreviewKeyButton() {
  const utils = api.useUtils();

  const {
    data: count,
    isLoading,
  } =
    api.adminTrack.countNoPreviewKey.useQuery();

  const updatePreviewKey =
    api.adminTrack.updatePreviewKey.useMutation({
      onSuccess: async (data) => {
        await utils.adminTrack.countNoPreviewKey.invalidate();

        toast.success(
          `Preview keys updated: ${data.updated}`
        );
      },

      onError(error) {
        toast.error(
          error.message ||
            "Failed to update preview keys"
        );
      },
    });

  const missingCount =
    count?.count._count.id ?? 0;

  const isUpdating =
    updatePreviewKey.isPending;

  const disabled =
    isUpdating ||
    isLoading ||
    missingCount === 0;

  return (
    <div className="flex items-center">
      <Button
        type="button"
        disabled={disabled}
        onClick={() =>
          updatePreviewKey.mutate()
        }
        className={`
          h-10
          rounded-xl
          border
          px-3
          text-xs
          font-medium
          transition-all

          ${
            missingCount > 0
              ? `
                border-[#B9FF00]/20
                bg-[#B9FF00]
                text-black
                hover:bg-[#B9FF00]
              `
              : `
                border-white/[0.06]
                bg-white/[0.025]
                text-zinc-500
              `
          }

          disabled:cursor-not-allowed
          disabled:opacity-60
        `}
      >
        {isUpdating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />

            Updating Preview Keys...
          </>
        ) : missingCount === 0 ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" />

            Preview Keys Complete
          </>
        ) : (
          <>
            <RefreshCcw className="mr-2 h-4 w-4" />

            Generate Preview Keys

            <span
              className="
                ml-2
                flex
                min-w-5
                items-center
                justify-center
                rounded-full
                bg-[#111518]/10
                px-1.5
                py-0.5
                text-[9px]
                font-semibold
              "
            >
              {missingCount}
            </span>
          </>
        )}
      </Button>
    </div>
  );
}