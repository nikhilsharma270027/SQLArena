// app/problems/[id]/components/ProblemStatement.tsx
import { Problem } from "@/src/lib/problems-data";

export function ProblemStatement({ problem }: { problem: Problem }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1 className="text-2xl font-bold">{problem.title}</h1>
      <div className="text-muted-foreground text-sm mb-4">
        Difficulty: {problem.difficulty} | Points: {problem.points}
      </div>
      <div className="whitespace-pre-wrap">{problem.description}</div>
      {problem.examples && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Examples</h2>
          {problem.examples.map((ex, idx) => (
            <pre key={idx} className="bg-muted p-2 rounded mt-2">
              <code>{ex.input}</code>
              <br />→ <code>{ex.output}</code>
            </pre>
          ))}
        </div>
      )}
      {problem.constraints && (
        <div className="mt-4 text-sm">
          <strong>Constraints:</strong> {problem.constraints}
        </div>
      )}
    </div>
  );
}