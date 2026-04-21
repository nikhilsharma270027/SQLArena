// app/problems/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { problems, Problem } from "@/src/lib/problems-data";
import { ProblemStatement } from "@/src/components/problems/ProblemStatement"; 
import { QueryEditor } from "@/src/components/problems/QueryEditor";
import { ResultTable } from "@/src/components/problems/ResultTable";

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const found = problems.find((p) => p.id === id);
    if (found) {
      setProblem(found);
      setQuery(found.starterQuery || "SELECT * FROM users LIMIT 5;");
    }
  }, [id]);

  const runQuery = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: id, query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Execution failed");
      setResult(data.rows);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  if (!problem) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 h-full">
        {/* Left: Problem Statement */}
        <div className="overflow-auto border rounded-lg p-4">
          <ProblemStatement problem={problem} />
        </div>
        {/* Right: Editor + Results */}
        <div className="flex flex-col gap-4">
          <QueryEditor
            value={query}
            onChange={setQuery}
            onRun={runQuery}
            isRunning={isRunning}
          />
          <div className="border rounded-lg p-4 flex-1 overflow-auto">
            <h3 className="font-semibold mb-2">Results</h3>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {result && <ResultTable data={result} />}
          </div>
        </div>
      </div>
    </div>
  );
}