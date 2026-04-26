// app/problems/page.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  ChevronRight,
  ThumbsUp,
  MessageCircle,
  Search,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Fix: Difficulty badge variants
const difficultyVariants = {
  EASY: "green" as const,
  MEDIUM: "medium" as const,
  HARD: "red" as const,
};

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  
  const { data, error, isLoading } = useSWR('/api/fetchProblems', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0,
  });
  
  // Fix: Handle different data structures
  const problems = data?.problems || data || [];
  
  if (isLoading) return (
    <div className="container mx-auto py-8 px-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading problems: {error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const filteredProblems = useMemo(() => {
    return problems.filter((problem: any) => {
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        (problem.description && problem.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDifficulty =
        difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      
      return matchesSearch && matchesDifficulty;
    });
  }, [problems, searchTerm, difficultyFilter]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SQL Challenges</h1>
        <p className="text-muted-foreground">
          Master your SQL skills with these carefully crafted challenges
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count - Fixed: use problems.length instead of problems.length */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredProblems.length} of {problems.length} problems
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-center">Likes</TableHead>
              <TableHead className="text-center">Submissions</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No problems found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredProblems.map((problem: any, index: number) => (
                <TableRow key={problem.id} className="group hover:bg-muted/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      href={`/problems/${problem.id}`}
                      className="font-medium hover:underline hover:text-primary transition-colors"
                    >
                      {problem.title}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-1">
                      {problem.description?.substring(0, 60) || "No description available"}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={difficultyVariants[problem.difficulty as keyof typeof difficultyVariants]}>
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{problem.likes?.toLocaleString() || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{problem.submissions?.toLocaleString() || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/problems/${problem.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Solve
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}