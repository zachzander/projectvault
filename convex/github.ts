import { action } from "./_generated/server";
import { v } from "convex/values";
import type { GitHubProject } from "./types";

export const searchProjects = action({
  args: {
    query: v.string(),
    domains: v.array(v.string()),
    page: v.number(),
  },
  async handler(ctx, args): Promise<GitHubProject[]> {
    try {
      // Build search query
      let searchQuery = "stars:>100";
      
      if (args.query) {
        searchQuery = `${args.query} ${searchQuery}`;
      }
      
      if (args.domains.length > 0) {
        const domainQueries = args.domains.map(domain => 
          `topic:${domain.toLowerCase().replace(/[\s&()]/g, '-')}`
        );
        searchQuery = `${searchQuery} ${domainQueries.join(' ')}`;
      }

      console.log("GitHub search query:", searchQuery);

      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&page=${args.page}&per_page=30&sort=stars&order=desc`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_PAT}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'ProjectVault'
          },
        }
      );

      if (!response.ok) {
        console.error('GitHub API Error:', response.status);
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("GitHub API response:", data);
      
      if (!data.items) {
        console.error('No items in GitHub response');
        return [];
      }

      return data.items.map((item: any) => ({
        id: item.id.toString(),
        title: item.name,
        description: item.description || "",
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