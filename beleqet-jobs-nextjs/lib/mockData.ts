export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full Time" | "Part Time" | "Remote" | "Hybrid" | "On-site" | "Contract";
  category: string;
  postedAgo: string;
  featured?: boolean;
  description?: string;
  tags?: string[];
};
