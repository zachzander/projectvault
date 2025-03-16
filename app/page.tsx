"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UploadDialog } from "@/components/upload-dialog";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/multi-select";
import { domains } from "@/convex/schema";
import { ProjectCard } from "@/components/project-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { GitHubProject } from "@/types/github";

// Define source types
type Source = "ALL" | "GITHUB" | "MANUAL_UPLOAD";

// Define File type based on your schema
interface File {
  _id: string;
  title: string;
  type: string;
  url: string;
  domains: string[];
  size: number;
  createdAt: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<Source>("ALL");
  const [page, setPage] = useState(1);
  const [githubResults, setGithubResults] = useState<GitHubProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add null coalescing to handle undefined
  const files = useQuery(api.files.getFiles) ?? [];
  const searchGithub = useMutation(api.github.searchProjects);

  const fetchGithubProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await searchGithub({
        query: searchQuery,
        domains: selectedDomains,
        page,
      });
      if (page === 1) {
        setGithubResults(results);
      } else {
        setGithubResults(prev => [...prev, ...results]);
      }
    } catch (error) {
      console.error("Error fetching GitHub projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchGithub, searchQuery, selectedDomains, page]);

  useEffect(() => {
    if (selectedSource !== "MANUAL_UPLOAD") {
      setPage(1);
      fetchGithubProjects();
    }
  }, [searchQuery, selectedDomains, selectedSource, fetchGithubProjects]);
  
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Filter files safely
  const filteredFiles = files.filter((file: File) => {
    if (selectedSource === "GITHUB") return false;
    
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
        {/* Source Selection */}
        <div className="flex justify-between items-center mb-4">
          <Tabs value={selectedSource} onValueChange={(value) => setSelectedSource(value as Source)}>
            <TabsList>
              <TabsTrigger value="ALL">All Sources</TabsTrigger>
              <TabsTrigger value="GITHUB">GitHub</TabsTrigger>
              <TabsTrigger value="MANUAL_UPLOAD">Manual Uploads</TabsTrigger>
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
            className="flex-1"
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
          {selectedSource !== "GITHUB" && filteredFiles.map((file: File) => (
            <ProjectCard
              key={file._id}
              project={{
                id: file._id,
                title: file.title,
                description: `File type: ${file.type}`,
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
          {selectedSource !== "MANUAL_UPLOAD" && githubResults.map((project: GitHubProject) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

          {/* No Results Message */}
          {filteredFiles.length === 0 && githubResults.length === 0 && (
            <div className="col-span-3 text-center py-4">
              {isLoading ? "Loading..." : "No projects found"}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {selectedSource !== "MANUAL_UPLOAD" && githubResults.length > 0 && (
          <div className="mt-6 text-center">
            <button 
              onClick={handleLoadMore}
              className="px-4 py-2 border rounded hover:bg-gray-50"
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
