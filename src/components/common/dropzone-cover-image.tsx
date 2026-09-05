import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

type ImageDropzoneProps = {
  preview: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
};

export const ImageDropzone = ({
  preview,
  onFileSelect,
  onRemove,
}: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Max file size is 5MB");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div
      className="relative border-2 border-dashed rounded-xl p-6 cursor-pointer
        flex flex-col items-center justify-center gap-3
        hover:border-blue-500 transition"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {preview ? (
        <>
          {/* REMOVE BUTTON */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // 🔥 IMPORTANT
              onRemove();
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
            className="absolute top-2 right-2 bg-[#111518]/70 text-white
              rounded-full p-1 hover:bg-[#111518]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* PREVIEW */}
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-xs rounded-lg object-cover"
          />
        </>
      ) : (
        <>
          <ImagePlus className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop album cover or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WEBP (max 5MB)
          </p>
        </>
      )}
    </div>
  );
};
