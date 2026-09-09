import React from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useAtom } from "jotai";
import { zipFilesAtom, removeZipAtom } from "@/state/downloadAtoms";
import fileDownload from "js-file-download";
import JSZip from "jszip";
import axios from "axios";
import { runInBatches } from "@/utils/downloadZipBatch";
import { useRouter } from "next/router";
import { ImArrowDown } from "react-icons/im";
import { LoaderCircle } from "lucide-react";

interface Props {
  id: string;
  fileName: string;
  trackIds: string[];
  source: "track" | "pack" | undefined;
}

export const DownloadZipComponent = ({ id, fileName, trackIds, source }: Props) => {
  const { data: session } = useSession();
  const [zipFiles, setZipFiles] = useAtom(zipFilesAtom);
  const { mutateAsync: newdownloaded } = api.signedUrl.downloadObject.useMutation();
  const [, removeZip] = useAtom(removeZipAtom);
  const router = useRouter();

  const safeFileName = (name: string) => name.replace(/[\\/:*?"<>|]/g, "_");

  const downloadZip = async () => {
    if (!session) {
      await router.push("/auth/login");
      return;
    }

    const zip = new JSZip();
    const zipId = id;
    const folderName = safeFileName(fileName);

    setZipFiles((prev) => ({
      ...prev,
      [zipId]: {
        zipName: `${folderName}-${Date.now()}.zip`,
        files: trackIds.map((trackId) => ({ id: trackId, filename: "", loaded: 0, total: 0, progress: 0, status: "pending" as const })),
        progress: 0,
        status: "pending" as const,
      },
    }));

    const updateTrack = (trackId: string, changes: { filename?: string; loaded?: number; total?: number; progress?: number; status?: "pending" | "downloading" | "done" }) => {
      setZipFiles((prev) => {
        const currentZip = prev[zipId];
        if (!currentZip) return prev;

        const files = currentZip.files.map((file) => file.id === trackId ? { ...file, ...changes } : file);
        const averageDownloadProgress = files.length ? files.reduce((sum, file) => sum + file.progress, 0) / files.length : 0;
        const nextProgress = Math.min(90, Math.floor(averageDownloadProgress * 0.9));

        return {
          ...prev,
          [zipId]: {
            ...currentZip,
            files,
            progress: Math.max(currentZip.progress, nextProgress),
            status: "downloading" as const,
          },
        };
      });
    };

    try {
      await runInBatches(trackIds, 4, async (trackId: string) => {
        const data = await newdownloaded({ id: trackId, source });
        const trackFileName = safeFileName(data.filename);

        updateTrack(trackId, { filename: trackFileName });

        const res = await axios.get<ArrayBuffer>(data.url, {
          responseType: "arraybuffer",
          onDownloadProgress: (event) => {
            const progress = event.total ? Math.floor((event.loaded * 100) / event.total) : 0;
            updateTrack(trackId, { loaded: event.loaded, total: event.total ?? 0, progress, status: "downloading" });
          },
        });

        zip.file(`${folderName}/${trackFileName}`, res.data, { binary: true });

        const fileSize = res.data.byteLength;
        updateTrack(trackId, { loaded: fileSize, total: fileSize, progress: 100, status: "done" });
      });

      setZipFiles((prev) => prev[zipId] ? { ...prev, [zipId]: { ...prev[zipId], progress: Math.max(prev[zipId].progress, 90), status: "downloading" as const } } : prev);

      const blob = await zip.generateAsync({ type: "blob" }, ({ percent }) => {
        const zipProgress = Math.min(99, 90 + Math.floor(percent * 0.09));
        setZipFiles((prev) => prev[zipId] ? { ...prev, [zipId]: { ...prev[zipId], progress: Math.max(prev[zipId].progress, zipProgress), status: "downloading" as const } } : prev);
      });

      fileDownload(blob, `${folderName} ${Date.now()}.zip`);

      setZipFiles((prev) => prev[zipId] ? { ...prev, [zipId]: { ...prev[zipId], progress: 100, status: "done" as const } } : prev);
      toast.success("Download complete");
      setTimeout(() => removeZip(zipId), 5000);
    } catch (err: unknown) {
      console.error(err);
      removeZip(zipId);
      toast.error("Download failed");
    }
  };

  const zipStatus = zipFiles[id]?.status;
  const zipProgress = zipFiles[id]?.progress ?? 0;
  const isProcessing = zipStatus === "pending" || zipStatus === "downloading";

  return (
    <>
      {isProcessing || zipStatus === "done" ? (
        <button type="button" disabled aria-live="polite" className={`flex h-9 min-w-[125px] items-center justify-center gap-2 rounded-xl border px-3 text-[10px] font-bold shadow-sm disabled:cursor-not-allowed ${zipStatus === "done" ? "border-green-300/30 bg-green-400 text-green-950" : "border-cyan-300/30 bg-cyan-400 text-cyan-950"}`}>
          <span>{zipStatus === "done" ? "Complete" : `Downloading ${zipProgress}%`}</span>
          {zipStatus !== "done" && <LoaderCircle className="h-4 w-4 animate-spin" />}
        </button>
      ) : (
        <button type="button" onClick={async (event) => { event.stopPropagation(); await downloadZip(); }} aria-label={`Download ${fileName} as ZIP`} className="group flex h-9 min-w-[125px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-600/30 bg-cyan-800 px-3 text-[10px] font-bold text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.16)] transition-all hover:border-cyan-200/50 hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.28)] active:scale-[0.98]">
          <span>Download ZIP</span>
          <ImArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </button>
      )}
    </>
  );
};