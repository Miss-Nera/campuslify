"use client";

import { ReactNode } from "react";
import Link from "next/link";   // ✅ import Link

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">📰 News</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/" className="hover:bg-gray-700 p-2 rounded">
            Home
          </Link>
          <Link href="/politics" className="hover:bg-gray-700 p-2 rounded">
            Politics
          </Link>
          <Link href="/sports" className="hover:bg-gray-700 p-2 rounded">
            Sports
          </Link>
          <Link href="/technology" className="hover:bg-gray-700 p-2 rounded">
            Technology
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Newspaper Reader</h1>
          <input
            type="text"
            placeholder="Search news..."
            className="border rounded px-3 py-1"
          />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
