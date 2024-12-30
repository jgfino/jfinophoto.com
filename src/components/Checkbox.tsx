"use client";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onClick?: () => void;
}

export default function Checkbox({ label, checked, onClick }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        checked={checked}
        onChange={() => {
          onClick?.();
        }}
        id="default-checkbox"
        type="checkbox"
        value=""
        className="w-8 h-8 text-black-600 bg-gray-100 border-gray-300 rounded text-black focus:ring-black"
      />
      <label htmlFor="default-checkbox" className="ms-2 text-lg text-black">
        {label}
      </label>
    </div>
  );
}
