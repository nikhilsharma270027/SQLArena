// app/problems/page.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { problems } from "@/src/lib/problems-data";
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

const difficultyColors = {
  Easy: "green",
  Medium: "medium",
  Hard: "red",
};

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDifficulty =
        difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      
      return matchesSearch && matchesDifficulty;
    });
  }, [searchTerm, difficultyFilter]);

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

      {/* Results Count */}
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
              filteredProblems.map((problem, index) => (
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
                      {problem.description.substring(0, 60)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        difficultyColors[
                          problem.difficulty as keyof typeof difficultyColors
                        ]
                      }
                    >
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{problem.likes.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{problem.submissions.toLocaleString()}</span>
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