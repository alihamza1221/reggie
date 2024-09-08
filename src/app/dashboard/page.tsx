import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { PieChart } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { SquareActivity } from "lucide-react";
import { FilePieChart } from "lucide-react";
const Dashboard = () => {
  return (
    <div className="flex justify-start">
      <ScrollArea className="">
        <div className="side-bar pt-6 px-3 w-[250px] h-[100vh]  border-r-[1px] border-slate-200">
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
          </div>
        </div>

        <div className="side-bar-b-svg absolute left-0 bottom-0">
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

export default Dashboard;
