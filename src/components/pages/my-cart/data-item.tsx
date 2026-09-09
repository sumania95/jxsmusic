import React from "react";
import { LoaderIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageThumbnailComponent from "@/components/common/image-thumbnail";
import DownloadTrackComponent from "@/components/common/download";

type Props = {
  subscriptionActive?: boolean;
  index_key: number;
  id: string;
  album: {
    id: string;
    price: number;
    name: string | null;
    artist: string | null;
    image: string | null;
    user: {
      image: string | null;
    };
  } | null;
  track: {
    id: string;
    price: number;
    title: string | null;
    artist: string | null;
    is_explicit:boolean
    user: {
      image: string | null;
    };
  } | null;
};

const CartTrackItemComponent = (props: Props) => {
  console.log(props);

  return (
    <div className="flex w-full items-center gap-3 px-3 py-3 text-zinc-300 sm:px-4">
      {/* INDEX */}
      <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.025] text-[10px] font-semibold text-zinc-600 tabular-nums lg:flex">
        {props.subscriptionActive && props.track && (
          <DownloadTrackComponent id={props.track.id} />
        )}
        {props.index_key + 1}
      </div>

      {/* THUMBNAIL */}
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/[0.06] bg-zinc-950">
        <ImageThumbnailComponent
          image={String(props.track?.user.image ?? props.album?.image)}
          rounded={false}
        />
      </div>

      {/* TRACK / ALBUM INFO */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-zinc-200">
          {props.track?.title ?? props.album?.name} {props.track?`${props.track.is_explicit?"Dirty":"Clean"}`:""}
        </h3>

        <h3 className="mt-0.5 truncate text-[11px] text-zinc-600">
          {props.track?.artist ?? props.album?.artist}
        </h3>

        {/* MOBILE PRICE */}
        <div className="mt-1 flex items-center gap-2 md:hidden">
          <span className="text-xs font-semibold text-[#B9FF00] tabular-nums">
            {props.track?.price === 0
              ? "FREE"
              : (Number(
                  Number(props.track?.price ?? props.album?.price) / 100,
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }) ?? 0)}
          </span>
        </div>
      </div>

      {/* PRICE + REMOVE */}
      <div className="flex shrink-0 items-center gap-2">
        {/* DESKTOP PRICE */}
        <div className="hidden min-w-[90px] text-right text-sm font-semibold text-zinc-300 tabular-nums md:block">
          {props.track?.price === 0
            ? "FREE"
            : (Number(
                Number(props.track?.price ?? props.album?.price) / 100,
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }) ?? 0)}
        </div>

        <RemoveComponent
          id={props.id}
          trackId={String(props.track?.id ?? props.album?.id)}
        />
      </div>
    </div>
  );
};

export default CartTrackItemComponent;

export const Schema = Yup.object().shape({
  id: Yup.string(),
});

type RemoveProps = {
  id: string;
  trackId: string;
};

const RemoveComponent = (props: RemoveProps) => {
  const utils = api.useUtils();

  const { data: session } = useSession();

  const router = useRouter();

  const { mutateAsync: removeCart } = api.cart.remove.useMutation({
    onSuccess: async () => {
      await utils.cart.getAll.invalidate();

      await utils.cart.counter.invalidate();

      toast.success("Successfully removed");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { isSubmitting, handleSubmit } = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: props.id,
    },

    validationSchema: Schema,

    onSubmit: async () => {
      if (session?.user.id) {
        await removeCart({
          id: props.id,
        });
      } else {
        await router.push("/auth/login");
      }
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        {isSubmitting ? (
          <div className="flex h-9 w-9 items-center justify-center">
            <LoaderIcon className="h-4 w-4 animate-spin text-zinc-500" />
          </div>
        ) : (
          <Button
            disabled={isSubmitting}
            type="submit"
            variant={"default"}
            className="h-9 w-9 cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-0 text-zinc-600 shadow-none transition-all hover:border-red-500/20 hover:bg-red-500/[0.08] hover:text-red-400 focus:bg-red-500/[0.08]"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        )}
      </form>
    </>
  );
};
