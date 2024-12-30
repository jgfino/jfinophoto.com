"use client";

import { Enums } from "../../supabase/database.types";
import Checkbox from "./Checkbox";
import { useCallback, useState } from "react";
import { NavButton } from "./NavButton";
import { DrivePhoto } from "@/lib/google/drive";

interface EditModalProps {
  photo: DrivePhoto;
  initialSelected: Enums<"photo_page">[];
  onSubmit: (
    photo: DrivePhoto,
    all: Enums<"photo_page">[],
    added: Enums<"photo_page">[],
    removed: Enums<"photo_page">[]
  ) => void;
  onClose: () => void;
}

export function EditModal({
  photo,
  onSubmit,
  onClose,
  initialSelected,
}: EditModalProps) {
  const [selectedPages, setSelectedPages] =
    useState<Enums<"photo_page">[]>(initialSelected);

  const togglePage = useCallback((page: Enums<"photo_page">) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border shadow-lg rounded-md bg-white text-center">
        <h3 className="text-xl font-semibold text-black">
          Edit Portfolio Visiblity
        </h3>
        <h4 className="text-lg text-black">
          {photo.path.toReversed().join(" • ")}
        </h4>
        <div className="mt-8 flex flex-col gap-4">
          <Checkbox
            checked={selectedPages.includes("live")}
            onClick={() => togglePage("live")}
            label="Live"
          />
          <Checkbox
            checked={selectedPages.includes("festival")}
            onClick={() => togglePage("festival")}
            label="Festival"
          />
          <Checkbox
            checked={selectedPages.includes("portrait")}
            onClick={() => togglePage("portrait")}
            label="Portrait"
          />
        </div>
        <div className="mt-8 flex gap-2">
          <NavButton
            outline
            text="Close"
            onClick={onClose}
            className="flex-1 px-8"
          />
          <NavButton
            className="flex-1 px-8"
            text="Save"
            onClick={() => {
              const added = selectedPages.filter(
                (page) => !initialSelected.includes(page)
              );
              const removed = initialSelected.filter(
                (page) => !selectedPages.includes(page)
              );
              onSubmit(photo, selectedPages, added, removed);
            }}
          />
        </div>
      </div>
    </div>
  );
}
