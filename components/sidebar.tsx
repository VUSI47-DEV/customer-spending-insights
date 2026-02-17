"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Target,
  Settings,
  HelpCircle,
  Search,
  ChevronDown,
  CreditCard,
  MoreHorizontal,
} from "lucide-react";
import type { CustomerProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface SidebarProps {
  profile: CustomerProfile;
}

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Analytics", icon: TrendingUp, href: "/analytics" },
  { label: "Transactions", icon: Receipt, href: "/transactions" },
  { label: "Goals", icon: Target, href: "/goals" },
];

const financeNav = [
  { label: "Cards & Accounts", icon: CreditCard },
  { label: "Reports", icon: TrendingUp },
];

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-sidebar-foreground">
              {/* blue text */}
              <span className="text-blue-500">Capy</span>
              {/* red text */}
              <span className="text-red-500">Insights</span>
            </span>
          
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sidebar-foreground/40" />
            <Input
              type="text"
              placeholder="Search..."
              className="h-8 border-sidebar-border bg-sidebar-accent/50 pl-8 text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus-visible:ring-sidebar-ring"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1 px-3">
          <p className="mb-1 px-2 text-[11px] font-medium text-sidebar-foreground/40">
            Overview
          </p>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Separator className="mx-4 my-3 bg-sidebar-border" />

        {/* Finance Section */}
        <nav className="flex flex-col gap-1 px-3">
          <p className="mb-1 px-2 text-[11px] font-medium text-sidebar-foreground/40">
            Finance
          </p>
          {financeNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
          <button className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground/60">
            <MoreHorizontal className="h-4 w-4 shrink-0" />
            <span>More</span>
          </button>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom links */}
        <div className="flex flex-col gap-1 px-3 pb-3">
          <Separator className="mb-3 bg-sidebar-border" />
          {[
            { label: "Settings", icon: Settings },
            { label: "Get Help", icon: HelpCircle },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User profile footer */}
        <div className="border-t border-sidebar-border px-4 py-3">
          <button className="flex w-full items-center gap-3 rounded-lg p-1 transition-colors hover:bg-sidebar-accent/50">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/images/pexels-dennisshotit-10415856.jpg"
                alt={profile.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col text-left">
              <span className="text-xs font-semibold text-sidebar-foreground">
                {profile.name}
              </span>
              <span className="text-[11px] text-sidebar-foreground/50">
                {profile.email}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-sidebar-foreground/40" />
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
}
