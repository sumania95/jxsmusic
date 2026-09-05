"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Share2 } from "lucide-react";
import { FaTwitter } from "react-icons/fa6";

type SharePopoverProps = {
  url?: string;
};

export default function SharePopover({
  url,
}: SharePopoverProps) {
  const [copied, setCopied] =
    useState(false);

  const shareUrl =
    url ??
    (
      typeof window !== "undefined"
        ? window.location.href
        : ""
    );


  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      shareUrl
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      2000
    );
  };


  const socials = [
    {
      name: "Facebook",
      href:
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`,
      className:
        "hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-current"
        >
          <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692V11.01h3.128V8.309c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
        </svg>
      ),
    },
    {
      name: "X",
      href:
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}`,
      className:
        "hover:border-white/20 hover:bg-white/[0.06] hover:text-white",
      icon: (
        <FaTwitter className="h-4 w-4" />
      ),
    },
    {
      name: "WhatsApp",
      href:
        `https://wa.me/?text=${encodeURIComponent(
          shareUrl
        )}`,
      className:
        "hover:border-[#25D366]/40 hover:bg-[#25D366]/10 hover:text-[#25D366]",
      icon: (
        <svg
          viewBox="0 0 32 32"
          className="h-4 w-4 fill-current"
        >
          <path d="M16.003 3C9.384 3 4 8.383 4 15c0 2.63.86 5.065 2.31 7.03L4 29l7.2-2.26A11.93 11.93 0 0 0 16.003 27C22.62 27 28 21.617 28 15S22.62 3 16.003 3zm6.41 17.2c-.27.77-1.58 1.47-2.18 1.53-.57.06-1.29.09-2.08-.13-.48-.15-1.1-.36-1.9-.7-3.34-1.44-5.52-4.82-5.68-5.04-.16-.23-1.36-1.82-1.36-3.47s.86-2.47 1.17-2.8c.31-.33.68-.41.91-.41.23 0 .46 0 .66.01.21.01.49-.08.77.58.27.66.93 2.3 1.01 2.47.08.17.13.38.02.61-.11.23-.17.38-.33.58-.17.2-.36.45-.52.6-.17.17-.35.36-.15.71.2.35.9 1.48 1.93 2.4 1.33 1.18 2.46 1.55 2.82 1.72.36.17.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.8-.18.33.11 2.09.99 2.45 1.17.36.18.6.27.69.42.09.15.09.88-.18 1.65z" />
        </svg>
      ),
    },
  ];


  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Share"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            cursor-pointer
            rounded-lg
            lg:rounded-xl
            text-zinc-400
            transition-all
            duration-200
            hover:bg-[#B9FF00]/[0.06]
            hover:text-[#B9FF00]
          "
        >
          <Share2 className="h-4 w-4" />
        </button>
      </PopoverTrigger>


      <PopoverContent
        align="end"
        className="
          relative
          w-80
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-zinc-950
          p-0
          text-zinc-200
          shadow-[0_25px_70px_rgba(0,0,0,0.6)]
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-80px]
            top-[-100px]
            h-48
            w-48
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[70px]
          "
        />


        {/* Header */}
        <div
          className="
            relative
            border-b
            border-white/[0.06]
            px-4
            py-4
          "
        >
          <div className="flex items-center gap-2">
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
              Jeff92 & Ayan Sumania Share
            </span>
          </div>

          <h4
            className="
              mt-2
              text-sm
              font-semibold
              text-zinc-200
            "
          >
            Share this song
          </h4>

          <p
            className="
              mt-1
              text-[10px]
              text-zinc-600
            "
          >
            Copy the link or share directly.
          </p>
        </div>


        <div
          className="
            relative
            space-y-4
            p-4
          "
        >
          {/* =================================================
              COPY LINK
          ================================================= */}
          <div>
            <p
              className="
                mb-1.5
                text-[9px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-zinc-600
              "
            >
              Share Link
            </p>

            <div className="flex gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="
                  h-10
                  min-w-0
                  flex-1
                  rounded-xl
                  border-white/[0.08]
                  bg-white/[0.025]
                  selection:bg-yellow-100
                selection:text-black
                  text-[10px]
                  text-zinc-400
                  shadow-none
                  focus-visible:border-[#B9FF00]/20
                  focus-visible:ring-[#B9FF00]/10
                "
              />

              <Button
                type="button"
                size="icon"
                onClick={handleCopy}
                className={`
                  h-10
                  w-10
                  shrink-0
                  rounded-xl
                  border
                  shadow-none
                  transition-all

                  ${
                    copied
                      ? `
                          border-green-500/20
                          bg-green-500/[0.08]
                          text-green-400
                          hover:bg-green-500/[0.08]
                        `
                      : `
                          border-[#B9FF00]/15
                          bg-[#B9FF00]/[0.06]
                          text-[#B9FF00]
                          hover:bg-[#B9FF00]
                          hover:text-black
                        `
                  }
                `}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {copied && (
              <p
                className="
                  mt-2
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.1em]
                  text-green-400
                "
              >
                Link copied
              </p>
            )}
          </div>


          {/* =================================================
              SOCIALS
          ================================================= */}
          <div>
            <p
              className="
                mb-1.5
                text-[9px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-zinc-600
              "
            >
              Share Via
            </p>

            <div className="grid grid-cols-3 gap-2">
              {socials.map(
                (social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      min-w-0
                    "
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      className={`
                        flex
                        h-10
                        w-full
                        items-center
                        justify-center
                        gap-1.5
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-white/[0.02]
                        px-2
                        text-[9px]
                        font-medium
                        text-zinc-500
                        shadow-none
                        transition-all
                        ${social.className}
                      `}
                    >
                      {social.icon}

                      <span className="truncate">
                        {social.name}
                      </span>
                    </Button>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}