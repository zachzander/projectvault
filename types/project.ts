export type ProjectSource = "GITHUB" | "MANUAL_UPLOAD";

export interface BaseProject {
  id: string;
  title: string;
  description: string;
  url: string;
  domains: string[];
  source: ProjectSource;
  createdAt: number;
}

export interface GitHubProject extends BaseProject {
  source: "GITHUB";
  topics: string[];
  stars: number;
  lastUpdated: string;
}

export interface ManualProject extends BaseProject {
  source: "MANUAL_UPLOAD";
  fileUrl: string;
  size: number;
} 