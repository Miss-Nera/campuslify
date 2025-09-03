"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <Image
          src="/my-school-logo.png" // match the filename in public/
          alt="School Logo"
          width={200}
          height={200}
          priority
          className="mx-auto"
        />
        <h1 className="mt-6 text-2xl font-bold text-indigo-600">
          Welcome to Our School Portal
        </h1>
      </div>
    </main>
  );
}
