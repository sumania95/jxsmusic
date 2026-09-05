import React from "react"
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaSpotify,
  FaSoundcloud,
  FaMixcloud,
  FaTwitch,
} from "react-icons/fa"
import Link from "next/link"

interface Props {
  editor: {
    id: string
    image: string | null
    username: string | null
    link_facebook: string | null
    link_instagram: string | null
    link_mixclound: string | null
    link_soundcloud: string | null
    link_spotify: string | null
    link_twitch: string | null
    link_twitter: string | null
    link_youtube: string | null
    biography: string | null
    _count: {
      track: number
    }
  }
}

const socialLinks = [
  { key: "link_facebook", icon: FaFacebookF, label: "Facebook" },
  { key: "link_instagram", icon: FaInstagram, label: "Instagram" },
  { key: "link_twitter", icon: FaTwitter, label: "Twitter" },
  { key: "link_youtube", icon: FaYoutube, label: "YouTube" },
  { key: "link_soundcloud", icon: FaSoundcloud, label: "SoundCloud" },
  { key: "link_spotify", icon: FaSpotify, label: "Spotify" },
  { key: "link_mixclound", icon: FaMixcloud, label: "Mixcloud" },
  { key: "link_twitch", icon: FaTwitch, label: "Twitch" },
]

const BioInfoComponent = ({ editor }: Props) => {
  const hasBiography = Boolean(editor.biography?.trim())

  const availableSocialLinks = socialLinks.filter(({ key }) => {
    const url = editor[key as keyof typeof editor] as string | null
    return Boolean(url)
  })

  return (
    <div className="w-full">
      {/* =====================================================
          BIOGRAPHY
      ===================================================== */}
      <section
        className="
          relative
          overflow-hidden
          rounded-xl
          border
          border-white/10
          bg-white/[0.02]
          p-5
          sm:p-6
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-[-120px]
            h-64
            w-64
            rounded-full
            bg-[#B9FF00]/[0.025]
            blur-[80px]
          "
        />

        <div className="relative">
          {/* Section heading */}
          <div className="mb-4 flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#B9FF00]
                shadow-[0_0_8px_rgba(185,255,0,0.7)]
              "
            />

            <h3
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Biography
            </h3>
          </div>

          {/* Biography content */}
          {hasBiography ? (
            <p
              className="
                max-w-3xl
                whitespace-pre-line
                text-sm
                leading-7
                text-zinc-400
              "
            >
              {editor.biography}
            </p>
          ) : (
            <div
              className="
                rounded-lg
                border
                border-white/5
                bg-[#111518]/20
                px-4
                py-6
                text-center
              "
            >
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-widest
                  text-zinc-700
                "
              >
                No biography available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          SOCIAL LINKS
      ===================================================== */}
      {availableSocialLinks.length > 0 && (
        <section
          className="
            mt-3
            rounded-xl
            border
            border-white/10
            bg-white/[0.02]
            p-5
            sm:p-6
          "
        >
          <div className="mb-4 flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#B9FF00]
                shadow-[0_0_8px_rgba(185,255,0,0.7)]
              "
            />

            <h3
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Connect
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableSocialLinks.map(
              ({ key, icon: Icon, label }) => {
                const url = editor[
                  key as keyof typeof editor
                ] as string | null

                if (!url) return null

                return (
                  <Link
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="
                      group
                      flex
                      h-10
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-white/10
                      bg-[#111518]/30
                      px-3
                      text-zinc-600
                      transition-all
                      duration-200
                      hover:border-[#B9FF00]/20
                      hover:bg-[#B9FF00]/[0.04]
                      hover:text-[#B9FF00]
                    "
                  >
                    <Icon
                      size={15}
                      className="
                        transition-transform
                        duration-200
                        group-hover:scale-110
                      "
                    />

                    <span
                      className="
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-wider
                      "
                    >
                      {label}
                    </span>
                  </Link>
                )
              }
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          EMPTY SOCIAL STATE
      ===================================================== */}
      {availableSocialLinks.length === 0 && (
        <section
          className="
            mt-3
            rounded-xl
            border
            border-white/10
            bg-white/[0.02]
            p-5
          "
        >
          <div className="flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-zinc-700
              "
            />

            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-widest
                text-zinc-700
              "
            >
              No social links available
            </span>
          </div>
        </section>
      )}
    </div>
  )
}

export default BioInfoComponent