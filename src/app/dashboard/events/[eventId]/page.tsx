"use client";
import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon, MapPinIcon, TagIcon, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IEvent } from "@/db/models/event";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
export default function EventInfoPage() {
  const pathname = usePathname();
  console.log("search params: ", pathname);

  const eventId = pathname.split("/").pop();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const reqEventsData = async () => {
      try {
        const res = await axios.get(`/api/regEvents/${eventId}`);
        setEvent(res.data.data as IEvent);
        setLoading(false);
      } catch (err) {
        const error = err as AxiosError;
        console.error(error.response?.data);
        setLoading(false);
      }
    };
    reqEventsData();
  }, []);
  const formatDate = (dateValue: Date | string | undefined) => {
    if (!dateValue) return "Date not available";
    if (dateValue instanceof Date) {
      return isValid(dateValue) ? format(dateValue, "PPP") : "Invalid Date";
    }
    if (typeof dateValue === "string") {
      const parsedDate = parseISO(dateValue);
      return isValid(parsedDate) ? format(parsedDate, "PPP") : "Invalid Date";
    }
    return "Invalid Date";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {event?.name || "Untitled Event"}
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(event?.date)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            {event?.description || "No description available"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-5 h-5 text-gray-500" />
              <span>{event?.location || "Location not specified"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-gray-500" />
              <span>Created by: {event?.userId || "Unknown"}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <h3 className="font-semibold">Event Details</h3>
            <div>
              <strong>Category:</strong> {event?.category || "Uncategorized"}
            </div>
            <div>
              <strong>Created At:</strong> {formatDate(event?.createdAt)}
            </div>
            <div>
              <strong>Teams Applied:</strong>{" "}
              {event?.TeamsApplied_id.length || 0}
            </div>
            <div>
              <strong>Teams Accepted:</strong>{" "}
              {event?.TeamsAccepted_id?.length || 0}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-wrap gap-2">
            <TagIcon className="w-5 h-5 text-gray-500" />
            {event?.tags && event?.tags.length > 0 ? (
              event?.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">No tags</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
