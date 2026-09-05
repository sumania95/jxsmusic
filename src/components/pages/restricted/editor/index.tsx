import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Upload,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";
import { FaFacebook } from "react-icons/fa6";

export default function UploaderGuideDashboard() {
  return (
    <div className="grid w-full gap-4 pt-5 text-zinc-300">
      {/* =====================================================
          FACEBOOK GROUP
      ===================================================== */}
      <div
        className="
          group
          relative
          flex
          w-full
          flex-col
          items-center
          justify-between
          gap-4
          overflow-hidden
          rounded-xl
          border
          border-white/5
          bg-white/[0.015]
          p-4
          transition-all
          duration-200
          hover:border-white/[0.08]
          hover:bg-white/[0.025]
          sm:flex-row
        "
      >
        <div
          className="
            absolute
            left-0
            top-1/2
            h-8
            w-0.5
            -translate-y-1/2
            rounded-full
            bg-[#B9FF00]
            opacity-0
            transition-opacity
            group-hover:opacity-100
          "
        />

        <div className="flex items-center gap-3">
          <FaFacebook className="h-8 w-8 text-blue-400" />

          <div>
            <h3 className="text-sm font-semibold text-white">
              Join the Jeff92 & Ayan Sumania Philippines (Remix Editors Group)
            </h3>

            <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-600">
              Get updates, exclusive edits, and DJ discussions
            </p>
          </div>
        </div>

        <a
          href="https://www.facebook.com/share/g/1a5CQ72cru/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            justify-center
            rounded-lg
            border
            border-blue-400/20
            bg-blue-500/[0.08]
            px-4
            py-2
            text-[10px]
            font-medium
            uppercase
            tracking-wider
            text-blue-400
            transition-all
            duration-200
            hover:border-blue-400/30
            hover:bg-blue-500/[0.15]
            hover:text-blue-300
          "
        >
          Join Facebook Group
        </a>
      </div>

      {/* =====================================================
          DEMO VIDEO
      ===================================================== */}
      <div className="flex w-full flex-col items-center justify-center gap-4">
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

          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Please Watch The Demo Video
          </h3>
        </div>

        <div
          className="
            w-full
            max-w-4xl
            overflow-hidden
            rounded-xl
            border
            border-white/10
            bg-[#111518]
            shadow-[0_0_30px_rgba(0,0,0,0.3)]
          "
        >
          <video
            controls
            playsInline
            className="block w-full"
            src="https://0x84kengln.ufs.sh/f/KieKmjSQ0oPZ2RCjpL7H4cAMOtvi50n36La1YdywGprCJoxS"
          />
        </div>
      </div>

      {/* =====================================================
          SALES & REVENUE
      ===================================================== */}
      <Card
        className="
          rounded-xl
          border-white/5
          bg-white/[0.015]
          shadow-none
          transition-colors
          hover:border-white/[0.08]
        "
      >
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-white">
            <DollarSign className="h-4 w-4 text-[#B9FF00]" />
            Sales & Revenue Sharing
          </CardTitle>

          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
            How revenue is distributed
          </p>
        </CardHeader>

        <CardContent className="space-y-3 pt-4 text-xs text-zinc-400">
          <p className="flex items-center gap-2">
            <Badge
              className="
                border-green-400/10
                bg-green-400/[0.06]
                text-[9px]
                font-medium
                text-green-400
                hover:bg-green-400/[0.06]
              "
            >
              50%
            </Badge>

            <span>
              Net Income goes to the uploader
            </span>
          </p>

          <p className="flex items-start gap-2">
            <Badge
              className="
                border-white/10
                bg-white/[0.04]
                text-[9px]
                font-medium
                text-zinc-400
                hover:bg-white/[0.04]
              "
            >
              50%
            </Badge>

            <span>
              Platform Fee — includes transaction fees, website
              maintenance, storage fees, and other operational costs
            </span>
          </p>
        </CardContent>
      </Card>

      {/* =====================================================
          UPLOAD GUIDELINES
      ===================================================== */}
      <Card
        className="
          rounded-xl
          border-white/5
          bg-white/[0.015]
          shadow-none
          transition-colors
          hover:border-white/[0.08]
        "
      >
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-white">
            <Upload className="h-4 w-4 text-[#B9FF00]" />
            Track Upload Guidelines
          </CardTitle>

          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
            Requirements before uploading
          </p>
        </CardHeader>

        <CardContent className="space-y-5 pt-4 text-xs text-zinc-400">
          {/* 1 */}
          <div className="space-y-3">
            <Image
              src="/guide/guide-picture.png"
              alt="Guide Picture"
              width={500}
              height={500}
              className="
                h-64
                w-full
                rounded-xl
                border
                border-white/10
                object-cover
                lg:h-96
                lg:w-1/2
              "
            />

            <p className="text-xs font-semibold text-zinc-200">
              1. Filename Requirement (Optional)
            </p>

            <p>
              Track filenames must end with{" "}
              <Badge
                className="
                  border-[#B9FF00]/10
                  bg-[#B9FF00]/[0.06]
                  text-[9px]
                  text-[#B9FF00]
                  hover:bg-[#B9FF00]/[0.06]
                "
              >
                [CLEAN]
              </Badge>{" "}
              or{" "}
              <Badge
                className="
                  border-[#B9FF00]/10
                  bg-[#B9FF00]/[0.06]
                  text-[9px]
                  text-[#B9FF00]
                  hover:bg-[#B9FF00]/[0.06]
                "
              >
                [DIRTY]
              </Badge>
              .
            </p>
          </div>

          <Separator className="bg-white/5" />

          {/* 2 */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-200">
              2. MP3 Tagging (Highly Recommended)
            </p>

            <p>
              Please complete MP3 tags for easy auto-population of the
              update form:
            </p>

            <ul className="list-disc space-y-1 pl-5 text-zinc-500">
              <li>Title</li>
              <li>Artist</li>
              <li>Year</li>
              <li>Key</li>
              <li>Genre (tags in comments)</li>
            </ul>

            <p className="mt-3">
              Recommended tools:{" "}
              <Badge
                className="
                  border-white/10
                  bg-white/[0.04]
                  text-[9px]
                  text-zinc-300
                  hover:bg-white/[0.04]
                "
              >
                MP3Tag
              </Badge>{" "}
              and{" "}
              <Badge
                className="
                  border-white/10
                  bg-white/[0.04]
                  text-[9px]
                  text-zinc-300
                  hover:bg-white/[0.04]
                "
              >
                Mixed In Key
              </Badge>{" "}
              for key analysis.
            </p>
          </div>

          <Separator className="bg-white/5" />

          {/* 3 */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-200">
              3. Track Preview
            </p>

            <p>
              No need to edit preview files manually. Our system
              automatically creates previews.
            </p>

            <p>
              You can select preview length:{" "}
              <Badge
                className="
                  border-white/10
                  bg-white/[0.04]
                  text-[9px]
                  text-zinc-300
                  hover:bg-white/[0.04]
                "
              >
                60s
              </Badge>
              ,{" "}
              <Badge
                className="
                  border-white/10
                  bg-white/[0.04]
                  text-[9px]
                  text-zinc-300
                  hover:bg-white/[0.04]
                "
              >
                90s
              </Badge>{" "}
              or{" "}
              <Badge
                className="
                  border-white/10
                  bg-white/[0.04]
                  text-[9px]
                  text-zinc-300
                  hover:bg-white/[0.04]
                "
              >
                120s
              </Badge>
              , and drag to choose the specific section of the track.
            </p>
          </div>

          <Separator className="bg-white/5" />

          {/* 4 */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-200">
              4. Spotify Track Composition
            </p>

            <p>
              If your upload is{" "}
              <strong className="text-zinc-200">
                not an original remix
              </strong>
              , please add the Spotify track composition for proper
              attribution.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          SUPPORT
      ===================================================== */}
      <Card
        className="
          rounded-xl
          border-white/5
          bg-white/[0.015]
          shadow-none
          transition-colors
          hover:border-white/[0.08]
        "
      >
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-white">
            <HelpCircle className="h-4 w-4 text-[#B9FF00]" />
            Support
          </CardTitle>

          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
            Need help?
          </p>
        </CardHeader>

        <CardContent className="pt-4 text-xs text-zinc-400">
          <p>
            If you have questions about uploads, edits, or payments,
            feel free to message us on{" "}
            <Badge
              className="
                mx-1
                border-blue-400/10
                bg-blue-400/[0.06]
                text-[9px]
                text-blue-400
                hover:bg-blue-400/[0.06]
              "
            >
              Facebook
            </Badge>{" "}
            or email us at{" "}
            <Badge
              className="
                ml-1
                border-white/10
                bg-white/[0.04]
                text-[9px]
                text-zinc-300
                hover:bg-white/[0.04]
              "
            >
              sample@sample.com
            </Badge>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
