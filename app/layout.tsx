import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ConvexClientProvider } from "./components/ConvexClientProvider"; 
import { Header } from "./header";
import { OrganizationSwitcher } from '@clerk/nextjs'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "ProjectVault",
  description: "A platform for discovering and sharing projects",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ConvexClientProvider>  
          <Header/>
           {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}

export function LocalHeader() {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="container mx-auto flex items-center justify-between">
        <div>ProjectVault</div>
        <OrganizationSwitcher createOrganizationMode={undefined} /> 
      </div>
    </div>
  );
}
