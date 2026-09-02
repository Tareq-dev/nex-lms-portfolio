"use client";

import { type ChangeEvent, useMemo, useState } from "react";

import {
  ArrowUpRight,
  Crown,
  Flame,
  Medal,
  Search,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import type { LeaderboardUser } from "@/types/leaderboard";

const LEADERBOARD_DATA: readonly LeaderboardUser[] = [
  {
    rank: 1,
    name: "Naimur Rahman",
    xp: 14850,
    streak: 42,
    avatarSeed: "Naimur",
    badge: "Grandmaster",
  },
  {
    rank: 2,
    name: "Alex Mercer",
    xp: 13200,
    streak: 28,
    avatarSeed: "Alex",
    badge: "Elite",
  },
  {
    rank: 3,
    name: "Anika Tahsin",
    xp: 12950,
    streak: 15,
    avatarSeed: "Anika",
    badge: "Elite",
  },
  {
    rank: 4,
    name: "Zayan Ahmed",
    xp: 11400,
    streak: 12,
    avatarSeed: "Zayan",
    badge: "Pro",
  },
  {
    rank: 5,
    name: "Samiul Islam",
    xp: 9850,
    streak: 9,
    avatarSeed: "Samiul",
    badge: "Pro",
  },
  {
    rank: 6,
    name: "Fariha Zaman",
    xp: 8900,
    streak: 21,
    avatarSeed: "Fariha",
    badge: "Rising Star",
  },
  {
    rank: 7,
    name: "Tanvir Hossain",
    xp: 7650,
    streak: 5,
    avatarSeed: "Tanvir",
    badge: "Rising Star",
  },
];

function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredLeaders = useMemo<LeaderboardUser[]>(() => {
    if (!normalizedSearch) {
      return [...LEADERBOARD_DATA];
    }

    return LEADERBOARD_DATA.filter((user) => {
      const searchableText = `${user.name} ${user.badge}`.toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [normalizedSearch]);

  const topThree = LEADERBOARD_DATA.slice(0, 3);

  /*
   * Search না করলে rank 4 থেকে list দেখানো হবে,
   * কারণ প্রথম তিনজন podium-এ আছে।
   *
   * Search করলে rank 1-3 সহ সব matching user list-এ আসবে।
   */
  const visibleLeaders = normalizedSearch
    ? filteredLeaders
    : filteredLeaders.filter((user) => user.rank > 3);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  return (
    <DashboardLayout>
      <div className="relative min-h-screen space-y-8 overflow-hidden bg-zinc-50 p-4 text-zinc-900 antialiased lg:p-8 dark:bg-zinc-950 dark:text-white">
        {/* Ambient Luxury Glows */}
        <div className="pointer-events-none absolute right-1/4 top-0 h-[400px] w-[400px] animate-pulse rounded-full bg-indigo-600/10 blur-[120px] dark:bg-indigo-500/10" />

        <div className="pointer-events-none absolute bottom-10 left-10 h-[300px] w-[300px] rounded-full bg-violet-600/5 blur-[100px] dark:bg-violet-500/5" />

        {/* Header */}
        <div className="relative z-10 flex flex-col gap-4 border-b border-zinc-200/60 pb-6 md:flex-row md:items-center md:justify-between dark:border-zinc-900">
          <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              <Sparkles size={12} className="animate-pulse" />
              Global Standings
            </span>

            <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
              EduPulse Hall of Fame
              <Trophy className="animate-bounce text-amber-500" size={24} />
            </h1>

            <p className="text-xs font-medium text-zinc-400">
              Resetting in 4 days • Compete with the top 1% minds
            </p>
          </div>

          {/* Search */}
          <div className="group relative w-full md:w-80">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-indigo-500"
            />

            <input
              type="search"
              placeholder="Search peer cohort..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium shadow-2xs backdrop-blur-md transition-all outline-none focus:border-indigo-500/50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:focus:border-indigo-400/30"
            />
          </div>
        </div>

        {/* Top Three Podium */}
        {!normalizedSearch && (
          <div className="relative z-10 mx-auto grid max-w-4xl grid-cols-1 items-end gap-5 pt-8 md:grid-cols-3">
            {/* Rank 2 */}
            {topThree[1] && (
              <div className="group relative order-2 flex flex-col items-center rounded-2xl border border-zinc-200/50 bg-white/60 p-6 text-center shadow-xl backdrop-blur-md transition duration-300 hover:-translate-y-1 md:order-1 dark:border-zinc-800/50 dark:bg-zinc-900/30">
                <div className="absolute left-4 top-4 rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-black text-zinc-500 dark:bg-zinc-800">
                  #2
                </div>

                <div className="relative mb-3">
                  <img
                    src={getAvatarUrl(topThree[1].avatarSeed)}
                    alt={`${topThree[1].name} avatar`}
                    className="h-16 w-16 rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
                  />

                  <span className="absolute -bottom-2 -right-2 rounded-md bg-slate-400 p-1 text-white shadow-lg">
                    <Medal size={12} />
                  </span>
                </div>

                <h3 className="text-sm font-black tracking-tight">
                  {topThree[1].name}
                </h3>

                <p className="mb-2 text-[10px] font-bold text-indigo-500/80">
                  {topThree[1].badge}
                </p>

                <div className="flex w-full items-center justify-center gap-4 border-t pt-2 text-xs font-bold dark:border-zinc-800/80">
                  <span className="flex items-center gap-1 font-mono text-zinc-500">
                    <Zap size={11} className="text-amber-500" />
                    {topThree[1].xp.toLocaleString()} XP
                  </span>

                  <span className="flex items-center gap-0.5 font-mono text-orange-500">
                    <Flame size={11} />
                    {topThree[1].streak}d
                  </span>
                </div>
              </div>
            )}

            {/* Rank 1 */}
            {topThree[0] && (
              <div className="group relative z-10 order-1 flex scale-105 flex-col items-center rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-white/80 to-white/40 p-8 text-center shadow-2xl backdrop-blur-md transition duration-300 hover:-translate-y-1 md:order-2 dark:border-amber-500/20 dark:from-amber-500/10 dark:via-zinc-900/60 dark:to-zinc-900/20">
                <div className="absolute -top-5 animate-bounce text-amber-500">
                  <Crown size={32} className="fill-current" />
                </div>

                <div className="absolute left-4 top-4 rounded-md bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-black text-amber-600 dark:text-amber-400">
                  1ST PLACE
                </div>

                <div className="relative mb-4 mt-2">
                  <img
                    src={getAvatarUrl(topThree[0].avatarSeed)}
                    alt={`${topThree[0].name} avatar`}
                    className="h-20 w-20 rounded-2xl border-2 border-amber-500/40 bg-zinc-100 dark:bg-zinc-800"
                  />

                  <span className="absolute -bottom-2 -right-2 rounded-md bg-amber-500 p-1.5 text-white shadow-lg">
                    <Trophy size={14} className="fill-current" />
                  </span>
                </div>

                <h3 className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-base font-black tracking-tight text-transparent dark:from-white dark:to-zinc-300">
                  {topThree[0].name}
                </h3>

                <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-amber-500">
                  {topThree[0].badge}
                </p>

                <div className="flex w-full items-center justify-center gap-5 border-t border-amber-500/10 pt-3 text-xs font-bold">
                  <span className="flex items-center gap-1 font-mono text-sm text-zinc-800 dark:text-zinc-200">
                    <Zap size={13} className="fill-current text-amber-500" />
                    {topThree[0].xp.toLocaleString()} XP
                  </span>

                  <span className="flex items-center gap-0.5 font-mono text-orange-500">
                    <Flame size={13} />
                    {topThree[0].streak} Day Streak
                  </span>
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {topThree[2] && (
              <div className="group relative order-3 flex flex-col items-center rounded-2xl border border-zinc-200/50 bg-white/60 p-6 text-center shadow-xl backdrop-blur-md transition duration-300 hover:-translate-y-1 dark:border-zinc-800/50 dark:bg-zinc-900/30">
                <div className="absolute left-4 top-4 rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-black text-zinc-500 dark:bg-zinc-800">
                  #3
                </div>

                <div className="relative mb-3">
                  <img
                    src={getAvatarUrl(topThree[2].avatarSeed)}
                    alt={`${topThree[2].name} avatar`}
                    className="h-16 w-16 rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
                  />

                  <span className="absolute -bottom-2 -right-2 rounded-md bg-amber-700 p-1 text-white shadow-lg">
                    <Medal size={12} />
                  </span>
                </div>

                <h3 className="text-sm font-black tracking-tight">
                  {topThree[2].name}
                </h3>

                <p className="mb-2 text-[10px] font-bold text-indigo-500/80">
                  {topThree[2].badge}
                </p>

                <div className="flex w-full items-center justify-center gap-4 border-t pt-2 text-xs font-bold dark:border-zinc-800/80">
                  <span className="flex items-center gap-1 font-mono text-zinc-500">
                    <Zap size={11} className="text-amber-500" />
                    {topThree[2].xp.toLocaleString()} XP
                  </span>

                  <span className="flex items-center gap-0.5 font-mono text-orange-500">
                    <Flame size={11} />
                    {topThree[2].streak}d
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard List */}
        <div className="relative z-10 mx-auto max-w-4xl space-y-2.5">
          <div className="flex items-center justify-between px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            <div className="flex items-center gap-8">
              <span className="w-6 text-center">Rank</span>
              <span>Student Profile</span>
            </div>

            <div className="flex items-center gap-12 md:gap-20">
              <span className="hidden sm:inline">Streak</span>
              <span>Badges</span>
              <span className="w-16 text-right">Score</span>
            </div>
          </div>

          {visibleLeaders.length > 0 ? (
            visibleLeaders.map((user) => (
              <div
                key={user.rank}
                className="group/row flex items-center justify-between rounded-2xl border border-zinc-200/60 bg-white/70 p-4 backdrop-blur-md transition-all duration-200 hover:border-indigo-500/20 dark:border-zinc-900 dark:bg-zinc-900/20 dark:hover:border-indigo-500/20"
              >
                {/* Rank and profile */}
                <div className="flex items-center gap-6 md:gap-8">
                  <span className="w-6 text-center font-mono text-xs font-black text-zinc-400 transition-colors group-hover/row:text-indigo-500 dark:text-zinc-500">
                    {user.rank.toString().padStart(2, "0")}
                  </span>

                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(user.avatarSeed)}
                      alt={`${user.name} avatar`}
                      className="h-9 w-9 shrink-0 rounded-xl border bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
                    />

                    <div>
                      <h4 className="text-xs font-black tracking-tight text-zinc-800 transition-colors group-hover/row:text-indigo-600 dark:text-zinc-200 dark:group-hover/row:text-indigo-400">
                        {user.name}
                      </h4>

                      <span className="text-[9px] font-medium text-zinc-400">
                        Cohort Peer
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score, streak and badge */}
                <div className="flex items-center gap-12 text-xs font-bold md:gap-20">
                  <span className="hidden items-center gap-0.5 font-mono text-[11px] text-orange-500 sm:flex">
                    <Flame size={12} className="fill-current" />
                    {user.streak}d
                  </span>

                  <span className="min-w-[75px] rounded-md border bg-zinc-100 px-2 py-0.5 text-center text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
                    {user.badge}
                  </span>

                  <span className="flex w-16 items-center justify-end gap-1 text-right font-mono text-[13px] font-black text-zinc-900 dark:text-white">
                    {user.xp.toLocaleString()}

                    <span className="font-sans text-[9px] font-bold text-zinc-400">
                      XP
                    </span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-xs font-medium text-zinc-400 dark:border-zinc-800">
              No elite coders found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Current User Standing */}
        <div className="relative z-10 mx-auto max-w-4xl pt-4">
          <div className="flex items-center justify-between rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-900/90 to-violet-900/90 p-4 text-white shadow-xl backdrop-blur-xl dark:from-indigo-950/50 dark:to-violet-950/50">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-mono text-xs font-black text-indigo-200">
                #18
              </div>

              <div>
                <p className="flex items-center gap-1 text-xs font-black tracking-tight">
                  Your Standing
                  <ArrowUpRight size={12} className="text-emerald-400" />
                </p>

                <p className="text-[10px] font-medium text-indigo-200/70">
                  You are outperforming 78% of your cohort
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs font-bold">
              <span className="flex items-center gap-0.5 text-orange-400">
                <Flame size={12} />
                4d streak
              </span>

              <span className="rounded-xl bg-white px-3 py-1.5 text-[11px] font-black text-indigo-950 shadow-xs">
                4,850 XP
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
