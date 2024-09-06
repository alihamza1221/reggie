"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  console.log("session client side : ", session);
  function handleClick() {
    const res = fetch("http://localhost:3000/api/regEvents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "test",
        description: "test",
        date: "12/11/1989",
        location: "test",
      }),
    });
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={() => {
          signIn("google");
        }}
        className="bg-slate-400 text-white px-4 py-2 rounded-md shadow-md"
      >
        Login with Google
      </button>
      <button
        onClick={() => {
          signOut();
        }}
        className="bg-blue-500  text-white px-4 py-2 rounded-md shadow-md"
      >
        Signout
      </button>

      <button
        onClick={handleClick}
        className="bg-white text-blak p-4 py-3 border rounded-xl"
      >
        click me
      </button>
    </main>
  );
}
