import { prisma } from "@/src/lib/prisma";

export async function GET(request: Request) {
    try {
        const problems = await prisma.problem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return new Response(JSON.stringify(problems), { status: 200 });
    } catch (error: any) {
        return new Response(error.message, { status: 500 });
    }
}