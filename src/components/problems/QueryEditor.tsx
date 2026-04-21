// app/problems/[id]/components/QueryEditor.tsx
"use client";

import Editor from "@monaco-editor/react";
import { Button } from "@/src/components/ui/button";
import { Play } from "lucide-react";

export function QueryEditor({
  value,
  onChange,
  onRun,
  isRunning,
}: {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  isRunning: boolean;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-2 flex justify-between items-center">
        <span className="text-sm font-mono">SQL Query</span>
        <Button size="sm" onClick={onRun} disabled={isRunning}>
          <Play className="h-3 w-3 mr-1" />
          {isRunning ? "Running..." : "Run"}
        </Button>
      </div>
      <Editor
        height="300px"
        defaultLanguage="sql"
        value={value}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
        }}
      />
    </div>
  );
}