"use client";
import HeroSection from "@/components/HeroSection";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="z-1 bg-gradient-to-b from-white to-purple-50 z-1 min-h-[100vh]">
      {/* <div className="background bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl  absolute top-[50%] left-[50%] w-[500px] h-[500px] blur-[150px] translate-x-[-50%] translate-y-[-50%] z-0"></div> */}
      <HeroSection />
    </main>
  );
}
