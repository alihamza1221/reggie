import { teamModel } from "@/db/models/team";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  const userId = req.nextUrl.searchParams.get("userId");
  //check if user is authenticated
  if (!session || !userId) {
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
    const reqTeams = await teamModel.find({
      members: { $in: [userId] },
    });
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
