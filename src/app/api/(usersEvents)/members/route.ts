import { userModel } from "@/db/models/user";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const memberSchema = z.object({
  memberIds: z.array(z.string()).default([]),
});
export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  const memberIds = memberSchema.parse(req.json());
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

  try {
    //find users by role
    await dbConnect();
    const membersInfo = await userModel.find({ id: { $in: memberIds } });

    return NextResponse.json(
      {
        data: membersInfo,
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
