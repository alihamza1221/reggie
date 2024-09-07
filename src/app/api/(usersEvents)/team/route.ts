import { eventModel } from "@/db/models/event";
import { teamModel } from "@/db/models/team";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();

  const eventId = req.nextUrl.searchParams.get("eventId");
  //check if user is authenticated
  if (!session || !eventId) {
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
    //find users by role
    await dbConnect();
    const TeamsId: string[] = await eventModel.find(
      { id: eventId },
      { TeamsAccepted_id: 1 }
    );
    const reqTeams = await teamModel.find({ id: { $in: TeamsId } });
    return NextResponse.json(
      {
        data: reqTeams,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        message: err?.message,
      },
      { status: 500 }
    );
  }
};
