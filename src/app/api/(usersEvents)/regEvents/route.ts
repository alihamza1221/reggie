import { eventModel } from "@/db/models/event";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../../auth/[...nextauth]/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { z } from "zod";

const createEventSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  location: z.string(),
});
export const GET = async (req: NextRequest) => {
  const session: Session | null = await getServerSession(nextAuthOptions);

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
  try {
    await dbConnect();
    const reqEvents = await eventModel.find();
    return NextResponse.json(
      {
        data: reqEvents,
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

//add users with rule as organization
export const POST = async (req: NextRequest) => {
  const session: Session | null = await getServerSession(nextAuthOptions);

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
  const {
    name,
    description,
    date: strDate,
    location,
  } = createEventSchema.parse(await req.json());

  // strDate = "12/11/1989" -> Date object
  const date = new Date(strDate);
  console.log(name, description, date, location);

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
      userId: session.user?.id,
    });
    await event.save();
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
