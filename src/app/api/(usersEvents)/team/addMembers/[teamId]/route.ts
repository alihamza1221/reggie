import { teamModel } from "@/db/models/team";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const TeamMembers = z.object({
  membersId: z.array(z.string()),
});
export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      teamId: string;
    };
  }
) => {
  const session = await getServerSession();

  const { membersId } = TeamMembers.parse(await req.json());
  console.log("api/addMembers[teamId]-> members[] : ", membersId);

  if (!membersId || !session || !params.teamId) {
    return NextResponse.json(
      {
        message: "Some error occurred!",
      },
      {
        status: 403,
      }
    );
  }

  try {
    await dbConnect();

    const updatedTeam = await teamModel.findOneAndUpdate(
      { id: params.teamId },
      {
        $addToSet: {
          members: { $each: membersId },
        },
      },
      { new: true }
    );
    if (!updatedTeam) {
      throw new Error("Team not found");
    }

    return NextResponse.json(
      {
        data: "Members added  Successfully",
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
