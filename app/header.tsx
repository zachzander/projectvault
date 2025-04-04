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
    <div className="border-b border-vault-light/20 py-4 bg-white">

      <div className="items-center container mx-auto justify-between flex">
        <Link href="/" className="flex gap-2 items-center text-xl text-vault-dark">
          ProjectVault
        </Link>

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
