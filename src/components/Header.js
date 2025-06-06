"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-10 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-center gap-12">
          <Link
            href="/"
            className={`text-xl font-bold transition-colors duration-300 ${
              pathname === "/" ? "text-white" : "text-gray-400 hover:text-white"
            }`}>
            HOME
          </Link>
        </div>
      </nav>
    </header>
  );
}
