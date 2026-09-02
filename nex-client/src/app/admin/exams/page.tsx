"use client";

import { useState } from "react";
import { ArrowLeft, HelpCircle, Layers, Plus, Users } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import QuizAuditStudio from "@/components/exams/QuizAuditStudio";
import QuizCreatorStudio from "@/components/exams/QuizCreatorStudio";
import QuizListTable from "@/components/exams/QuizListTable";

import type { Quiz, QuizId, QuizPublishPayload } from "@/types/quiz";

type DashboardView = "list" | "create" | "audit";

function createInitialQuizzes(): Quiz[] {
  return [
    {
      id: "QZ-904",
      title: "Advanced React Context & Redux Toolkit",
      course: "Next.js Premium Course",
      date: "18 June, 2026",
      duration: "15",
      liveDurationHours: "2",
      questionsCount: 1,
      totalParticipants: 240,
      status: "Upcoming",
      questions: [
        {
          id: 1,
          questionText: "What is Redux Toolkit?",
          options: ["Library", "Framework", "Language", "Database"],
          correctAnswer: 0,
        },
      ],
    },
    {
      id: "QZ-903",
      title: "JavaScript Engine & Event Loop",
      course: "MERN Stack Web Development",
      date: "14 June, 2026",
      duration: "10",
      liveDurationHours: "1.5",
      liveStartedAt: new Date().toISOString(),
      questionsCount: 1,
      totalParticipants: 412,
      status: "Live",
      questions: [
        {
          id: 1,
          questionText: "V8 Engine compiles JS into?",
          options: ["Bytecode", "Machine Code", "C++", "Python"],
          correctAnswer: 1,
        },
      ],
    },
  ];
}

export default function QuizDashboard() {
  const [view, setView] = useState<DashboardView>("list");

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const [quizzes, setQuizzes] = useState<Quiz[]>(createInitialQuizzes);

  const goToQuizList = () => {
    setSelectedQuiz(null);
    setView("list");
  };

  const openCreateStudio = () => {
    setSelectedQuiz(null);
    setView("create");
  };

  const handlePublishQuiz = (quizData: QuizPublishPayload) => {
    if (selectedQuiz) {
      setQuizzes((previousQuizzes) =>
        previousQuizzes.map((quiz) =>
          quiz.id === selectedQuiz.id
            ? {
                ...quiz,
                ...quizData,
                questionsCount: quizData.questions.length,
              }
            : quiz,
        ),
      );
    } else {
      const formattedQuiz: Quiz = {
        id: `QZ-${Date.now().toString().slice(-3)}`,
        title: quizData.title,
        course: quizData.course,
        date: quizData.date,
        duration: quizData.duration,
        liveDurationHours: quizData.liveDurationHours || "2",
        liveStartedAt: null,
        questionsCount: quizData.questions.length,
        totalParticipants: 0,
        status: "Upcoming",
        questions: quizData.questions,
      };

      setQuizzes((previousQuizzes) => [formattedQuiz, ...previousQuizzes]);
    }

    goToQuizList();
  };

  const handleEditTrigger = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setView("create");
  };

  const handleAuditTrigger = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setView("audit");
  };

  const handleDeleteQuiz = (quizId: QuizId) => {
    setQuizzes((previousQuizzes) =>
      previousQuizzes.filter((quiz) => quiz.id !== quizId),
    );

    if (selectedQuiz?.id === quizId) {
      setSelectedQuiz(null);
    }
  };

  const totalParticipations = quizzes.reduce(
    (total, quiz) => total + (quiz.totalParticipants ?? 0),
    0,
  );

  const liveQuizCount = quizzes.filter((quiz) => quiz.status === "Live").length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 p-6 transition-colors duration-300 dark:bg-zinc-950">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {view !== "list" && (
                <button
                  type="button"
                  onClick={goToQuizList}
                  aria-label="Back to quiz list"
                  className="mr-2 cursor-pointer rounded-xl border bg-white p-2 text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                >
                  <ArrowLeft aria-hidden="true" size={16} />
                </button>
              )}

              {view === "list" && "Quiz & Assessments"}

              {view === "create" &&
                (selectedQuiz ? "Edit Premium Quiz" : "Create Premium Quiz")}

              {view === "audit" && "Examination Audit Review"}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              {view === "list" &&
                "Manage real-time examinations, change live status, and monitor participants."}

              {view === "create" &&
                "Modify question cards, answer blueprints, and target criteria."}

              {view === "audit" &&
                "In-depth review of exam metrics, schedule dates, and questionnaire structure."}
            </p>
          </div>

          {view === "list" && (
            <button
              type="button"
              onClick={openCreateStudio}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/10 transition hover:opacity-95"
            >
              <Plus aria-hidden="true" size={18} />
              Create Premium Quiz
            </button>
          )}
        </div>

        {view === "list" && (
          <div className="animate-in space-y-6 duration-200 fade-in">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/50">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Layers aria-hidden="true" size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Total Quizzes
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {quizzes.length}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/50">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <HelpCircle aria-hidden="true" size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Live Running
                  </p>

                  <h3 className="text-xl font-bold text-emerald-600">
                    {liveQuizCount}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/50">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <Users aria-hidden="true" size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Total Participations
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {totalParticipations}
                  </h3>
                </div>
              </div>
            </div>

            <QuizListTable
              quizzes={quizzes}
              setQuizzes={setQuizzes}
              onEdit={handleEditTrigger}
              onViewDetails={handleAuditTrigger}
              onDelete={handleDeleteQuiz}
            />
          </div>
        )}

        {view === "create" && (
          <QuizCreatorStudio
            onPublish={handlePublishQuiz}
            editData={selectedQuiz}
          />
        )}

        {view === "audit" && selectedQuiz && (
          <QuizAuditStudio quiz={selectedQuiz} onBack={goToQuizList} />
        )}
      </div>
    </DashboardLayout>
  );
}
