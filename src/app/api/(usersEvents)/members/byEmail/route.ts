import { userModel } from "@/db/models/user";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const memberSchema = z.object({
  memberEmails: z.array(z.string().email()).default([]),
});
export const POST = async (req: NextRequest) => {
  const session = await getServerSession();
  const body = await req.json();
  console.log("api/members-> body: >>", body);

  const { memberEmails } = memberSchema.parse(body);
  console.log("api/members-> {memberEmails}", memberEmails);
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
    const memberIds = await userModel.find(
      { email: { $in: memberEmails } },
      { _id: 0, id: 1 }
    );

    const memberIdsArray = memberIds.map((member) => member.id);
    return NextResponse.json(
      {
        data: memberIdsArray,
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
