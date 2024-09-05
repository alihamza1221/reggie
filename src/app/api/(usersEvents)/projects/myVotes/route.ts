import { ProjectModel } from "@/db/models/project";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();

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

  //get user upvote
  await dbConnect();
  const upVotesData = await ProjectModel.find({
    upVotes: {
      $elemMatch: {
        userId: session.user.id,
      },
    },
  });
  return NextResponse.json(
    {
      data: upVotesData,
    },
    { status: 200 }
  );
};
