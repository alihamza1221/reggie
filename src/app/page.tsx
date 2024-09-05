"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={() => {
          signIn("google");
        }}
        className="bg-blue text-white px-4 py-2 rounded-md shadow-md"
      >
        Login with Google
      </button>
    </main>
  );
}
