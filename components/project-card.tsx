import { GitHubProject, ManualProject, WebProject } from "@/types/project";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FileIcon, GlobeIcon } from "lucide-react";

interface ProjectCardProps {
  project: GitHubProject | ManualProject | WebProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isGitHub = project.source === "GITHUB";
  const isWeb = project.source === "WEB";

  return (
    <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        {isGitHub ? (
          <GitHubLogoIcon className="h-4 w-4" />
        ) : isWeb ? (
          <GlobeIcon className="h-4 w-4" />
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
            className="bg-vault-light px-2 py-1 rounded-full text-xs"
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

      {isWeb && (
        <div className="flex gap-2 mt-2 text-xs text-gray-500">
          <span>
            Updated: {new Date((project as WebProject).lastUpdated).toLocaleDateString()}
          </span>
        </div>
      )}

      <a 
        href={project.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-vault-medium hover:underline mt-2 block text-sm"
      >
        {isGitHub ? "View Repository" : isWeb ? "Visit Website" : "Download File"}
      </a>
    </div>
  );
} 