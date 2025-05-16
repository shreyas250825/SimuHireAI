'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to SimuHire AI</h1>

      {/* Start Interview Button */}
      <Link href="/interview">
        <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          Start Interview
        </button>
      </Link>

      {/* View Report Link */}
      <Link href="/my-report" className="underline text-blue-600 hover:text-blue-800">
        View My Report
      </Link>
    </main>
  );
}
