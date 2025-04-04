import { action } from "./_generated/server";
import { v } from "convex/values";

export interface WebSearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  domains: string[];
  source: "WEB";
  snippet: string;
  lastUpdated: string;
  createdAt: number;
}

export const searchWeb = action({
  args: {
    query: v.string(),
    domains: v.array(v.string()),
    page: v.number(),
  },
  async handler(ctx, args): Promise<WebSearchResult[]> {
    try {
      if (!process.env.SERPAPI_KEY) {
        console.error("SERPAPI_KEY is not configured");
        throw new Error("Search service is not properly configured");
      }

      // Build search query
      let searchQuery = args.query;
      
      if (args.domains.length > 0) {
        const domainQueries = args.domains.map(domain => 
          `site:${domain.toLowerCase().replace(/[\s&()]/g, '-')}.com`
        );
        searchQuery = `${searchQuery} ${domainQueries.join(' OR ')}`;
      }

      console.log("Web search query:", searchQuery);
      console.log("Using SerpAPI key:", process.env.SERPAPI_KEY ? "Present" : "Missing");

      const url = `https://serpapi.com/search.json?q=${encodeURIComponent(searchQuery)}&api_key=${process.env.SERPAPI_KEY}&page=${args.page}&num=10`;
      console.log("Request URL:", url);

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", {
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length'),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('SerpAPI Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Search service error: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data = await response.json();
      console.log("SerpAPI response:", JSON.stringify(data, null, 2));
      
      if (!data.organic_results || !Array.isArray(data.organic_results)) {
        console.error('Invalid response format from SerpAPI:', data);
        return [];
      }

      const results = data.organic_results.map((result: any, index: number) => ({
        id: `web-${index}-${Date.now()}`,
        title: result.title || "Untitled",
        description: result.snippet || "No description available",
        url: result.link || "#",
        domains: args.domains,
        source: "WEB" as const,
        snippet: result.snippet || "No snippet available",
        lastUpdated: new Date().toISOString(),
        createdAt: Date.now(),
      }));

      console.log("Processed results:", results);
      return results;

    } catch (error) {
      console.error('Web search error:', error);
      throw error;
    }
  }
}); 