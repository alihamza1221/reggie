import { teamModel } from "@/db/models/team";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { userModel } from "@/db/models/user";

const TeamMembers = z.object({
  membersEmail: z.array(z.string().email()),
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

  const { membersEmail } = TeamMembers.parse(await req.json());
  console.log("api/addMembers[teamId]-> membersEmail[] : ", membersEmail);

  if (!membersEmail || !session || !params.teamId) {
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

    const membersId = userModel.find(
      { email: { $in: membersEmail } },
      { _id: 0, id: 1 }
    );
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
