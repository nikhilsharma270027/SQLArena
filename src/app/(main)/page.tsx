import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Swords, Users, UserPlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-full px-4 pt-16 pb-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-center">
          Welcome to <span className="text-battle-green">SQL Arena</span>
        </h1>
        
      </div>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center w-full max-w-3xl pb-16 mt-40" aria-label="Hero">
        {/* Green radial glow behind heading */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 38%, rgba(134,239,172,0.28) 0%, transparent 70%)",
          }}
        />

        {/* Headline */}
        <h1 className="text-6xl font-black leading-tight tracking-tight">
          <span className="text-foreground text-7xl">Query.</span>{" "}
          <span className="text-battle-green-light text-7xl">Clash.</span>
          <br />
          <span className="text-battle-green text-7xl">Conquer.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-lg text-muted-foreground text-base leading-7 text-center">
          Challenge friends to solve algorithmic problems in real time.
          <br />
          Prove your skills, climb the ranks, dominate the arena.
        </p>

        {/* Start Battle CTA */}
        <Link href="/problems">
        <Button
          size="lg"
          variant="outline"
          className="mt-10 rounded-2xl px-14 py-6 h-auto text-base font-bold shadow-md hover:shadow-lg gap-2.5 bg-white border-border/50 hover:bg-white dark:bg-card"
          aria-label="Start a battle"
        >
          <Swords className="h-5 w-5 text-battle-green" />
          Start Battle
        </Button>
      </Link>
      </section>

      {/* Friends Section */}
      <section className="w-full max-w-2xl" aria-label="Friends">
        <Separator />
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">Friends</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full h-8 gap-1.5 text-xs px-3"
            aria-label="Add a friend"
          >
            <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
            Add
          </Button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Users className="h-10 w-10 text-muted-foreground/30" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            No friends yet — add someone to get started
          </p>
        </div>
      </section>
    </div>
  );
}
