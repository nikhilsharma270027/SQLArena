"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Home, Trophy, BarChart3, Swords, Bug, Moon, Sun, Star, ChevronUp } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar, // 👈 import hook
} from "@/src/components/ui/sidebar";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "@radix-ui/react-separator";

const user = {
  name: "ravi2025123459905",
  email: "ravi202512345@gmail.com",
  rating: 0,
};

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "My Statistics", href: "/statistics", icon: BarChart3 },
  { name: "Battle History", href: "/battles", icon: Swords },
  { name: "Report a Bug", href: "/report", icon: Bug },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar(); // 👈 get collapsed/expanded state
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className={`relative h-screen ${isCollapsed ? "w-16" : "w-64"} transition-width duration-300`}>
      {/* SidebarTrigger - repositioned */}
      <div className="absolute left-12/12 top-2 z-20">
        <SidebarTrigger size="lg" />
      </div>

      <div className="border-b border-sidebar-border overflow-hidden">
        <div
          className={`
      transition-all duration-300 ease-in-out
      ${isCollapsed ? "h-16" : "h-auto"}
    `}>
          {!isCollapsed ? (
            <div className="flex flex-col gap-1 px-2 py-2 mb-2">
              <div className="flex flex-row items-center gap-1">
                <Image src="/sql.png" alt="logo" width={28} height={28} />
                <span className="line-clamp-1 text-xl font-rubik text-sidebar-foreground transition-opacity duration-300">
                  SQL Arena
                </span>
                {/* <span className="text-xl font-bold text-sidebar-foreground transition-opacity duration-300">
          </span> */}
              </div>
              {/* <div className="text-xs text-sidebar-foreground/60 transition-opacity duration-200 delay-50">
          by dev27
        </div> */}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center mb-2  transition-opacity duration-300 ease-in-out delay-500">
              <Image src="/sql.png" alt="logo" width={28} height={28} />
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarMenu className="px-2 py-4">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 5 }} transition={{ duration: 0.5 }}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="h-2 w-2" />
                    {!isCollapsed && <span className="font-rubik">{item.name}</span>}
                  </Link>
                </SidebarMenuButton>
              </motion.div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-4">
        {!isCollapsed && (
          <>
            {/* Theme Toggle - icon only when collapsed */}
            <div className={`mb-4 flex items-center justify-between px-2`}>
              <span className="text-sm text-sidebar-foreground/70">Toggle Theme</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>

            {/* Rating - hide text when collapsed */}
            <div className="mb-4 flex items-center gap-2 px-2">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium">Rating: {user.rating}</span>
            </div>
          </>
        )}

        {/* User Profile - show only avatar when collapsed */}
        <div className="flex gap-6">
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={`flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-sidebar-accent ${isCollapsed ? "justify-center" : ""}`}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">{user.name}</span>
                    <span className="truncate text-xs text-sidebar-foreground/60">{user.email}</span>
                  </div>
                )}

                {!isCollapsed && (<ChevronUp /> ) /* Show chevron only when expanded */}
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" className="max-w-fit text-center mb-3">
              <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-start text-sm font-medium">{user.name.slice(0, 4).toUpperCase()}</span>
                    <span className="truncate text-xs text-sidebar-foreground/60">{user.email}</span>
                  </div>
              <Separator className="border" /> 

                 <span className="text-start hover:bg-grey-500 hover:dark:bg-grey-600">Profile</span>
                 <span className="text-start hover:bg-grey-300 hover:dark:bg-grey-600">Logout</span>
            </PopoverContent>
          </Popover>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
