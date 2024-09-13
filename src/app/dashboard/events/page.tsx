"use client";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { Circle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Twitch } from "lucide-react";
import { FlagTriangleRight } from "lucide-react";
import { IEvent } from "@/db/models/event";
import { useState, useEffect } from "react";
import EventCard from "@/components/event-card";
import { ScrollArea } from "@/components/ui/scroll-area";
const Events = () => {
  const searchParams = useSearchParams();

  const eventStatus: string | null = searchParams.get("eventStatus");

  const [events, setEvents] = useState<IEvent[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const reqEventsData = async () => {
      try {
        const res = await axios.get(`/api/regEvents`);

        setEvents(res.data.data);
        console.log("res.data.data: ", res.data.data);
        console.log("events: ", events);
        setLoading(false);
      } catch (err) {
        const error = err as AxiosError;
        console.error(error.response?.data);
        setLoading(false);
      }
    };
    reqEventsData();
  }, []);

  return (
    <ScrollArea className="">
      <div className="dashboard-events flex gap-2 w-[calc(100vw-250px)] bg-blue-50 bg-opacity-60 flex-col">
        <div className="events-lookup-header overflow-hidden w-full relative">
          <div className="w-[90%] lg:w-[85%]   mt-4 mx-auto rounded-xl min-h-[200px] border-2  overflow-hidden z-10  bg-white shadow-md p-8 relative">
            <div className="event-info  border-slate-100 shadow-md w-full xl:w-[50%] rounded-xl p-4 lg:pr-10 h-full float-left  bg-sky-200/20 backdrop-blur-[6px]">
              <h1 className="event-title text-xl font-bold md:text-3xl my-3">
                Top Events Organized
              </h1>
              <span className="text-sm pb-1 border-b-[1px] mb-2">
                Last 3 months covering many events
              </span>
              <div className="pr-3 md:pr-6 mt-5">
                The top Events organized over last decade are garnering
                thousands
                <br />
                of viewer hours across diverse events by organizations around
                the world. <br /> Events Data is safe and publicly available.
              </div>
            </div>
            <div className="mt-10 recorded-stats w-full  xl:w-[50%] float-right z-1">
              <div className="w-full m-auto lg:w-[50%] py-4 px-6 rounded-2xl  backdrop-blur-[6px] bg-sky-200/20 shadow-md backdrop-blur-md text-2xl text-center ">
                <span className="mx-auto text-lg pb-1 border-b-[1px] border-slate-500 ">
                  Total Events
                </span>
                <div className="flex justify-center text-lg">
                  <Image
                    src="/wheat-left.svg"
                    width={100}
                    height={20}
                    alt={" logo"}
                  />

                  <div>
                    Events Organized
                    <br /> count <span className="text-amber-300">443</span>
                  </div>
                  <Image
                    src="/wheat-right.svg"
                    width={100}
                    height={20}
                    alt={"logo"}
                  />
                </div>
              </div>
            </div>

            <Circle
              className="bg-transparent top-0 right-0 translate-x-[30%] absolute translate-y-[-30%] text-cyan-200 "
              width={150}
              height={150}
            />
            <Circle
              className="bg-transparent bottom-0 left-0 translate-x-[-30%] absolute translate-y-[30%]  text-cyan-200 z-[-1]"
              width={150}
              height={150}
            />
          </div>
          <div className="background bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl  absolute bottom-[50%] right-[50%] w-[200px] h-[200px] blur-[150px] translate-x-[50%] translate-y-[-50%] z-0"></div>
        </div>

        <div className="hero-section w-[90%] lg:w-[85%]   mt-4 mx-auto relative">
          <div className="events-btn sticky top-1 z-1 bg-white p-4 flex items-center rounded-xl">
            <span className=" justify-self-start">
              <Button className="bg-sky-400 text-slate-500 hover:bg-sky-300 rounded-xl mr-3">
                <Twitch />
                Active Events
              </Button>
              <Button className="bg-white  text-slate-500 hover:bg-slate-100 rounded-xl">
                <FlagTriangleRight />
                Previous Events
              </Button>
            </span>

            <span className="text-2xl font-bold text-slate-800 ml-auto">
              {eventStatus} Events
            </span>
          </div>
          <div className="events-lookup-bg bg-white rounded-xl my-10 px-3 py-5">
            <div className="label text-xl font-bold mb-3">Recent Events</div>
            {events
              ?.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              ?.slice(0, 3)
              .map((event) => (
                <EventCard
                  id={event.id}
                  key={event.id}
                  name={event.name}
                  teamsApplied={event.TeamsApplied_id.length}
                  createdAt={event.createdAt}
                  date={event.date as Date}
                  location={event.location}
                />
              ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Events;
