"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Team } from "@/db/models/team";
import { IUser } from "@/db/models/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardContent = () => {
  const { data: session } = useSession();
  const [team, setTeam] = useState<null | Team>(null);
  const [membersInfo, setMembersInfo] = useState<IUser[]>([]);
  const [projects, setProjects] = useState([]);
  const [upvotesStats, setUpvotesStats] = useState({});

  if (!session) return null;
  useEffect(() => {
    console.log("running...");
    if (session?.user?.id) {
      getTeamInfo();
      // getProjects();
      // getUpvotesStats();
    }
  }, [session]);

  async function getTeamInfo() {
    try {
      const res = await axios.get("/api/team/my", {
        params: {
          userId: session?.user?.id,
        },
      });
      // res = res<object>.data<object>.data[]<Team>
      if (!res.data?.data) {
        console.log(res.data?.message);
      }
      setTeam(res.data.data[0]);
      if (res.data.data[0].members.length == 0) {
        setMembersInfo([]);
        return;
      }
      const { members } = res.data.data[0];

      console.log("members: ", members);
      const response = await axios.post("/api/members", {
        headers: { "Content-Type": "application/json" },
        memberIds: members,
      });

      if (response.data?.data) {
        setMembersInfo(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching team info:", err);
    }
  }

  // async function getProjects() {
  //   try {
  //     const res = await axios.get("app/api/(user events)/projects/team", {
  //       params: { teamId: team?.id },
  //     });
  //     if (res.data?.data) {
  //       setProjects(res.data.data);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching projects:", err);
  //   }
  // }

  // async function getUpvotesStats() {
  //   // This is a placeholder. You'll need to implement the actual API call
  //   // to get upvotes statistics for the user's projects
  //   setUpvotesStats({ totalUpvotes: 0, projectsUpvoted: 0 });
  // }

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-6">Welcome to Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left section: Events organized (replaced with Projects) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            <ul>
              {/* {projects.map((project) => (
                <li key={project.id}>{project.name}</li>
              ))} */}
            </ul>
          </div>

          {/* Middle section */}
          <div className="space-y-6">
            {/* Upvotes stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Upvotes Stats</h2>
              {/* <p>Total Upvotes: {upvotesStats.totalUpvotes}</p>
              <p>Projects Upvoted: {upvotesStats.projectsUpvoted}</p> */}
            </div>

            {/* Additional stats or info can go here */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Additional Info</h2>
              {/* Add any additional information here */}
            </div>
          </div>

          {/* Right section: Team and members */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Team and Members</h2>
            <h3 className="text-lg font-semibold">{team?.name}</h3>
            <ul>
              {membersInfo.map((member) => (
                <div
                  key={member.id}
                  className="member-info flex p-2 gap-2 items-center justify-start"
                >
                  <Avatar>
                    <AvatarImage src={member?.image ?? ""} />
                    <AvatarFallback>UR</AvatarFallback>
                  </Avatar>
                  <span className="text-md border-2 rounded-3xl px-3  border-slate-300">
                    {member?.name}
                  </span>
                  <span>{member?.email}</span>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
