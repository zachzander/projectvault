import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  OrganizationSwitcher,
} from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <div className="relative z-10 border-b py-4 bg-gray-50">
      <div className="items-center container mx-auto justify-between flex">
        <Link href="/" className="flex gap-2 items-center text-xl text-black">
          ProjectVault
        </Link>

        <SignedIn>
          <Button variant={"outline"}>
            <Link href="/dashboard/files">Your Files</Link>
          </Button>
        </SignedIn>
        <div className="flex gap-2">
          <OrganizationSwitcher 
            createOrganizationMode={undefined}
            afterCreateOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
          />
          <UserButton afterSignOutUrl="/" />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
