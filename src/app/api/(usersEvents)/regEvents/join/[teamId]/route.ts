import { eventModel } from "@/db/models/event";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      teamId: string;
    };
  }
) => {
  const session = await getServerSession();
  const eventId = req.nextUrl.searchParams.get("eventId");
  console.log("api/regEvents/[teamId] -> event id ->>", eventId);

  if (!eventId || !session || !params.teamId) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  try {
    await dbConnect();
    const updatedEvent = await eventModel.findOneAndUpdate(
      { id: eventId },
      {
        $addToSet: {
          TeamsApplied_id: params.teamId,
        },
      },
      { new: true }
    );

    if (!updatedEvent) {
      throw new Error("Event not found");
    }

    return NextResponse.json(
      {
        data: "Request sent Successfully",
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        message: err?.message,
      },
      { status: 403 }
    );
  }
};
