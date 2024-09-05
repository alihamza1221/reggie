import { ProjectModel } from "@/db/models/project";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  const projectId = req.nextUrl.searchParams.get("projectId");

  //check if user is authenticated
  if (!session || !projectId || !session.user) {
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
  const resUpdate = await ProjectModel.findOneAndUpdate(
    { id: projectId },
    {
      $addToSet: {
        upVotes: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    },
    { new: true }
  );
  return NextResponse.json(
    {
      data: resUpdate,
    },
    { status: 200 }
  );
};
