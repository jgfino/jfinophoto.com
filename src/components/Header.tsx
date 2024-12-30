import Link from "next/link";

export function Header() {
  return (
    <header className="flex flex-col gap-8 w-1/6 h-screen p-8">
      <Link href="/" className="text-3xl font-bold">
        JULIA FINOCCHIARO
      </Link>
      <nav>
        <ul className="flex flex-col gap-4">
          <li>
            <Link href="/">LIVE</Link>
          </li>
          <li>
            <Link href="/festival">FESTIVAL</Link>
          </li>
          <li>
            <Link href="/portrait">PORTRAIT</Link>
          </li>
          <hr />
          <li>
            <Link href="/about">ABOUT</Link>
          </li>
          <li>
            <Link href="/contact">CONTACT</Link>
          </li>
          {/* <li>
            <Link href="/shop">SHOP</Link>
          </li> */}
          <hr />
          <li>
            <Link href="/edit">EDIT</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
