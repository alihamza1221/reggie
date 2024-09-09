import { userModel } from "@/db/models/user";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const memberSchema = z.object({
  memberIds: z.array(z.string()).default([]),
});
export const POST = async (req: NextRequest) => {
  const session = await getServerSession();
  const body = await req.json();
  console.log("api/members-> body: >>", body);

  const { memberIds } = memberSchema.parse(body);
  console.log("api/members-> {memberIds}", memberIds);
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
