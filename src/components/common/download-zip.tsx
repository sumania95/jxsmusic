// components/DownloadZipComponent.tsx
import React from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useAtom } from "jotai";
import { zipFilesAtom, updateZipFileAtom, updateZipProgressAtom, removeZipAtom } from "@/state/downloadAtoms";
import fileDownload from "js-file-download";
import JSZip from "jszip";
import axios from "axios";
import { runInBatches } from "@/utils/downloadZipBatch";
import { useRouter } from "next/router";
import { ImArrowDown } from "react-icons/im";
import { LoaderCircle } from "lucide-react";

interface Props {
    id: string; // releaseId
    fileName: string; // zip file name
    trackIds: string[]; // track IDs to download
    source:"track" | "pack" | undefined;
}

export const DownloadZipComponent = ({ id, fileName, trackIds,source }: Props) => {
    const { data: session } = useSession();
    const [zipFiles, setZipFiles] = useAtom(zipFilesAtom);
    const { mutateAsync: newdownloaded } = api.signedUrl.downloadObject.useMutation();
    const [, updateFile] = useAtom(updateZipFileAtom);
    const [, updateZip] = useAtom(updateZipProgressAtom);
    const [, removeZip] = useAtom(removeZipAtom);
    const router = useRouter()
    const safeFileName = (name: string) => name.replace(/[\\/:*?"<>|]/g, "_");

    const downloadZip = async () => {
        if (!session) return await router.push('/auth/login')
        const zip = new JSZip();
        const zipId = id;
        const folderName = safeFileName(fileName);

        // Initialize ZIP state
        setZipFiles((prev) => ({
            ...prev,
            [zipId]: {
                zipName: `${folderName}-${Date.now()}.zip`,
                files: trackIds.map((trackId) => ({
                    id: trackId,
                    filename: "",
                    loaded: 0,
                    total: 0,
                    progress: 0,
                    status: "pending" as const,
                })),
                progress: 0,
                status: "pending" as const,
            },
        }));

        try {
            // Download tracks in batches
            await runInBatches(trackIds, 4, async (trackId: string) => {
                const data = await newdownloaded({ id: trackId, source });
                const trackFileName = safeFileName(data.filename);

                // update filename in atom
                setZipFiles(prev => {
                    const zip = prev[zipId];
                    if (!zip) return prev;
                    return {
                        ...prev,
                        [zipId]: {
                            ...zip,
                            files: zip.files.map(f => (f.id === trackId ? { ...f, filename: trackFileName } : f))
                        }
                    };
                });

                // download track
                const res = await axios.get<ArrayBuffer>(data.url, {
                    responseType: "arraybuffer",
                    onDownloadProgress: (e) => {
                        updateFile({
                            zipId,
                            fileId: trackId,
                            loaded: e.loaded,
                            total: e.total ?? 0,
                            progress: e.total
                                ? Math.floor((e.loaded * 100) / e.total)
                                : 0,
                            status: "downloading",
                        });

                        updateZip(zipId);
                    }
                });

                // add to zip
                zip.file(`${folderName}/${trackFileName}`, res.data, { binary: true });

                // mark done
                const fileSize = res.data.byteLength ?? 0;

                updateFile({
                    zipId,
                    fileId: trackId,
                    loaded: fileSize,
                    total: fileSize,
                    progress: 100,
                    status: "done",
                });

                updateZip(zipId);
            });
            setZipFiles((prev) => {
                if (!prev[zipId]) return prev;

                return {
                    ...prev,
                    [zipId]: {
                        ...prev[zipId],
                        progress: 100,
                        status: "done",
                    },
                };
            });
            // generate and download ZIP
            const blob = await zip.generateAsync({ type: "blob" });
            fileDownload(blob, `${folderName} ${new Date().getTime()}.zip`);
            toast.success("Download complete");

            // remove zip from state after 5s
            setTimeout(() => removeZip(zipId), 5000);

        } catch (err: unknown) {
            console.error(err);
            toast.error("Download failed");
            updateZip(zipId);
        }
    };

    const zipStatus = zipFiles[id]?.status;
    const zipProgress = zipFiles[id]?.progress ?? 0;
    const isProcessing =
        zipStatus === "pending" ||
        zipStatus === "downloading"

    return (
  <>
    {isProcessing || zipStatus === "done" ? (
      <button
        type="button"
        disabled
        aria-live="polite"
        className={`
          flex
          h-9
          min-w-[125px]
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          px-3
          text-[10px]
          font-bold
          shadow-sm
          disabled:cursor-not-allowed

          ${
            zipStatus === "done"
              ? `
                  border-green-300/30
                  bg-green-400
                  text-green-950
                `
              : `
                  border-cyan-300/30
                  bg-cyan-400
                  text-cyan-950
                `
          }
        `}
      >
        <span>
          {zipStatus === "done"
            ? "Complete"
            : `Downloading ${zipProgress}%`}
        </span>

        {zipStatus !== "done" && (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        )}
      </button>
    ) : (
      <button
        type="button"
        onClick={async (event) => {
          event.stopPropagation()
          await downloadZip()
        }}
        aria-label={`Download ${fileName} as ZIP`}
        className="
        cursor-pointer
          group
          flex
          h-9
          min-w-[125px]
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-cyan-600/30
          bg-cyan-800
          px-3
          text-[10px]
          font-bold
          text-cyan-100
          shadow-[0_0_16px_rgba(34,211,238,0.16)]
          transition-all
          hover:border-cyan-200/50
          hover:bg-cyan-300
          hover:shadow-[0_0_20px_rgba(34,211,238,0.28)]
          active:scale-[0.98]
        "
      >
        <span>Download ZIP</span>

        <ImArrowDown
          className="
            h-4
            w-4
            transition-transform
            group-hover:translate-y-0.5
          "
        />
      </button>
    )}
  </>
)
};
