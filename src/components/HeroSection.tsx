import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
export default function HeroSection() {
  const { data: session } = useSession();
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="w-full flex flex-col justify-center items-center space-y-4 text-center">
        <div className="inline-block rounded-full bg-white px-5 py-2 text-md text-gray-700 shadow-md border-t-[1px]">
          rankit is now public!
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl/none xl:text-7xl mx-auto">
          Create and Organize
          <br />
          custom <span className="text-blue-500">events</span> in seconds.
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Organize your Events, Workshops swiftly with rankit&apos;s free and
          easy-to-use tools, perfect for both beginners and professionals.
        </p>
        <Button
          onClick={() => {
            !session && signIn("google");
          }}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-md text-md flex items-center space-x-2 px-6 py-4 mt-4"
        >
          {!session ? (
            "Continue with Google"
          ) : (
            <Link href={"dashboard"}>Get Started</Link>
          )}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
