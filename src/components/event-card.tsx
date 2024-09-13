import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
const EventCard = (props: {
  id: string;
  name: string;
  createdAt: Date;
  date: Date;
  location: string;
  teamsApplied: number;
}) => {
  const date = new Date(props.date);
  const formattedDate = (date: Date | string) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    const formatedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formatedDate;
  };

  return (
    <div className="bg-sky-50 rounded-xl w-full  lg:w-3/4  mr-2 border-[1px] border-violet-400 p-2 my-3 w-full">
      <div className="event-log flex flex-col lg:flex-row justify-between">
        <h3 className="text-2xl  font-bold bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
          {props.name}
        </h3>
        <div>
          <Tag
            className={"bg-sky-400"}
            text={`Started at: ${formattedDate(props.createdAt)}`}
          />
        </div>
      </div>
      <div className="event-details my-4">
        <Tag
          className={"bg-white"}
          text={`Ending at: ${formattedDate(props.date)}`}
        />
        <Tag className="bg-white" text={`Location: ${props.location}`} />
      </div>
      <Link href={{ pathname: `events/${props.id}` }}>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 mt-2"
        >
          Event Info
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
};
interface TagProps {
  className?: string;
  text: string;
}
const Tag: React.FC<TagProps> = ({ className, text }) => {
  return (
    <div
      className={`px-3 py-1 w-full lg:max-w-min lg:inline rounded-full border-[1px] border-slate-200 mr-2 mt-2  ${className}`}
    >
      {text}
    </div>
  );
};

export default EventCard;
