import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import { SidebarProvider } from "@/components/providers/SidebarProvider";

export const metadata: Metadata = {
  title: "Learning Management System/Dashboard",
  description: "Dashboard of learning management system",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <SidebarProvider>
        <div className="h-full">{children}</div>
      </SidebarProvider>
      <SanityLive />
    </ClerkProvider>
  );
}
