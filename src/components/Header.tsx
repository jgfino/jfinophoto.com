import Link from "next/link";
import Hamburger from "./Hamburger";

export function Header() {
  return (
    <nav className="md:pb-0 md:p-16 pb-0 p-4">
      <div className="flex flex-row items-center justify-between w-full gap-8">
        <Link href="/" className="text-2xl md:text-4xl font-bold">
          JULIA FINOCCHIARO
        </Link>
        <Hamburger />
        <div className="hidden md:block" id="navbar-default">
          <ul className="flex flex-row gap-4 text-xl">
            <li className="hover:text-gray-600">
              <Link href="/">LIVE</Link>
            </li>
            <li className="hover:text-gray-600">
              <Link href="/festival">FESTIVAL</Link>
            </li>
            <li className="hover:text-gray-600">
              <Link href="/portrait">PORTRAIT</Link>
            </li>
            <li className="hover:text-gray-600">
              <Link href="/about">ABOUT</Link>
            </li>
            <li className="hover:text-gray-600">
              <Link href="/contact">CONTACT</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
