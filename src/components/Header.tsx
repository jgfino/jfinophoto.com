import Link from "next/link";
import MobileNavWrapper from "./MobileNavWrapper";
import Instagram from "../../public/instagram.svg";
import Email from "../../public/mail.svg";

export function Header() {
  return (
    <nav className="md:pb-0 md:p-16 pb-0 p-4">
      <div className="flex flex-row items-center justify-between w-full">
        <MobileNavWrapper className="md:hidden" />
        <Link href="/" className="hidden md:block md:text-4xl font-bold">
          JULIA FINOCCHIARO
        </Link>
        <div className="hidden md:block" id="navbar-default">
          <ul className="flex flex-row items-center gap-4 text-xl">
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
            <li className="h-8 w-8 ml-4">
              <Link target="_blank" href="https://instagram.com/jfino.photo">
                <Instagram height="100%" />
              </Link>
            </li>
            <li className="h-8 w-8">
              <Link href="mailto:julia@jfinophoto.com">
                <Email height="100%" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
