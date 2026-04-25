import { TopNav } from "@/components/top-nav";
import { CombatHero } from "@/components/combat-hero";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2a201d,_#0f0d0d_45%)]">
      <div className="min-h-screen bg-black/60">
        <TopNav />
        <CombatHero />
        <section className="mx-auto w-full max-w-6xl px-4 pb-10">{children}</section>
      </div>
    </main>
  );
}
