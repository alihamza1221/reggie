import { ProjectModel } from "@/db/models/project";
import dbConnect from "@/db/mongooseConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { zodProjectTagSchema } from "@/lib/ProjectTags";

const ProjectSchema = z.object({
  tags: z.array(zodProjectTagSchema),
  title: z.string(),
  description: z.string(),
  url: z.string().optional(),
  image: z.string().optional(),
  active: z.boolean().optional().default(true),
  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
  eventId: z.string(),
  upVotes: z.array(z.string()).default([]).optional(),
  teamId: z.string(),
});

export const POST = async (req: NextRequest) => {
  const session = await getServerSession();

  const projectData = ProjectSchema.parse(await req.json());
  //check if user is authenticated
  if (!session || !projectData || !projectData.teamId || !projectData.eventId) {
    return NextResponse.json(
      {
        message: "Bad Req invalid data to add project",
      },
      {
        status: 403,
      }
    );
  }

  try {
    //get user upvote
    await dbConnect();
    const newProject = new ProjectModel(projectData);
    await newProject.save();
    if (!newProject) {
      throw new Error("Failed to add project");
    }
    return NextResponse.json(
      {
        data: "Project added successfully",
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
