export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
  created_at: string;
}

export interface GitHubProject {
  id: string;
  title: string;
  description: string;
  url: string;
  domains: string[];
  source: "GITHUB";
  topics: string[];
  stars: number;
  lastUpdated: string;
  createdAt: number;
} 