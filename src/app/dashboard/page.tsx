"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  Calendar,
  ChartSpline,
  MapPin,
  PieChart,
  ScissorsLineDashedIcon,
  Search,
  ShieldHalf,
  Shirt,
  UserRound,
  UserRoundSearchIcon,
} from "lucide-react";
import { ChevronRight } from "lucide-react";
import { SquareActivity } from "lucide-react";
import { FilePieChart } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
import { UsersRound } from "lucide-react";
import { CreateTeamPopup } from "@/components/create-team-popup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Team } from "@/db/models/team";
import { useState } from "react";
import { IUser } from "@/db/models/user";
import axios from "axios";

const Dashboard = () => {
  const { data: session } = useSession();
  if (!session) return <div>Unauthorized</div>;

  return (
    <div className="flex justify-start">
      <ScrollArea className="">
        <div className="side-bar pt-6 px-3 w-[250px] h-[calc(100vh-150px)]  border-r-[1px] border-slate-200 ">
          <div className="rankit-logo flex  items-center mb-6">
            <Image
              src="/rankit.svg"
              width={50}
              height={50}
              alt={"rankit logo"}
            />
            <h1 className=" text-2xl">rankit</h1>
          </div>
          <div className="sidebar-features">
            <div className="feature-report mb-3">
              <div className="feature-lablel text-lg font-bold text-slate-400 hover:text-slate-600 flex justify-between">
                <div className="flex items-center">
                  <PieChart className="inline-block" />
                  <span className="pl-3 ">Reports</span>
                </div>
                <ChevronRight className="ml-6" />
              </div>
              <div className="text-lg font-bold text-slate-400  ml-5 mt-3 border-l-[1px] border-slate-400 px-2">
                <div className="flex hover:text-slate-600">
                  <FilePieChart />
                  <span className="pl-3">Dashboard</span>
                </div>
                <div className="flex my-3 hover:text-slate-600">
                  <SquareActivity />
                  <span className="pl-3">Activity</span>
                </div>
              </div>
            </div>
            <SidebarTeamsSection />
            <SidebarEventsSection />
            <SidebarProjectsSection />
            <SidebarProfileSection session={session} />
          </div>
        </div>

        <div className="side-bar-b-svg fixed left-0 bottom-0">
          <Image
            src="/leftnav-footer.svg"
            width={250}
            height={250}
            alt={"sidebar footer"}
          />
        </div>
      </ScrollArea>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard</p>
    </div>
  );
};

function SidebarTeamsSection() {
  return (
    <div className="feature-Events mb-3">
      <div className="feature-lablel text-lg font-bold text-slate-400 hover:text-slate-600 flex justify-between">
        <div className="flex items-center">
          <UsersRound className="inline-block" />
          <span className="pl-3 ">Teams</span>
        </div>
        <ChevronRight className="ml-6" />
      </div>
      <div className="text-lg font-bold text-slate-400  ml-5 mt-3 border-l-[1px] border-slate-400 px-2">
        <div className="flex hover:text-slate-600">
          <Shirt />
          <span className="pl-3">All Teams</span>
        </div>
        <hr className="font-bold mt-2 mb-1" />
        <CreateTeamPopup />
        <div className="flex hover:text-slate-600">
          <UserRoundPlus />
          <span className="pl-3">Add Members</span>
        </div>
        <div className="flex hover:text-slate-600">
          <UserRoundSearchIcon />
          <span className="pl-3">Find Teams</span>
        </div>
      </div>
    </div>
  );
}
function SidebarEventsSection() {
  return (
    <div className="feature-Events-lookup mb-3">
      <div className="feature-lablel text-lg font-bold text-slate-400 hover:text-slate-600 flex justify-between">
        <div className="flex items-center">
          <Calendar className="inline-block" />
          <span className="pl-3 ">Events</span>
        </div>
        <ChevronRight className="ml-6" />
      </div>
      <div className="text-lg font-bold text-slate-400  ml-5 mt-3 border-l-[1px] border-slate-400 px-2">
        <div className="flex hover:text-slate-600">
          <Search />
          <span className="pl-3">Active Events</span>
        </div>
        <div className="flex my-3 hover:text-slate-600">
          <ScissorsLineDashedIcon />
          <span className="pl-3">Previous Events</span>
        </div>
        <hr className="mt-2 mb-1" />
        <div className="flex my-3 hover:text-slate-600">
          <MapPin />
          <span className="pl-3">Register Event</span>
        </div>
      </div>
    </div>
  );
}

function SidebarProjectsSection() {
  return (
    <div className="feature-Projects-lookup mb-3">
      <div className="feature-lablel text-lg font-bold text-slate-400 hover:text-slate-600 flex justify-between">
        <div className="flex items-center">
          <ChartSpline className="inline-block" />
          <span className="pl-3 ">Projects</span>
        </div>
        <ChevronRight className="ml-6" />
      </div>
      <div className="text-lg font-bold text-slate-400  ml-5 mt-3 border-l-[1px] border-slate-400 px-2">
        <div className="flex hover:text-slate-600">
          <Search />
          <span className="pl-3">My Projects</span>
        </div>
        <div className="flex my-3 hover:text-slate-600">
          <MapPin />
          <span className="pl-3">Create Project</span>
        </div>
      </div>
    </div>
  );
}

function SidebarProfileSection({ session }: { session: Session }) {
  const [team, setTeam] = useState<null | Team>(null);
  const [members, setMembers] = useState<IUser[]>([]);

  async function getTeamInfo() {
    // fetch team info
    const res = await axios.get("/api/team/my", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        userId: session.user?.id,
      },
    });
    console.log("pages/dashboard-> res: ", res);
    if (!res.data) {
      //@ts-ignore
      console.log(res?.message);
    }
    setTeam(res.data);
    // fetch team members
  }
  return (
    <div className="feature-Profile-lookup mb-3">
      <div className="feature-lablel text-lg font-bold text-slate-400 hover:text-slate-600 flex justify-between">
        <div className="flex items-center">
          <UserRound className="inline-block" />
          <span className="pl-3 ">Profile</span>
        </div>
        <ChevronRight className="ml-6" />
      </div>
      <div className="text-lg font-bold text-slate-400 ml-5 mt-3 border-l-[1px] border-slate-400 px-2">
        <AlertDialog>
          <AlertDialogTrigger
            onClick={getTeamInfo}
            className="flex hover:text-slate-600"
          >
            <ShieldHalf />
            <span className="pl-3">Your Team</span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex gap-2 items-center">
                <Avatar>
                  <AvatarImage src={team?.image ?? ""} />
                  <AvatarFallback>UR</AvatarFallback>
                </Avatar>
                {team?.name ?? "Team Name"}
              </AlertDialogTitle>
              <div className="team-members-lookup flex-col gap-2">
                {members.map((member) => (
                  <div className="member-info flex gap-2 items-center justify-start">
                    <Avatar>
                      <AvatarImage src={member?.image ?? ""} />
                      <AvatarFallback>UR</AvatarFallback>
                    </Avatar>
                    <span>{member?.name}</span>
                    <span>{member?.email}</span>
                  </div>
                ))}
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex my-3 hover:text-slate-600">
          <Avatar>
            <AvatarImage src={session.user?.image ?? ""} />
            <AvatarFallback>UR</AvatarFallback>
          </Avatar>
          <span className="pl-3">{session.user?.name ?? "Loading..."}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
