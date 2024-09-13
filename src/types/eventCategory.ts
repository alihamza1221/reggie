import { z } from "zod";
export type TechEventType =
  | "Workshop"
  | "Meetup"
  | "Conference"
  | "Hackathon"
  | "CodingCompetition"
  | "Webinar"
  | "Seminar"
  | "NetworkingEvent"
  | "TechTalk"
  | "Bootcamp";

export const zodTechEventTypeSchema = z.enum([
    "Workshop",
    "Meetup",
    "Conference",
    "Hackathon",
    "CodingCompetition",
    "Webinar",
    "Seminar",
    "NetworkingEvent",
    "TechTalk",
    "Bootcamp",
    ]);
])