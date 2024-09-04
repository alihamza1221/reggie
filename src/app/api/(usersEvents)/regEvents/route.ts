import { eventModel } from "@/db/models/event";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createEventSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  location: z.string(),
});
export const GET = async (req: NextRequest) => {
  const session = await getServerSession();

  //get query params
  const isEnded = req.nextUrl.searchParams.get("isEnded");

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

  //find users by role
  await dbConnect();
  const reqEvents = await eventModel.find({ isEnded });
  return NextResponse.json(
    {
      data: reqEvents,
    },
    { status: 200 }
  );
};

//add users with rule as organization
export const POST = async (req: NextRequest) => {
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

  //create Event
  const { name, description, date, location } = createEventSchema.parse(
    await req.body
  );

  if (!(name && description)) {
    return NextResponse.json(
      {
        message: "provided info is not valid",
      },
      {
        status: 400,
      }
    );
  }
  try {
    await dbConnect();
    const event = await eventModel.create({
      name,
      description,
      date,
      location,
      userId: session.user.id,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: (err as Error)?.message as string,
      },
      {
        status: 500,
      }
    );
  }
  return NextResponse.json(
    {
      message: "Event created successfully",
    },
    { status: 200 }
  );
};
