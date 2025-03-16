"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function TestPage() {
  const migrate = useMutation(api.migration.migrateFiles);
  const createFile = useMutation(api.projects.createFile);
  const files = useQuery(api.projects.getFiles);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Database Test Page</h1>
      
      <div className="space-y-4">
        <button 
          onClick={() => migrate()}
          className="bg-blue-500 text-white px-4 py-2 rounded block"
        >
          Migrate Files
        </button>

        <button 
          onClick={() => createFile({ name: "test file" })}
          className="bg-green-500 text-white px-4 py-2 rounded block"
        >
          Create Test File
        </button>

        <div>
          <h2 className="text-lg mb-2">Current Files:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(files, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 