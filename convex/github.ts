import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { GitHubRepo, GitHubProject } from "@/types/github";

// GitHub API response types
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
  created_at: string;
}

export const searchProjects = mutation({
  args: {
    query: v.string(),
    domains: v.array(v.string()),
    page: v.number(),
  },
  async handler(ctx, args): Promise<GitHubProject[]> {
    try {
      // Basic search query with minimum stars to ensure quality results
      let searchQuery = args.query || "stars:>10";

      // Add domain filters if selected
      if (args.domains.length > 0) {
        const domainQueries = args.domains.map(domain => 
          `topic:${domain.toLowerCase().replace(/[\s&()]/g, '-')}`
        );
        searchQuery = `${searchQuery} ${domainQueries.join(' ')}`;
      }

      console.log("GitHub Search Query:", searchQuery);
      console.log("Using PAT:", process.env.GITHUB_PAT ? "Token exists" : "No token found");

      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&page=${args.page}&per_page=30&sort=stars`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_PAT}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'ProjectVault'
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`GitHub API error: ${response.status} ${errorText}`);
      }

      const data = await response.json() as { items: GitHubRepo[] };
      
      console.log(`Found ${data.items?.length || 0} GitHub repositories`);
      
      return data.items.map((item: GitHubRepo): GitHubProject => ({
        id: item.id.toString(),
        title: item.name,
        description: item.description || "No description available",
        url: item.html_url,
        domains: args.domains,
        source: "GITHUB" as const,
        topics: item.topics || [],
        stars: item.stargazers_count,
        lastUpdated: item.updated_at,
        createdAt: new Date(item.created_at).getTime(),
      }));

    } catch (error) {
      console.error('GitHub search error:', error);
      return [];
    }
  },
}); 