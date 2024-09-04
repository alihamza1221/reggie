import { eventModel } from "@/db/models/event";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();

  //get query params
  const eventId = req.nextUrl.searchParams.get("eventId");

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
  await dbConnect();
  const reqEvents = await eventModel.find({ id: eventId }); // debug query
  return NextResponse.json(
    {
      data: reqEvents,
    },
    { status: 200 }
  );
};
