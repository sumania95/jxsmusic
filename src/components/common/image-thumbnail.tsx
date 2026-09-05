import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  image?: string | null;
  className?: string;
  rounded?: boolean;
};

const ImageThumbnailComponent = ({
  image,
  className,
  rounded = true,
}: Props) => {
  const shapeClass = rounded
    ? "rounded-full"
    : "rounded-none";

  return (
    <Avatar
      className={cn(
        "h-full w-full border border-zinc-700",
        shapeClass,
        className,
      )}
    >
      <AvatarImage
        src={"/images/track-logo.png"}
        className={cn(
          "h-full w-full bg-white object-cover",
          // shapeClass,
        )}
      />

      <AvatarFallback
        className={cn(
          "flex h-full w-full items-center justify-center bg-zinc-900",
          shapeClass,
        )}
      >
        <Image
          src="/images/jeff92-ayan-brand-mark.svg"
          alt="Logo"
          width={1080}
          height={1080}
          className={cn(
            "h-full w-full object-contain",
            shapeClass,
          )}
        />
      </AvatarFallback>
    </Avatar>
  );
};

export default ImageThumbnailComponent;