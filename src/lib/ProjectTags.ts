// ProjectTags.ts
import { z } from "zod";
export type ProjectType =
  | "Ai"
  | "Web"
  | "Mobile"
  | "Game"
  | "Ai-Aerospace"
  | "Full Stack"
  | "MERN"
  | "SASS"
  | "MicroSass"
  | "Cloud"
  | "DevOps"
  | "Data"
  | "ML"
  | "DL"
  | "CV"
  | "NLP"
  | "Blockchain"
  | "AR"
  | "VR"
  | "IoT"
  | "Robotics"
  | "CyberSecurity"
  | "Quantum"
  | "HealthTech"
  | "FinTech"
  | "EduTech"
  | "AgriTech"
  | "SmartCity"
  | "GreenTech"
  | "BioTech"
  | "LegalTech"
  | "TravelTech"
  | "FoodTech"
  | "SportsTech"
  | "Entertainment"
  | "SocialGood"
  | "E-commerce"
  | "SupplyChain"
  | "Logistics"
  | "RealEstate"
  | "HRTech"
  | "MarketingTech"
  | "AdTech"
  | "others";

export const zodProjectTagSchema = z.enum([
  "Ai",
  "Web",
  "Mobile",
  "Game",
  "Ai-Aerospace",
  "Full Stack",
  "MERN",
  "SASS",
  "MicroSass",
  "Cloud",
  "DevOps",
  "Data",
  "ML",
  "DL",
  "CV",
  "NLP",
  "Blockchain",
  "AR",
  "VR",
  "IoT",
  "Robotics",
  "CyberSecurity",
  "Quantum",
  "HealthTech",
  "FinTech",
  "EduTech",
  "AgriTech",
  "SmartCity",
  "GreenTech",
  "BioTech",
  "LegalTech",
  "TravelTech",
  "FoodTech",
  "SportsTech",
  "Entertainment",
  "SocialGood",
  "E-commerce",
  "SupplyChain",
  "Logistics",
  "RealEstate",
  "HRTech",
  "MarketingTech",
  "AdTech",
]);
