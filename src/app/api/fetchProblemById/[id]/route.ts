// app/api/fetchProblemById/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ FIX

    console.log("Fetching problem with ID:", id);

    const problem = await prisma.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}