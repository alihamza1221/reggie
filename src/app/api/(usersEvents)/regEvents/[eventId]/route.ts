import { eventModel } from "@/db/models/event";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      eventId: string;
    };
  }
) => {
  const session = await getServerSession();
  console.log("api/regEvents/[eventId] -> event id ->>", params.eventId);

  try {
    await dbConnect();
    const curEvent = await eventModel.findOne({ id: params.eventId });

    return NextResponse.json(
      {
        data: curEvent,
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
