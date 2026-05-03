# 🐘 SQL Duel – Practice SQL & Challenge Friends

A full‑stack web application where users can practice SQL problems (LeetCode‑style) and challenge each other in real‑time 1v1 duels. Built with **Next.js 16**, **Better‑Auth**, **Prisma**, **Neon PostgreSQL**, and **Supabase Realtime**.

![SQL Duel Screenshot](./public/screenshot.png)  <!-- optional: add a real screenshot -->

## 🚀 Features

- ✅ **SQL Playground** – Write and run SQL queries against real database schemas.
- ✅ **100+ curated problems** (Easy, Medium, Hard) with expected outputs.
- ✅ **Real‑time Duels** – 1v1 matches using WebSockets (Supabase Realtime).
- ✅ **Authentication** – Email/password + OAuth (Google, GitHub) via Better‑Auth.
- ✅ **User Profiles** – Track solved problems, total score, and duels won.
- ✅ **Secure SQL execution** – Read‑only PostgreSQL user, per‑problem schemas, query timeouts.
- ✅ **Leaderboard & Statistics** – See rankings and personal progress.

## 🛠️ Tech Stack

| Layer          | Technology                                                      |
|----------------|-----------------------------------------------------------------|
| Frontend       | Next.js 16 (App Router), Tailwind CSS, Monaco Editor           |
| Backend        | Next.js API Routes + Custom serverless functions               |
| Auth           | Better‑Auth (email + Google, GitHub)                           |
| Database (main)| Neon PostgreSQL + Prisma ORM                                    |
| SQL Execution  | Dedicated read‑only PostgreSQL user, per‑problem schemas       |
| Realtime       | Supabase Realtime (Presence & Broadcast)                       |
| Deployment     | Vercel (frontend) / Neon (DB) / Supabase (realtime)            |

## 📦 Prerequisites

- Node.js 20+ and npm
- A [Neon](https://neon.tech) PostgreSQL database
- A [Supabase](https://supabase.com) project (for realtime)
- OAuth credentials (optional) for Google/GitHub

## 🔧 Environment Variables

Create a `.env.local` file in the root:

```env
# Neon database (full access)
DATABASE_URL="postgresql://neondb_owner:password@ep-...-pooler.c-6.us-east-1.aws.neon.tech/neondb"

# Read‑only connection (must use direct endpoint, not the pooler)
READONLY_DATABASE_URL="postgresql://sql_runner:password@ep-....c-6.us-east-1.aws.neon.tech/neondb"

# Better‑Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# Supabase Realtime
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
