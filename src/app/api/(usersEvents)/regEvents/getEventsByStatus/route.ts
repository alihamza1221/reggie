import { eventModel } from "@/db/models/event";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

export const GET = async (req: NextRequest) => {
  const session: Session | null = await getServerSession(nextAuthOptions);

  //check if user is authenticated
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  //find users by role
  try {
    await dbConnect();
    const reqEvents = await eventModel.find();
    return NextResponse.json(
      {
        data: reqEvents,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.log("api/regevents get:", err);
    return NextResponse.json(
      {
        message: err?.message,
      },
      { status: 500 }
    );
  }
};
