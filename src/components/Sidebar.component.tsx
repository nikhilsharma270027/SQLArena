"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import {
  Home,
  Trophy,
  BarChart3,
  Swords,
  Bug,
  Moon,
  Sun,
  Bell,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const SideNav = () => {
  const { session } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
    { icon: BarChart3, label: "My Statistics", href: "/statistics" },
    { icon: Swords, label: "Battle History", href: "/battles" },
    { icon: Bug, label: "Report a Bug", href: "/report-bug" },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="w-64 min-w-64 flex-shrink-0 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">=</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">CodeArena</h1>
        </div>
        <p className="text-xs text-gray-600 ml-10 whitespace-nowrap">EleventhHour</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}

          {/* Toggle Theme */}
          <li>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">Toggle Theme</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Rating Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Rating: </span>
          <span className="text-sm font-semibold text-gray-900">0</span>
        </div>
        <button className="w-full flex justify-center">
          <Bell className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {session?.user?.email?.[0]?.toUpperCase() || "R"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;