import { GitHubProject, ManualProject } from "@/types/project";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FileIcon } from "lucide-react";

interface ProjectCardProps {
  project: GitHubProject | ManualProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isGitHub = project.source === "GITHUB";

  return (
    <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        {isGitHub ? (
          <GitHubLogoIcon className="h-4 w-4" />
        ) : (
          <FileIcon className="h-4 w-4" />
        )}
        <h3 className="font-medium truncate">{project.title}</h3>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
        {project.description}
      </p>

      <div className="flex gap-1 mt-2 flex-wrap">
        {project.domains.map((domain) => (
          <span 
            key={domain} 
            className="bg-gray-100 px-2 py-1 rounded-full text-xs"
          >
            {domain}
          </span>
        ))}
      </div>

      {isGitHub && (
        <div className="flex gap-2 mt-2 text-xs text-gray-500">
          <span>⭐ {(project as GitHubProject).stars}</span>
          <span>
            Updated: {new Date((project as GitHubProject).lastUpdated).toLocaleDateString()}
          </span>
        </div>
      )}

      <a 
        href={project.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-2 block text-sm"
      >
        {isGitHub ? "View Repository" : "Download File"}
      </a>
    </div>
  );
} 