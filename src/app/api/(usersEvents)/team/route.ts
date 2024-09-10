import { teamModel } from "@/db/models/team";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
export const GET = async (req: NextRequest) => {
  const session = await getServerSession();

  const eventId = req.nextUrl.searchParams.get("eventId");
  //check if user is authenticated
  if (!session || !eventId) {
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
    const reqTeams = await teamModel.find();
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

const teamSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  members: z.array(z.string()).default([]),
});
export const POST = async (req: NextRequest) => {
  const session = await getServerSession();

  const curTeam = teamSchema.parse(await req.json());

  if (!session || !curTeam) {
    return NextResponse.json(
      {
        message: "Invalid request",
      },
      {
        status: 403,
      }
    );
  }
  try {
    await dbConnect();
    const newTeam = await teamModel.create(curTeam);
    const res = await newTeam.save();

    return NextResponse.json(
      {
        data: res,
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        message: err?.message,
      },
      {
        status: 500,
      }
    );
  }
};
