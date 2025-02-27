"use client";
import { Button } from "@/components/ui/button";
import { SignOutButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";


export default function Home() {
  const files = useQuery(api.projects.getFiles);
  const createFile = useMutation(api.projects.createFile);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md bg-card text-card-foreground border border-border p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Welcome to My App</h1>
        <p className="text-muted-foreground text-center mt-2">
          Please sign in to continue.
        </p>

        <div className="mt-6 flex flex-col items-center space-y-4">
          <SignedIn>
            <SignOutButton>
              <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/80">
                Sign Out
              </Button>
            </SignOutButton>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          {files?.map((file) => {
              return <div key={file._id}>{file.name}</div>;
          })}

          <Button 
            onClick = {() => { 
              createFile ({
                name: "submit",
              });
          }}> 
              upload
          </Button>
        </div>
      </div>
    </main>
  );
}
