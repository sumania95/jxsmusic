import React, { useState } from 'react'
import Dropzone from 'react-dropzone';
import path from 'path';
import { api } from '@/utils/api';
import axios from 'axios';
import { UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { isVideoUploaderAtom } from '@/state/userRoleAtoms';
import { useAtom } from 'jotai';


const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_VIDEO_SIZE = 400 * 1024 * 1024; // 400 MB
const MAX_FILES = 30;

const DropzoneTrackComponent = () => {
  const [isVideoUploader] = useAtom(isVideoUploaderAtom)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const utils = api.useUtils()
  const {mutateAsync:putObject} = api.signedUrl.putObject.useMutation({
    onError:(err)=>{
      toast.error(err.message)
      setLoading(false)
    }
  })
  const {mutateAsync:updateTrack} = api.track.create.useMutation({
    onSuccess:async()=>{
      await utils.track.getAllUploaded.invalidate()
      setLoading(false)
    },
    onError:(err)=>{
      toast.error(err.message)
      setLoading(false)
    }
  })
  return (
    <>
      <Dropzone
      multiple={true}
      maxFiles={MAX_FILES}
      maxSize={isVideoUploader ? MAX_VIDEO_SIZE : MAX_AUDIO_SIZE}
      accept={
        isVideoUploader
          ? {
              "audio/mpeg": [".mp3", ".MP3"],
              "video/mp4": [".mp4", ".MP4"],
            }
          : {
              "audio/mpeg": [".mp3", ".MP3"],
            }
      }
      onError={()=>{
        console.log('error')
      }}
      onDropRejected={(fileRejections) => {
        for (const rejection of fileRejections) {
          const { file, errors } = rejection;

          for (const error of errors) {
            if (error.code === "file-too-large") {
              toast.error(
                `"${file.name}" is too large. Max size is ${
                  isVideoUploader ?  `${MAX_VIDEO_SIZE}MB` : `${MAX_AUDIO_SIZE}MB`
                }.`
              );
            }

            if (error.code === "too-many-files") {
              toast.error(`You can upload up to ${MAX_FILES} files at once.`);
            }

            if (error.code === "file-invalid-type") {
              toast.error(`"${file.name}" has an invalid file type.`);
            }
          }
        }
      }}
      onDrop={async(acceptedFiles) => {

        // Validate all files BEFORE running upload loop
        for (const file of acceptedFiles) {

          const original = file.name;

          // Must end with .mp3 or .MP3
          // 1️⃣ Extension validation
          const extRegex = /\.(mp3|mp4)$/i;
          const extMatch = extRegex.exec(original);
          if (!extMatch) {
            toast.error(`Invalid file: "${original}". Only .mp3 or .mp4 allowed.`);
            return;
          }

          const extension = extMatch[1]?.toLowerCase();

          if (extension === "mp4" && !isVideoUploader) {
            toast.error("MP4 uploads are only allowed for video editor.");
            return;
          }

          // Remove extension
          let base = original.replace(/\.(mp3|mp4)$/i, "");

          // Trim outside spaces
          base = base.trim();

          // Normalize multiple spaces inside
          base = base.replace(/\s+/g, " ");

          // Must end with [CLEAN] or [DIRTY]
          const regex = /\[(CLEAN|DIRTY)\]$/i;
          const tagMatch = regex.exec(base);
          if (!tagMatch) {
            toast.error(
              `Invalid filename: "${original}". Must end with [CLEAN] or [DIRTY].`
            );
            return;
          }

          // Normalize the tag uppercase
          const tag = tagMatch[0].toUpperCase();

          // Remove tag to clean inside name
          const nameWithoutTag = base.replace(/\[(CLEAN|DIRTY)\]$/i, "").trim();

          // Rebuild consistent filename
          const finalName = `${nameWithoutTag} ${tag}.${extension}`;

          // Replace the filename (does not modify file buffer)
          Object.defineProperty(file, "name", { value: finalName });

          console.log("FINAL CLEANED NAME →", file.name);
        }

        // ---- YOUR ORIGINAL CODE FROM HERE DOWN ----

        const promises: Promise<void>[] = acceptedFiles.map(async(file) => {
          setLoading(true);
          const id = crypto.randomUUID();
          const size = file.size

          const extRegex = /\.(mp3|mp4)$/i;
          const extMatch = extRegex.exec(file.name);
          if (!extMatch) {
            toast.error(`Invalid file: "${file.name}". Only .mp3 or .mp4 allowed.`);
            return;
          }
          const extension = extMatch[1]?.toLowerCase();
          const isVideo = extension === "mp4";

          const keyPrefix = isVideo ? "jxs/video/download" : "jxs/download";
          const key = `${keyPrefix}/${id}.${extension}`;

          const upload = await putObject({
            key,
            type: String(file.type),
          });
          console.log(upload)
          try {
            await axios.put(upload.url, file,{
              onUploadProgress: ({ loaded, total }) => {
                  setLoading(true);
                  setProgress(Math.floor((loaded * 100) / (total ?? 1)));
              }
            }).then(async()=>{
                await updateTrack({
                  bucketName:upload.bucket,
                  key:upload.key,
                  size:size,
                  fileType:file.type,
                  fileName:file.name,   // << now uses cleaned filename
                  id:file.name,   // << now uses cleaned filename
                })
            }).catch(() =>{
              toast.error(`Error uploading`)
            })
            
          } catch (error) {
            console.log(error)
            toast.error("Connection Error Lost")
          }
        })

        const results = await Promise.all(promises);
        console.log('All data fetched successfully:', results);
      }}
    >
      {({getRootProps, getInputProps}) => (
          <div className=' h-40 w-full my-5 border dark:border-zinc-700'>
            {loading?
            <div className='relative  h-40 w-full flex items-center justify-start'>
              <div className={`absolute bg-purple-700/5 flex items-center justify-center h-full w-full px-5`} >
                <h3 className='dakr:text-zinc-100'>{progress>0?`${progress}%`:''}</h3>
              </div>
            </div>
            :
            <div {...getRootProps()} className=' h-40 w-full flex items-center justify-center bg-zinc-700/5 hover:bg-zinc-700/20 dark:bg-cyan-700/5 dark:hover:bg-cyan-600/10  cursor-pointer'>
              <input {...getInputProps()} 
              accept={
                isVideoUploader
                  ? ".mp3,.MP3,.mp4,.MP4"
                  : ".mp3,.MP3"
              }  
              className=' h-20 w-full flex flex-col items-center justify-center'/>
              <div className='flex flex-col w-full items-center justify-center'>
                  <p className=' font-bold uppercase text-center'></p>
                  <UploadIcon className='w-10 h-10'/>
                  <p className=' font-bold uppercase text-center dark:text-zinc-200'>{`Drag & drop some files here`}</p>
              </div>
            </div>
            }
          </div>
      )}
    </Dropzone>

    </>
  )
}

export default DropzoneTrackComponent