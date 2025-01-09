import { NavButton } from "@/components/NavButton";

export default function Edit() {
  return (
    <div className="flex flex-col gap-8 w-full h-full items-center justify-center">
      <NavButton text="All" className="w-1/3" href="/edit/all/live" />
      <NavButton text="Current" className="w-1/3" href="/edit/current/live" />
    </div>
  );
}
