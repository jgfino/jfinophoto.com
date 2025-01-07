import Link from "next/link";
import Instagram from "../../public/instagram.svg";
import Email from "../../public/mail.svg";

export default function MobileNavMenu() {
  return (
    <ul
      id="collapsible-content"
      className={`h-full flex flex-col items-center justify-center gap-6 text-xl`}
    >
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
      <li className="h-8 w-8 mt-8">
        <Link target="_blank" href="https://instagram.com/jfino.photo">
          <Instagram height="100%" />
        </Link>
      </li>
      <li className="w-8 h-8">
        <Link href="mailto:julia@jfinophoto.com">
          <Email height="100%" />
        </Link>
      </li>
      <li className="hover:text-gray-600 text-sm mt-8">
        <Link href="mailto:julia@jfinophoto.com">JULIA@JFINOPHOTO.COM</Link>
      </li>
    </ul>
  );
}
