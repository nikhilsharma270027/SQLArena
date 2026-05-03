// app/problems/[id]/components/QueryEditor.tsx
"use client";

import Editor from "@monaco-editor/react";
import { Button } from "@/src/components/ui/button";
import { Play, Send } from "lucide-react";

export function QueryEditor({
  value,
  onChange,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
}: {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}) {
  return (
    <div className="border rounded-lg overflow-hidden h-full">
      <div className="bg-muted p-2 flex justify-between items-center">
        <span className="text-sm font-mono">SQL Query</span>
        <div className="space-x-2">
          <Button size="sm" onClick={onRun} disabled={isRunning || isSubmitting}>
            <Play className="h-3 w-3 mr-1" />
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button 
            size="sm" 
            onClick={onSubmit} 
            disabled={isRunning || isSubmitting}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-3 w-3 mr-1" />
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
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