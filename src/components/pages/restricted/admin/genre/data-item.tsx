import React from "react";
import { Layers3 } from "lucide-react";
import AdminGenreDelete from "./helper/action-delete";

interface Props {
  id: string;
  name: string;
}

const AdminGenreItem = ({
  id,
  name,
}: Props) => {
  return (
    <div
      className="
        group
        flex
        min-h-[64px]
        w-full
        items-center
        justify-between
        gap-3
        px-4
        py-3
        text-zinc-300
      "
    >
      {/* Genre info */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.025]
            text-zinc-600
            transition-all
            group-hover:border-[#B9FF00]/15
            group-hover:bg-[#B9FF00]/[0.06]
            group-hover:text-[#B9FF00]
          "
        >
          <Layers3 className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p
            className="
              truncate
              text-sm
              font-medium
              text-zinc-200
            "
          >
            {name}
          </p>

          <p
            className="
              mt-0.5
              text-[9px]
              uppercase
              tracking-[0.14em]
              text-zinc-700
            "
          >
            Genre
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <AdminGenreDelete id={id} />
      </div>
    </div>
  );
};

export default AdminGenreItem;