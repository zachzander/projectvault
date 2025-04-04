"use client";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UploadDialog } from "@/components/upload-dialog";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/multi-select";
import { domains } from "@/convex/schema";
import { ProjectCard } from "@/components/project-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { GitHubProject, WebProject } from "@/types/project";

// Define source types
type Source = "ALL" | "GITHUB" | "MANUAL_UPLOAD" | "WEB";

// Define File type based on your schema
interface File {
  _id: string;
  title: string;
  type: string;
  url: string;
  domains: string[];
  size: number;
  createdAt: number;
  description?: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<Source>("ALL");
  const [page, setPage] = useState(1);
  const [githubResults, setGithubResults] = useState<any[]>([]);
  const [webResults, setWebResults] = useState<WebProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add null coalescing to handle undefined
  const files = useQuery(api.files.getFiles) ?? [];
  const searchGithub = useAction(api.github.searchProjects);
  const searchWeb = useAction(api.web.searchWeb);

  const fetchGithubProjects = useCallback(async () => {
    if (selectedSource === "MANUAL_UPLOAD" || selectedSource === "WEB") return;
    
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchGithub({
        query: searchQuery || "projects",
        domains: selectedDomains,
        page,
      });
      console.log("GitHub search results:", results);

      if (page === 1) {
        setGithubResults(results);
      } else {
        setGithubResults(prev => [...prev, ...results]);
      }
    } catch (error) {
      console.error("Error fetching GitHub projects:", error);
      setError("Failed to fetch GitHub projects");
    } finally {
      setIsLoading(false);
    }
  }, [searchGithub, searchQuery, selectedDomains, page, selectedSource]);

  const fetchWebResults = useCallback(async () => {
    if (selectedSource === "MANUAL_UPLOAD" || selectedSource === "GITHUB") return;
    
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchWeb({
        query: searchQuery || "projects",
        domains: selectedDomains,
        page,
      });
      console.log("Web search results:", results);

      if (page === 1) {
        setWebResults(results);
      } else {
        setWebResults(prev => [...prev, ...results]);
      }
    } catch (error) {
      console.error("Error fetching web results:", error);
      setError("Failed to fetch web results");
    } finally {
      setIsLoading(false);
    }
  }, [searchWeb, searchQuery, selectedDomains, page, selectedSource]);

  // Fetch results when search params change
  useEffect(() => {
    if (selectedSource === "MANUAL_UPLOAD") return;
    
    setPage(1);
    if (selectedSource === "GITHUB" || selectedSource === "ALL") {
      fetchGithubProjects();
    }
    if (selectedSource === "WEB" || selectedSource === "ALL") {
      fetchWebResults();
    }
  }, [searchQuery, selectedDomains, selectedSource]);

  // Load more handler
  const handleLoadMore = () => {
    setPage(p => p + 1);
    if (selectedSource === "GITHUB" || selectedSource === "ALL") {
      fetchGithubProjects();
    }
    if (selectedSource === "WEB" || selectedSource === "ALL") {
      fetchWebResults();
    }
  };

  // Filter files safely
  const filteredFiles = files.filter((file: File) => {
    if (selectedSource === "GITHUB" || selectedSource === "WEB") return false;
    
    const matchesSearch = searchQuery 
      ? file.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesDomains = selectedDomains.length === 0 || 
      file.domains.some(domain => selectedDomains.includes(domain));
    
    return matchesSearch && matchesDomains;
  });

  return (
    <ErrorBoundary>
      <div className="p-4">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {/* Source Selection */}
        <div className="flex justify-between items-center mb-4">
          <Tabs 
            value={selectedSource} 
            onValueChange={(value) => setSelectedSource(value as Source)} 
            className="border-vault-dark"
          >
            <TabsList className="bg-vault-light">
              <TabsTrigger 
                value="ALL" 
                className="text-black data-[state=active]:bg-vault-dark data-[state=active]:text-white"
              >
                All Sources
              </TabsTrigger>
              <TabsTrigger 
                value="GITHUB" 
                className="text-black data-[state=active]:bg-vault-dark data-[state=active]:text-white"
              >
                GitHub
              </TabsTrigger>
              <TabsTrigger 
                value="WEB" 
                className="text-black data-[state=active]:bg-vault-dark data-[state=active]:text-white"
              >
                Web Search
              </TabsTrigger>
              <TabsTrigger 
                value="MANUAL_UPLOAD" 
                className="text-black data-[state=active]:bg-vault-dark data-[state=active]:text-white"
              >
                Manual Uploads
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <UploadDialog />
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 items-start mb-6">
          <Input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="w-72">
            <MultiSelect
              options={domains.map(domain => ({
                label: domain,
                value: domain,
              }))}
              selected={selectedDomains}
              onChange={setSelectedDomains}
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Manual Uploads */}
          {filteredFiles?.map(file => (
            <ProjectCard
              key={file._id}
              project={{
                id: file._id,
                title: file.title,
                description: file.description || `File type: ${file.type}`,
                url: file.url,
                domains: file.domains,
                source: "MANUAL_UPLOAD",
                fileUrl: file.url,
                size: file.size,
                createdAt: file.createdAt,
              }}
            />
          ))}
          
          {/* GitHub Projects */}
          {(selectedSource === "GITHUB" || selectedSource === "ALL") && githubResults.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

          {/* Web Search Results */}
          {(selectedSource === "WEB" || selectedSource === "ALL") && webResults.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

          {/* No Results Message */}
          {filteredFiles.length === 0 && githubResults.length === 0 && webResults.length === 0 && (
            <div className="col-span-3 text-center py-4">
              {isLoading ? "Loading..." : "No projects found"}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">Loading...</div>
        )}

        {/* Load More Button */}
        {(selectedSource === "GITHUB" || selectedSource === "WEB" || selectedSource === "ALL") && 
         (githubResults.length > 0 || webResults.length > 0) && (
          <div className="mt-6 text-center">
            <button 
              onClick={handleLoadMore}
              className="px-4 py-2 border border-vault-light rounded-md hover:bg-vault-dark hover:bg-opacity-5 text-vault-dark transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
