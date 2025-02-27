import { UserButton } from "@clerk/nextjs";
export function Header() {
    return ( 
    <div className="border-b py-4 bg-gray-50">
         <div className="items-center container mx-auto justify-between flex">
            ProjectVault
            <UserButton />
         </div>
    </div>
    );
}