import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import path from 'path'
import { api } from '@/utils/api'
import axios from 'axios'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

const DropzoneImageComponent = () => {
  const { data: session, update } = useSession()
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  const utils = api.useUtils()

  const { mutateAsync: putObject } =
    api.signedUrl.putObjectImage.useMutation({
      onError: (err) => {
        toast.error(err.message)
        setLoading(false)
      },
    })

  const { mutateAsync: imageSave } =
    api.image.saveImageAWS.useMutation({
      onSuccess: async (user) => {
        await utils.track.getAllUploaded.invalidate()
        await update({ image: user.image })
        setLoading(false)
      },
      onError: (err) => {
        toast.error(err.message)
        setLoading(false)
      },
    })

  return (
    <Dropzone
      multiple={false}
      noDrag
      accept={{
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      }} // ✅ image only
      onDrop={async (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (!file) return

        setLoading(true)

        const ext = path.extname(file.name)

        // optional safety check
        if (!file.type.startsWith("image/")) {
          toast.error("Only image files are allowed")
          setLoading(false)
          return
        }

        const upload = await putObject({
          ext, // e.g. .jpg, .png
        })

        try {
          await axios.put(upload.url, file, {
            headers: {
              "Content-Type": file.type, // ✅ important for images
            },
            onUploadProgress: ({ loaded, total }) => {
              if (!total) return
              setProgress(Math.floor((loaded * 100) / total))
            },
          })

          await imageSave({
            imageKey: upload.key,
          })

        } catch (err) {
          console.error(err)
          toast.error("Upload failed")
          setLoading(false)
        }
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div className="h-10 w-full my-5">
          {loading ? (
            <div className="relative h-10 w-full">
              <div className="absolute inset-0 bg-red-600 flex items-center justify-center">
                <span className="text-white text-xs">
                  {progress > 0 ? `${progress}%` : ''}
                </span>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className="h-10 w-full flex items-center justify-center bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-xs text-white">
                Upload Image (1080×1080 pixel)
              </p>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  )
}

export default DropzoneImageComponent
