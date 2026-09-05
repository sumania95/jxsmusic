import { atom } from "jotai";

export type ZipFile = {
  id: string; // trackId
  filename: string;

  loaded: number;
  total: number;

  progress: number;
  status: "pending" | "downloading" | "done" | "error" | "cancelled";
  error?: string;
};

export type ZipFilesState = Record<
  string,
  {
    zipName: string;
    files: ZipFile[];
    progress: number;
    status: ZipFile["status"];
  }
>;

export const zipFilesAtom = atom<ZipFilesState>({});

export const updateZipFileAtom = atom(
  null,
  (
    get,
    set,
    payload: {
      zipId: string;
      fileId: string;

      filename?: string;
      loaded?: number;
      total?: number;

      progress?: number;
      status?: ZipFile["status"];
      error?: string;
    }
  ) => {
    const state = get(zipFilesAtom);
    const zip = state[payload.zipId];

    if (!zip) return;

    const files = zip.files.map((file) =>
      file.id === payload.fileId
        ? {
            ...file,
            ...payload,
          }
        : file
    );

    set(zipFilesAtom, {
      ...state,
      [payload.zipId]: {
        ...zip,
        files,
      },
    });
  }
);

export const updateZipProgressAtom = atom(
  null,
  (get, set, zipId: string) => {
    const state = get(zipFilesAtom);
    const zip = state[zipId];

    if (!zip) return;

    const totalLoaded = zip.files.reduce(
      (sum, file) => sum + (file.loaded || 0),
      0
    );

    const totalBytes = zip.files.reduce(
      (sum, file) => sum + (file.total || 0),
      0
    );

    const progress =
      totalBytes > 0
        ? Math.floor((totalLoaded / totalBytes) * 100)
        : 0;

    const status = zip.files.every((f) => f.status === "done")
      ? "done"
      : zip.files.some((f) => f.status === "downloading")
      ? "downloading"
      : "pending";

    set(zipFilesAtom, {
      ...state,
      [zipId]: {
        ...zip,
        progress,
        status,
      },
    });
  }
);

export const removeZipAtom = atom(
  null,
  (get, set, zipId: string) => {
    const state = get(zipFilesAtom);

    const newState = { ...state };
    delete newState[zipId];

    set(zipFilesAtom, newState);
  }
);