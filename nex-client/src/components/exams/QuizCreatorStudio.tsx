"use client";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Hourglass,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import type {
  Quiz,
  QuizFormValues,
  QuizId,
  QuizPublishPayload,
  QuizQuestion,
} from "@/types/quiz";

interface QuizCreatorStudioProps {
  onPublish: (
    payload: QuizPublishPayload,
  ) => void;
  editData?: Quiz | null;
}

function createEmptyQuestion(
  id: QuizId = 1,
): QuizQuestion {
  return {
    id,
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  };
}

const initialQuizMeta: QuizFormValues = {
  title: "",
  course: "",
  duration: "15",
  date: "",
  liveDurationHours: "2",
};

export default function QuizCreatorStudio({
  onPublish,
  editData,
}: QuizCreatorStudioProps) {
  const [quizMeta, setQuizMeta] =
    useState<QuizFormValues>(initialQuizMeta);

  const [questions, setQuestions] = useState<
    QuizQuestion[]
  >([createEmptyQuestion()]);

  useEffect(() => {
    if (!editData) return;

    let formattedDate = editData.date;

    if (
      editData.date &&
      editData.date.includes(",")
    ) {
      try {
        const parsedDate = new Date(
          editData.date,
        );

        if (
          !Number.isNaN(parsedDate.getTime())
        ) {
          formattedDate = parsedDate
            .toISOString()
            .split("T")[0];
        }
      } catch {
        formattedDate = "";
      }
    }

    setQuizMeta({
      title: editData.title,
      course: editData.course,
      duration: String(editData.duration),
      date: formattedDate || "",
      liveDurationHours: String(
        editData.liveDurationHours ?? 2,
      ),
    });

    if (
      editData.questions &&
      editData.questions.length > 0
    ) {
      setQuestions(editData.questions);
    }
  }, [editData]);

  const formatPoshDate = (
    dateString: string,
  ): string => {
    if (!dateString) return "";

    if (dateString.includes(",")) {
      return dateString;
    }

    const options: Intl.DateTimeFormatOptions =
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      };

    return new Date(
      dateString,
    ).toLocaleDateString("en-US", options);
  };

  const updateQuizMeta = (
    field: keyof QuizFormValues,
    value: string,
  ) => {
    setQuizMeta((previousMeta) => ({
      ...previousMeta,
      [field]: value,
    }));
  };

  const handleAddQuestion = () => {
    setQuestions((previousQuestions) => [
      ...previousQuestions,
      createEmptyQuestion(Date.now()),
    ]);
  };

  const handleDeleteQuestion = (
    questionId: QuizId,
  ) => {
    if (questions.length === 1) {
      window.alert(
        "At least one question is required!",
      );
      return;
    }

    setQuestions((previousQuestions) =>
      previousQuestions.filter(
        (question) =>
          question.id !== questionId,
      ),
    );
  };

  const handleQuestionTextChange = (
    questionId: QuizId,
    text: string,
  ) => {
    setQuestions((previousQuestions) =>
      previousQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              questionText: text,
            }
          : question,
      ),
    );
  };

  const handleOptionChange = (
    questionId: QuizId,
    optionIndex: number,
    text: string,
  ) => {
    setQuestions((previousQuestions) =>
      previousQuestions.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const updatedOptions = [
          ...question.options,
        ];

        updatedOptions[optionIndex] = text;

        return {
          ...question,
          options: updatedOptions,
        };
      }),
    );
  };

  const handleSelectCorrectAnswer = (
    questionId: QuizId,
    optionIndex: number,
  ) => {
    setQuestions((previousQuestions) =>
      previousQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              correctAnswer: optionIndex,
            }
          : question,
      ),
    );
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !quizMeta.title.trim() ||
      !quizMeta.course.trim() ||
      !quizMeta.date ||
      !quizMeta.liveDurationHours
    ) {
      window.alert(
        "Please fill up all baseline exam configurations!",
      );
      return;
    }

    onPublish({
      title: quizMeta.title,
      course: quizMeta.course,
      duration: quizMeta.duration,
      date: formatPoshDate(quizMeta.date),
      liveDurationHours:
        quizMeta.liveDurationHours,
      questions,
      liveStartedAt:
        editData?.liveStartedAt ?? null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in w-full space-y-6 duration-300 slide-in-from-bottom-4"
    >
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/50">
        <h4 className="flex items-center gap-1.5 text-xs font-black tracking-widest text-slate-400 uppercase">
          <HelpCircle
            aria-hidden="true"
            size={14}
            className="text-blue-500"
          />
          Custom Examination Configurations
        </h4>

        <div className="grid gap-4 sm:grid-cols-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-400">
              Quiz Title
            </label>

            <input
              type="text"
              placeholder="e.g., NextJS Hooks Core"
              value={quizMeta.title}
              onChange={(event) =>
                updateQuizMeta(
                  "title",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-400">
              Assigned Course
            </label>

            <input
              type="text"
              placeholder="e.g., MERN Advanced"
              value={quizMeta.course}
              onChange={(event) =>
                updateQuizMeta(
                  "course",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-zinc-400">
              <Calendar
                aria-hidden="true"
                size={12}
                className="text-indigo-500"
              />
              Pick Exam Date
            </label>

            <input
              type="date"
              value={quizMeta.date}
              onChange={(event) =>
                updateQuizMeta(
                  "date",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-800 outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-zinc-400">
              Solve Time (Mins)
            </label>

            <input
              type="number"
              min="1"
              placeholder="15"
              value={quizMeta.duration}
              onChange={(event) =>
                updateQuizMeta(
                  "duration",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-800 outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-zinc-400">
              <Hourglass
                aria-hidden="true"
                size={12}
                className="text-rose-500"
              />
              Live Window (Hours)
            </label>

            <input
              type="number"
              min="0.5"
              step="0.5"
              placeholder="2"
              value={
                quizMeta.liveDurationHours
              }
              onChange={(event) =>
                updateQuizMeta(
                  "liveDurationHours",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-800 outline-hidden focus:border-rose-500 focus:bg-white focus:ring-1 focus:ring-rose-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black tracking-widest text-slate-400 uppercase">
            Questionnaires Pool (
            {questions.length})
          </h4>

          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-blue-400"
          >
            <Plus
              aria-hidden="true"
              size={14}
            />
            Add New Question Card
          </button>
        </div>

        <div className="space-y-4">
          {questions.map(
            (question, questionIndex) => (
              <div
                key={question.id}
                className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-zinc-900 dark:bg-zinc-900/50"
              >
                <div className="flex items-center justify-between border-b border-slate-50 pb-3 dark:border-zinc-800/60">
                  <span className="flex h-6 w-12 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
                    MCQ{" "}
                    {String(
                      questionIndex + 1,
                    ).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteQuestion(
                        question.id,
                      )
                    }
                    aria-label={`Delete question ${questionIndex + 1}`}
                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:text-rose-500"
                  >
                    <Trash2
                      aria-hidden="true"
                      size={15}
                    />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Question Statement
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Enter your premium question text here..."
                    value={
                      question.questionText
                    }
                    onChange={(event) =>
                      handleQuestionTextChange(
                        question.id,
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-800 outline-hidden focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">
                    Options Blueprint
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {question.options.map(
                      (
                        option,
                        optionIndex,
                      ) => {
                        const isCorrect =
                          question.correctAnswer ===
                          optionIndex;

                        return (
                          <div
                            key={optionIndex}
                            className={`flex items-center gap-2 rounded-xl border p-2 transition ${
                              isCorrect
                                ? "border-emerald-500 bg-emerald-50/30 dark:border-emerald-500/50 dark:bg-emerald-500/5"
                                : "border-slate-100 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/30"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectCorrectAnswer(
                                  question.id,
                                  optionIndex,
                                )
                              }
                              aria-label={`Mark option ${optionIndex + 1} as correct`}
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                                isCorrect
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-slate-300 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                              }`}
                            >
                              {isCorrect && (
                                <CheckCircle2
                                  aria-hidden="true"
                                  size={12}
                                />
                              )}
                            </button>

                            <input
                              type="text"
                              required
                              placeholder={`Option ${String.fromCharCode(
                                65 +
                                  optionIndex,
                              )}`}
                              value={option}
                              onChange={(event) =>
                                handleOptionChange(
                                  question.id,
                                  optionIndex,
                                  event.target
                                    .value,
                                )
                              }
                              className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-hidden dark:text-zinc-300"
                            />
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-zinc-900">
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-black text-white shadow-md transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-100"
        >
          <Save
            aria-hidden="true"
            size={14}
          />

          {editData
            ? "Save & Update Blueprint"
            : "Publish Examination Blueprint"}

          <ArrowRight
            aria-hidden="true"
            size={14}
          />
        </button>
      </div>
    </form>
  );
}