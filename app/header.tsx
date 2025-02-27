import { OrganizationProfile,UserButton } from "@clerk/nextjs";
export function Header() {
    return ( 
    <div className="border-b py-4 bg-gray-50">
         <div className="items-center container mx-auto justify-between flex">
                <div>ProjectVault</div>
                <div className="flex gap-2">
                <OrganizationProfile />
                <UserButton />
                </div>              
         </div>
    </div>
    );
}