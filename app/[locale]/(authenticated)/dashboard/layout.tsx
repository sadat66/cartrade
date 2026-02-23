import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">{children}</main>
  );
}
