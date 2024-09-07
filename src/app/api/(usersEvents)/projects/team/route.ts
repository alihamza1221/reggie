import { ProjectModel } from "@/db/models/project";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth/next";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  const teamId = req.nextUrl.searchParams.get("teamId");

  //check if user is authenticated
  if (!session || !teamId) {
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
    const teamProjects = await ProjectModel.find({ teamId: teamId });

    return NextResponse.json(
      {
        data: teamProjects,
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
