import React from 'react'
import BannerTitleComponent from '@/components/common/banner-title'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { ProfileMeta } from '@/components/common/metadata'
import { FaFacebookF } from 'react-icons/fa'
import {
  LoaderIcon,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react'
import { api } from '@/utils/api'


const ContactUsComponent = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebookF />,
      url: 'https://www.facebook.com/Jeff92xSumaniaAudioVideoRemixes/',
    },
    // {
    //   name: 'Twitter',
    //   icon: <FaTwitter />,
    //   url: 'https://twitter.com/',
    // },
    // {
    //   name: 'Instagram',
    //   icon: <FaInstagram />,
    //   url: 'https://www.instagram.com/djjeff92/',
    // },
    // {
    //   name: 'YouTube',
    //   icon: <FaYoutube />,
    //   url: 'https://www.youtube.com/@DJJeff92_Official',
    // },
  ]

  const { mutateAsync: contactSubmit } = api.contact.send.useMutation({
    onSuccess: () => {
      toast.success('Message sent successfully!')
    },
    onError: (e) => {
      toast.success(e.message)
    },
    onSettled: () => {
      formik.resetForm()
    }
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },

    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
      subject: Yup.string().required('Subject is required'),
      message: Yup.string().required('Message is required'),
    }),

    onSubmit: async (values) => {
      await contactSubmit(values)
    },
  })

  return (
    <>
      <ProfileMeta
        title='Contact Us'
        description='Collection of DJ Music'
      />

      <div className="flex w-full flex-col gap-6">

        {/* =====================================================
            JEFF92 & AYAN SUMANIA HEADER
        ===================================================== */}
        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
            px-5
            py-8
            sm:px-8
            lg:px-10
          "
        >
          {/* Ambient glow */}
          <div
            className="
              pointer-events-none
              absolute
              right-[-120px]
              top-[-180px]
              h-[400px]
              w-[400px]
              rounded-full
              bg-[#B9FF00]/[0.035]
              blur-[100px]
            "
          />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#B9FF00]
                  shadow-[0_0_10px_rgba(185,255,0,0.7)]
                "
              />

              <span
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-zinc-600
                "
              >
                Jeff92 & Ayan Sumania Support
              </span>
            </div>

            <BannerTitleComponent
              title="Contact Us"
              description="We’d love to hear from you!"
            />
          </div>
        </section>

        {/* =====================================================
            CONTACT CONTENT
        ===================================================== */}
        <div
          className="
            grid
            w-full
            gap-5
            lg:grid-cols-[360px_minmax(0,1fr)]
          "
        >
          {/* =================================================
              CONTACT INFO
          ================================================= */}
          <section
            className="
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/[0.025]
            "
          >
            <div
              className="
                border-b
                border-white/[0.06]
                px-5
                py-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#B9FF00]/10
                    text-[#B9FF00]
                  "
                >
                  <MessageSquare className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">
                    Get in Touch
                  </h3>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      uppercase
                      tracking-[0.14em]
                      text-zinc-600
                    "
                  >
                    Contact Jeff92 & Ayan Sumania support
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4 sm:p-5">
              {/* EMAIL */}
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/[0.05]
                  bg-white/[0.015]
                  px-4
                  py-4
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#B9FF00]/[0.07]
                    text-[#B9FF00]
                  "
                >
                  <Mail className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.13em]
                      text-zinc-600
                    "
                  >
                    Email
                  </p>

                  <a
                    href="mailto:music@jeff92ayansumania.com"
                    className="
                      mt-1
                      block
                      truncate
                      text-sm
                      font-medium
                      text-zinc-300
                      transition-colors
                      hover:text-[#B9FF00]
                    "
                  >
                    music@jeff92ayansumania.com
                  </a>
                </div>
              </div>

              {/* PHONE */}
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/[0.05]
                  bg-white/[0.015]
                  px-4
                  py-4
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/[0.025]
                    text-zinc-500
                  "
                >
                  <Phone className="h-4 w-4" />
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.13em]
                      text-zinc-600
                    "
                  >
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    +639090912345
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/[0.05]
                  bg-white/[0.015]
                  px-4
                  py-4
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/[0.025]
                    text-zinc-500
                  "
                >
                  <MapPin className="h-4 w-4" />
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.13em]
                      text-zinc-600
                    "
                  >
                    Location
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    Philippines
                  </p>
                </div>
              </div>

              {/* SOCIAL */}
              <div
                className="
                  mt-2
                  border-t
                  border-white/[0.05]
                  pt-4
                "
              >
                <p
                  className="
                    mb-3
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    text-zinc-600
                  "
                >
                  Follow Jeff92 & Ayan Sumania
                </p>

                <div className="flex items-center gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-white/[0.02]
                        text-zinc-500
                        transition-all
                        hover:border-[#B9FF00]/20
                        hover:bg-[#B9FF00]/[0.07]
                        hover:text-[#B9FF00]
                      "
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              CONTACT FORM
          ================================================= */}
          <section
            className="
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/[0.025]
            "
          >
            <div
              className="
                border-b
                border-white/[0.06]
                px-5
                py-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#B9FF00]/10
                    text-[#B9FF00]
                  "
                >
                  <Send className="h-4 w-4" />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-100">
                    Your Information
                  </h4>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      uppercase
                      tracking-[0.14em]
                      text-zinc-600
                    "
                  >
                    Send a message to Jeff92 & Ayan Sumania
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              className="
                grid
                grid-cols-1
                gap-4
                p-4
                sm:p-5
                lg:grid-cols-2
              "
            >
              {/* NAME */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.13em]
                    text-zinc-600
                  "
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-3
                    text-sm
                    text-zinc-300
                    outline-none
                    transition-all
                    placeholder:text-zinc-700
                    focus:border-[#B9FF00]/30
                    focus:bg-white/[0.04]
                    disabled:opacity-50
                  "
                />

                {formik.touched.name && formik.errors.name && (
                  <p className="text-[10px] text-red-400">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.13em]
                    text-zinc-600
                  "
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-3
                    text-sm
                    text-zinc-300
                    outline-none
                    transition-all
                    placeholder:text-zinc-700
                    focus:border-[#B9FF00]/30
                    focus:bg-white/[0.04]
                    disabled:opacity-50
                  "
                />

                {formik.touched.email && formik.errors.email && (
                  <p className="text-[10px] text-red-400">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* SUBJECT */}
              <div className="flex flex-col gap-1.5 lg:col-span-2">
                <label
                  htmlFor="subject"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.13em]
                    text-zinc-600
                  "
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-3
                    text-sm
                    text-zinc-300
                    outline-none
                    transition-all
                    placeholder:text-zinc-700
                    focus:border-[#B9FF00]/30
                    focus:bg-white/[0.04]
                    disabled:opacity-50
                  "
                />

                {formik.touched.subject && formik.errors.subject && (
                  <p className="text-[10px] text-red-400">
                    {formik.errors.subject}
                  </p>
                )}
              </div>

              {/* MESSAGE */}
              <div className="flex flex-col gap-1.5 lg:col-span-2">
                <label
                  htmlFor="message"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.13em]
                    text-zinc-600
                  "
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className="
                    min-h-[150px]
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-3
                    py-3
                    text-sm
                    text-zinc-300
                    outline-none
                    transition-all
                    placeholder:text-zinc-700
                    focus:border-[#B9FF00]/30
                    focus:bg-white/[0.04]
                    disabled:opacity-50
                  "
                />

                {formik.touched.message && formik.errors.message && (
                  <p className="text-[10px] text-red-400">
                    {formik.errors.message}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="
                  lg:col-span-2
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#B9FF00]
                  px-5
                  text-xs
                  font-semibold
                  text-black
                  transition-all
                  hover:bg-[#B9FF00]
                  disabled:cursor-not-allowed
                  disabled:bg-[#B9FF00]/40
                  disabled:text-black/60
                "
              >
                {formik.isSubmitting && (
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                )}

                {formik.isSubmitting
                  ? 'Sending...'
                  : 'Send Message'
                }
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  )
}


export default ContactUsComponent
