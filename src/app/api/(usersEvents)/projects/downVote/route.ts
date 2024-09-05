import { ProjectModel } from "@/db/models/project";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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

  //pull user upvote
  await dbConnect();
  const reqEvents = await ProjectModel.findOne(
    { id: eventId },
    {
      $pull: {
        userId: session.user.id,
      },
    }
  );
  return NextResponse.json(
    {
      data: reqEvents,
    },
    { status: 200 }
  );
};
