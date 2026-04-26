// app/problems/[id]/page.tsx (Server Component)
import { prisma } from '@/src/lib/prisma'
import { notFound } from 'next/navigation'
import { ProblemClient } from './ProblemClient'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProblemPage({ params }: PageProps) {
  // ✅ Await the params first (Next.js 15+ requirement)
  const { id } = await params
  
  const problem = await prisma.problem.findUnique({
    where: { id: id }
  })
  
  if (!problem) {
    notFound()
  }
  
  // Pass problem data to client component
  return <ProblemClient initialProblem={problem} />
}