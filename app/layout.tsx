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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
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
    <div className="border-b border-vault-light bg-vault-medium">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-vault-dark text-[14px] font-bold">ProjectVault</div>
        <OrganizationSwitcher createOrganizationMode={undefined} /> 
      </div>
    </div>
  );
}
