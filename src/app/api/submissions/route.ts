// app/api/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/src/lib/db-sandbox";

export async function POST(req: NextRequest) {
  try {
    const { problemId, query } = await req.json();
    if (!query) throw new Error("Query is required");

    // Optional: validate query against problem’s expected schema
    // For now, we execute in a read‑only sandbox
    const rows = await executeQuery(query);
    return NextResponse.json({ rows });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}