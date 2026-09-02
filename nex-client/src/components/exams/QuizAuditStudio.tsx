"use client";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ListOrdered,
  Users,
} from "lucide-react";

import type { Quiz } from "@/types/quiz";

interface QuizAuditStudioProps {
  quiz: Quiz;
  onBack: () => void;
}

export default function QuizAuditStudio({
  quiz,
  onBack,
}: QuizAuditStudioProps) {
  return (
    <div className="animate-in w-full space-y-6 duration-300 slide-in-from-bottom-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-zinc-900 dark:bg-zinc-900/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-black tracking-wider text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              {quiz.id}
            </span>

            <span className="text-xs font-bold text-slate-400">
              {quiz.course}
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {quiz.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
        >
          <ArrowLeft aria-hidden="true" size={14} />
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/40 p-5 shadow-xs sm:grid-cols-4 dark:border-zinc-900 dark:from-zinc-900 dark:to-zinc-900/40">
        <OverviewItem
          icon={<Calendar size={12} className="text-indigo-500" />}
          label="Exam Date"
          value={quiz.date}
        />

        <OverviewItem
          icon={<Clock size={12} className="text-sky-500" />}
          label="Time Window"
          value={`${quiz.duration} Mins`}
          bordered
        />

        <OverviewItem
          icon={<Layers size={12} className="text-violet-500" />}
          label="Paper Size"
          value={`${quiz.questionsCount} MCQs`}
          bordered
        />

        <OverviewItem
          icon={<Users size={12} className="text-emerald-500" />}
          label="Attended Pool"
          value={`${quiz.totalParticipants ?? 0} Students`}
          bordered
          success
        />
      </div>

      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase">
          <ListOrdered
            aria-hidden="true"
            size={14}
            className="text-indigo-500"
          />
          Question Paper Blueprint
        </h4>

        <div className="space-y-4">
          {quiz.questions?.map((question, questionIndex) => (
            <div
              key={question.id}
              className="space-y-3.5 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-zinc-900 dark:bg-zinc-900/50"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {String(questionIndex + 1).padStart(2, "0")}
                </span>

                <p className="text-sm font-bold leading-relaxed text-slate-800 dark:text-zinc-200">
                  {question.questionText}
                </p>
              </div>

              <div className="grid gap-2.5 pl-8 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => {
                  const isCorrect = question.correctAnswer === optionIndex;

                  return (
                    <div
                      key={optionIndex}
                      className={`flex items-center justify-between rounded-xl border p-3 text-xs font-semibold transition-all ${
                        isCorrect
                          ? "border-emerald-500/40 bg-emerald-50/40 font-bold text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400"
                          : "border-slate-50 bg-slate-50/40 text-slate-500 dark:border-transparent dark:bg-zinc-800/20 dark:text-zinc-400"
                      }`}
                    >
                      <span>{option}</span>

                      {isCorrect && (
                        <span className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-100/50 px-1.5 py-0.5 text-[10px] font-black tracking-wider text-emerald-600 uppercase dark:bg-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 aria-hidden="true" size={11} />
                          Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {!quiz.questions?.length && (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400 dark:border-zinc-800">
              No questions are available for this quiz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface OverviewItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bordered?: boolean;
  success?: boolean;
}

function OverviewItem({
  icon,
  label,
  value,
  bordered = false,
  success = false,
}: OverviewItemProps) {
  return (
    <div
      className={`space-y-1 p-2 ${
        bordered
          ? "border-l border-slate-100 sm:pl-4 dark:border-zinc-800/60"
          : ""
      }`}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        {icon}
        {label}
      </div>

      <span
        className={`text-base font-black ${
          success
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-800 dark:text-zinc-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
