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
      eventId: string;
    };
  }
) => {
  const session = await getServerSession();

  console.log("api/regEvents/approve -> event id ->>", params.eventId);

  if (!params.eventId || !session || !params.teamId) {
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

    const event = await eventModel.findOne(
      { id: params.eventId },
      {
        $elemMatch: {
          TeamsApplied_id: params.teamId,
        },
      }
    );

    if (!event) {
      throw new Error("Team not found in request list");
    }

    const updatedEvent = await eventModel.findOneAndUpdate(
      { id: params.eventId },
      {
        $pull: {
          TeamsApplied_id: params.teamId,
        },
        $addToSet: {
          TeamsAccepted_id: params.teamId,
        },
      },
      { new: true }
    );
    if (!updatedEvent) {
      throw new Error("Event not found");
    }

    return NextResponse.json(
      {
        data: "Approved Successfully",
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
