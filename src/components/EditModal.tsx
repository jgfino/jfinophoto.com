"use client";

import { Enums } from "../../supabase/database.types";
import { NavButton } from "./NavButton";

interface EditModalProps {
  onSubmit: (add?: Enums<"photo_page">, remove?: Enums<"photo_page">) => void;
  onClose: () => void;
}

export function EditModal({ onSubmit, onClose }: EditModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border shadow-lg rounded-md bg-white text-center">
        <h3 className="text-xl font-semibold text-black">
          Edit Portfolio Visiblity
        </h3>
        <p className="my-4">Add</p>
        <div className="flex flex-col gap-4">
          <NavButton onClick={() => onSubmit("live")} text="Live" />
          <NavButton onClick={() => onSubmit("festival")} text="Festival" />
          <NavButton onClick={() => onSubmit("portrait")} text="Portrait" />
        </div>
        <p className="my-4">Remove</p>
        <div className="flex flex-col gap-4">
          <NavButton onClick={() => onSubmit(undefined, "live")} text="Live" />
          <NavButton
            onClick={() => onSubmit(undefined, "festival")}
            text="Festival"
          />
          <NavButton
            onClick={() => onSubmit(undefined, "portrait")}
            text="Portrait"
          />
        </div>
        <div className="mt-8 flex gap-2">
          <NavButton
            outline
            text="Close"
            onClick={onClose}
            className="flex-1 px-8"
          />
        </div>
      </div>
    </div>
  );
}
