"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  Calendar,
  ChartSpline,
  MapPin,
  PieChart,
  Router,
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
import axios, { AxiosError } from "axios";
import { AddMembersPopup } from "@/components/add-members-popup";
import GPTCommandPopup from "@/components/ui/user-input-cmd";
import { useRouter } from "next/navigation";
const Dashboard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
      {children}
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
        <AddMembersPopup />
        <div className="flex hover:text-slate-600">
          <UserRoundSearchIcon />
          <span className="pl-3">Find Teams</span>
        </div>
      </div>
    </div>
  );
}
const handleuserInputSubmit = (
  userInput: string,
  type: string = "Register"
) => {
  console.log(userInput);
};
function SidebarEventsSection() {
  const router = useRouter();
  function handleClick(eventStatus: "ActiveEvents" | "PreviousEvents") {
    router.push(`/dashboard/events?type=${eventStatus}`);
  }
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
        <div
          className="flex hover:text-slate-600 cursor-pointer"
          onClick={() => handleClick("ActiveEvents")}
        >
          <Search />
          <span className="pl-3">Active Events</span>
        </div>
        <div
          className="flex my-3 hover:text-slate-600 cursor-pointer"
          onClick={() => handleClick("PreviousEvents")}
        >
          <ScissorsLineDashedIcon />
          <span className="pl-3">Previous Events</span>
        </div>
        <hr className="mt-2 mb-1" />
        <div className="flex my-3 hover:text-slate-600">
          <GPTCommandPopup onSubmit={handleuserInputSubmit} />
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
  const [membersInfo, setMembersInfo] = useState<IUser[]>([]);

  async function getTeamInfo() {
    try {
      // fetch team info
      const res = await axios.get("/api/team/my", {
        params: {
          userId: session.user?.id,
        },
      });
      // res = res<object>.data<object>.data<Array>
      if (!res.data?.data) {
        console.log(res.data?.message);
      }
      setTeam(res.data.data[0]);
      const { members } = res.data.data[0];

      // fetch team members
      const response = await axios.post("/api/members", {
        headers: {
          "Content-Type": "application/json",
        },
        //memberIds: z.array(z.string()).default([]),
        memberIds: members,
      });

      if (!response.data?.data) {
        console.log(response.data?.message);
      }

      setMembersInfo(response.data.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      console.log(axiosError.response?.data);
    }
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
              <AlertDialogTitle className="flex gap-2 items-center  border-b-2 border-slate-200 shadow-md py-3 px-2">
                <Avatar
                  style={{
                    height: "60px",
                    width: "60px",
                  }}
                >
                  <AvatarImage src={team?.image ?? ""} />
                  <AvatarFallback>UR</AvatarFallback>
                </Avatar>
                {team?.name ?? "Team Name"}
              </AlertDialogTitle>
              <div className="team-members-lookup flex-col gap-2">
                <span className="bg-slate-800 text-white border-1 rounded-full px-2 py-1 mb-3">
                  Members
                </span>
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
