"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  HelpCircle,
  Hourglass,
  Radio,
  Trash2,
  Users,
} from "lucide-react";

import type {
  Quiz,
  QuizId,
  QuizStatus,
} from "@/types/quiz";

interface LiveCountdownProps {
  quiz: Quiz;
  onTimeEnd: (quizId: QuizId) => void;
}

function LiveCountdown({
  quiz,
  onTimeEnd,
}: LiveCountdownProps) {
  const [timeLeft, setTimeLeft] =
    useState("Calculating...");

  useEffect(() => {
    if (!quiz.liveStartedAt) {
      setTimeLeft("No start time");
      return;
    }

    let timer:
      | ReturnType<typeof setInterval>
      | undefined;

    const calculateTime = (): boolean => {
      const startedAt = new Date(
        quiz.liveStartedAt as string,
      ).getTime();

      const durationHours = Number.parseFloat(
        String(quiz.liveDurationHours ?? 2),
      );

      if (
        Number.isNaN(startedAt) ||
        Number.isNaN(durationHours)
      ) {
        setTimeLeft("Invalid Time");
        return false;
      }

      const durationMs =
        durationHours * 60 * 60 * 1000;

      const endTime = startedAt + durationMs;
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft("00h 00m 00s");
        onTimeEnd(quiz.id);
        return false;
      }

      const hours = Math.floor(
        difference / (1000 * 60 * 60),
      );

      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
          (1000 * 60),
      );

      const seconds = Math.floor(
        (difference % (1000 * 60)) / 1000,
      );

      setTimeLeft(
        `${String(hours).padStart(2, "0")}h ${String(
          minutes,
        ).padStart(2, "0")}m ${String(seconds).padStart(
          2,
          "0",
        )}s`,
      );

      return true;
    };

    const shouldContinue = calculateTime();

    if (!shouldContinue) return;

    timer = setInterval(() => {
      const shouldKeepRunning = calculateTime();

      if (!shouldKeepRunning && timer) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [
    quiz.id,
    quiz.liveStartedAt,
    quiz.liveDurationHours,
    onTimeEnd,
  ]);

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-600 shadow-xs dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
      <Hourglass
        aria-hidden="true"
        size={11}
        className="animate-spin duration-1000"
      />

      <span suppressHydrationWarning>
        {timeLeft}
      </span>
    </div>
  );
}

interface QuizListTableProps {
  quizzes: Quiz[];
  setQuizzes: Dispatch<
    SetStateAction<Quiz[]>
  >;
  onEdit: (quiz: Quiz) => void;
  onViewDetails: (quiz: Quiz) => void;
  onDelete: (quizId: QuizId) => void;
}

