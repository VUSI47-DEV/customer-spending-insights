"use client";

import { type ReactNode } from "react";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/theme-toggle";
import api, { CUSTOMER_ID } from "@/lib/api";
import { Loader2, Bell, Plus, Menu, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function PageLayout({ title, children, actions }: PageLayoutProps) {
  const { data: profile, isPending: profileLoading } = api.useQuery(
    "get",
    "/api/customers/{customerId}/profile",
    { params: { path: { customerId: CUSTOMER_ID } } },
  );

  if (profileLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-4 w-40" />
            <Skeleton className="mx-auto h-3 w-28" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-[240px] shrink-0 border-r border-sidebar-border bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <Sidebar profile={profile} />
      </aside>

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
          {/* Page header row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Mobile menu trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px] bg-sidebar p-0">
                  <Sidebar profile={profile} />
                </SheetContent>
              </Sheet>

              {/* Mobile logo */}
              <div className="flex items-center gap-2 lg:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-base font-semibold">
                  <span className="text-blue-500">Capy</span>
                  <span className="text-red-500">Insights</span>
                </span>
              </div>

              <h1 className="hidden text-xl font-semibold tracking-tight text-foreground lg:block">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {actions}
            
              <ThemeToggle />
              <Button size="sm" className="hidden gap-1.5 sm:inline-flex">
                <Plus className="h-4 w-4" />
                Quick Create
              </Button>
              <Button size="icon" className="h-9 w-9 sm:hidden">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