export default function QuizListTable({
  quizzes,
  setQuizzes,
  onEdit,
  onViewDetails,
  onDelete,
}: QuizListTableProps) {
  const toggleLiveStatus = (
    quizId: QuizId,
    currentStatus: QuizStatus,
  ) => {
    setQuizzes((previousQuizzes) =>
      previousQuizzes.map((quiz): Quiz => {
        if (quiz.id !== quizId) {
          return quiz;
        }

        if (currentStatus === "Upcoming") {
          return {
            ...quiz,
            status: "Live",
            liveStartedAt:
              new Date().toISOString(),
          };
        }

        if (currentStatus === "Live") {
          return {
            ...quiz,
            status: "Ended",
          };
        }

        return quiz;
      }),
    );
  };

  const handleAutoEnd = (quizId: QuizId) => {
    setQuizzes((previousQuizzes) =>
      previousQuizzes.map((quiz): Quiz =>
        quiz.id === quizId &&
        quiz.status === "Live"
          ? {
              ...quiz,
              status: "Ended",
            }
          : quiz,
      ),
    );
  };

  const handleDelete = (
    quizId: QuizId,
  ) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this premium quiz?",
    );

    if (shouldDelete) {
      onDelete(quizId);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-zinc-900 dark:bg-zinc-900">
      <div className="border-b border-slate-50 p-5 dark:border-zinc-800/60">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Recent Quiz Examinations
        </h3>

        <p className="text-xs text-slate-400">
          Latest assessments are ordered first.
          Click actions to instantly toggle state.
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="block w-full border-collapse text-left text-sm sm:table">
          <thead>
            <tr className="hidden border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-600 sm:table-row dark:border-zinc-800 dark:bg-zinc-800/30 dark:text-zinc-400">
              <th className="p-4 pl-6">
                Quiz Paper Details
              </th>
              <th className="p-4">
                Assigned Course
              </th>
              <th className="p-4">
                Exam Schedule / Settings
              </th>
              <th className="p-4 text-center">
                Questions / Attended
              </th>
              <th className="p-4">
                Current Status / Time Left
              </th>
              <th className="p-4 pr-6 text-center">
                Management Actions
              </th>
            </tr>
          </thead>

          <tbody className="block divide-y divide-slate-100 text-slate-700 sm:table-row-group sm:divide-y dark:divide-zinc-800 dark:text-zinc-300">
            {quizzes.map((quiz) => (
              <tr
                key={quiz.id}
                className="block space-y-3 p-4 transition-colors hover:bg-slate-50/40 sm:table-row sm:space-y-0 sm:p-0 dark:hover:bg-zinc-800/20"
              >
                <td className="block p-0 sm:table-cell sm:p-4 sm:pl-6">
                  <div className="flex items-center gap-2 sm:block">
                    <span className="shrink-0 rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      {quiz.id}
                    </span>

                    <span className="text-xs font-medium text-slate-400 sm:hidden">
                      — Details
                    </span>
                  </div>

                  <div className="mt-1 max-w-[320px] line-clamp-2 font-bold leading-snug text-slate-900 sm:mt-1.5 dark:text-white">
                    {quiz.title}
                  </div>
                </td>

                <td className="block max-w-[200px] truncate p-0 font-medium text-slate-500 sm:table-cell sm:p-4 dark:text-zinc-400">
                  <span className="mb-0.5 block text-xs font-medium text-slate-400 sm:hidden">
                    Course:
                  </span>

                  {quiz.course}
                </td>

                <td className="block p-0 sm:table-cell sm:p-4">
                  <span className="mb-1 block text-xs font-medium text-slate-400 sm:hidden">
                    Schedule:
                  </span>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-zinc-200">
                      <Calendar
                        aria-hidden="true"
                        size={13}
                        className="text-slate-400"
                      />
                      {quiz.date}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock
                          aria-hidden="true"
                          size={13}
                        />
                        {quiz.duration} Mins
                      </span>

                      <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
                        ⏳{" "}
                        {quiz.liveDurationHours ?? "2"}{" "}
                        Hrs
                      </span>
                    </div>
                  </div>
                </td>

                <td className="block p-0 text-left sm:table-cell sm:p-4 sm:text-center">
                  <span className="mb-1 block text-xs font-medium text-slate-400 sm:hidden">
                    Metrics:
                  </span>

                  <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:justify-center sm:gap-1">
                    <div className="flex items-center justify-center gap-1 text-xs font-medium text-slate-800 dark:text-zinc-200">
                      <HelpCircle
                        aria-hidden="true"
                        size={12}
                        className="text-blue-500"
                      />
                      {quiz.questionsCount} Qs
                    </div>

                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                      <Users
                        aria-hidden="true"
                        size={12}
                      />
                      {quiz.totalParticipants ?? 0}{" "}
                      Attended
                    </div>
                  </div>
                </td>

                <td className="block p-0 sm:table-cell sm:p-4">
                  <span className="mb-1 block text-xs font-medium text-slate-400 sm:hidden">
                    Status / Timer:
                  </span>

                  <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        quiz.status === "Live"
                          ? "animate-pulse bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                          : quiz.status ===
                              "Upcoming"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {quiz.status === "Live" && (
                        <Radio
                          aria-hidden="true"
                          size={12}
                          className="text-red-500"
                        />
                      )}

                      {quiz.status}
                    </span>

                    {quiz.status === "Live" && (
                      <LiveCountdown
                        quiz={quiz}
                        onTimeEnd={handleAutoEnd}
                      />
                    )}
                  </div>
                </td>

                <td className="block border-b border-dashed border-slate-100 p-0 pt-2 pb-4 sm:table-cell sm:border-none sm:p-4 sm:pr-6 sm:pb-0 dark:border-zinc-800/80">
                  <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        onViewDetails(quiz)
                      }
                      aria-label={`View ${quiz.title}`}
                      title="View Full Details"
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      <Eye
                        aria-hidden="true"
                        size={14}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(quiz)}
                      aria-label={`Edit ${quiz.title}`}
                      title="Edit Quiz"
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-blue-600 transition hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-blue-400 dark:hover:bg-blue-500/10"
                    >
                      <Edit3
                        aria-hidden="true"
                        size={14}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(quiz.id)
                      }
                      aria-label={`Delete ${quiz.title}`}
                      title="Delete Quiz"
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-rose-600 transition hover:bg-rose-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                      <Trash2
                        aria-hidden="true"
                        size={14}
                      />
                    </button>

                    {quiz.status !== "Ended" ? (
                      <button
                        type="button"
                        onClick={() =>
                          toggleLiveStatus(
                            quiz.id,
                            quiz.status,
                          )
                        }
                        className={`cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition ${
                          quiz.status === "Upcoming"
                            ? "border-transparent bg-emerald-600 text-white hover:bg-emerald-500"
                            : "border-rose-200 bg-white text-rose-600 hover:bg-rose-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-rose-400"
                        }`}
                      >
                        {quiz.status === "Upcoming"
                          ? "Go Live"
                          : "End"}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-0.5 px-1 text-xs font-medium text-slate-400">
                        <CheckCircle
                          aria-hidden="true"
                          size={12}
                          className="text-slate-300"
                        />
                        Archived
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}