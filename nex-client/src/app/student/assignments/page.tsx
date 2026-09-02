"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Clock3,
  FileText,
  LockKeyhole,
  MessageSquareText,
  PencilLine,
  Send,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import type {
  AssignmentId,
  AssignmentSubmission,
  StudentAssignment,
} from "@/types/assignment";

const EDIT_WINDOW_IN_MILLISECONDS = 2 * 24 * 60 * 60 * 1000;

const MINIMUM_SUBMISSION_LENGTH = 20;
const MAXIMUM_SUBMISSION_LENGTH = 5000;

type FeedbackMessage = {
  type: "success" | "error";
  message: string;
} | null;

function createDummyAssignments(): StudentAssignment[] {
  const currentTime = Date.now();

  return [
    {
      id: "ASG-305",
      title: "Build a Responsive LMS Dashboard",
      course: "Next.js Premium Course",
      instructor: "Jhankar Mahbub",
      description:
        "Explain how you would build a responsive LMS dashboard using Next.js, TypeScript and Tailwind CSS. Include your component structure, state-management approach and responsive design strategy.",
      dueDate: new Date(currentTime + 4 * 24 * 60 * 60 * 1000).toISOString(),
      maxMarks: 100,
      status: "Open",
    },
    {
      id: "ASG-302",
      title: "Redux Toolkit State Architecture",
      course: "MERN Stack Web Development",
      instructor: "Sumit Saha",
      description:
        "Describe how Redux Toolkit can be used to manage authentication, courses and student data. Explain the responsibilities of slices, reducers, actions and the Redux store.",
      dueDate: new Date(currentTime + 3 * 24 * 60 * 60 * 1000).toISOString(),
      maxMarks: 80,
      status: "Open",
    },
    {
      id: "ASG-298",
      title: "JavaScript Event Loop Analysis",
      course: "Advanced JavaScript Masterclass",
      instructor: "Anisul Islam",
      description:
        "Explain the JavaScript event loop, call stack, Web APIs, callback queue and microtask queue using a practical example.",
      dueDate: new Date(currentTime + 2 * 24 * 60 * 60 * 1000).toISOString(),
      maxMarks: 70,
      status: "Open",
    },
  ];
}

function createDummySubmissions(): AssignmentSubmission[] {
  const currentTime = Date.now();

  return [
    {
      id: "SUB-8012",
      assignmentId: "ASG-302",
      content:
        "Redux Toolkit provides a structured way to manage global application state. I would create separate slices for authentication, courses and students. Each slice would contain its own initial state, reducer functions and generated actions. The configured Redux store would then combine these reducers and make the data available throughout the application.",
      submittedAt: new Date(currentTime - 26 * 60 * 60 * 1000).toISOString(),
      updatedAt: null,
    },
    {
      id: "SUB-7988",
      assignmentId: "ASG-298",
      content:
        "The JavaScript event loop continuously checks whether the call stack is empty. Synchronous operations run inside the call stack, while asynchronous operations are handled by browser APIs. Promise callbacks enter the microtask queue and timer callbacks enter the callback queue.",
      submittedAt: new Date(
        currentTime - 4 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updatedAt: new Date(currentTime - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

function getEditDeadline(submittedAt: string): number {
  return new Date(submittedAt).getTime() + EDIT_WINDOW_IN_MILLISECONDS;
}

function isSubmissionEditable(
  submission: AssignmentSubmission,
  assignment: StudentAssignment,
  currentTime: number,
): boolean {
  const assignmentDeadline = new Date(assignment.dueDate).getTime();

  const editDeadline = getEditDeadline(submission.submittedAt);

  return (
    assignment.status === "Open" &&
    currentTime <= assignmentDeadline &&
    currentTime <= editDeadline
  );
}

function getRemainingEditTime(
  submission: AssignmentSubmission,
  currentTime: number,
): string {
  const remainingMilliseconds =
    getEditDeadline(submission.submittedAt) - currentTime;

  if (remainingMilliseconds <= 0) {
    return "Edit window expired";
  }

  const totalMinutes = Math.floor(remainingMilliseconds / (60 * 1000));

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m remaining`;
}

export default function StudentAssignmentsPage() {
  const [assignments] = useState<StudentAssignment[]>(createDummyAssignments);

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(
    createDummySubmissions,
  );

  const [selectedAssignmentId, setSelectedAssignmentId] =
    useState<AssignmentId>("ASG-305");

  const [submissionContent, setSubmissionContent] = useState<string>("");

  const [feedback, setFeedback] = useState<FeedbackMessage>(null);

  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  /*
   * প্রতি মিনিটে current time update হচ্ছে।
   * ফলে ৪৮ ঘণ্টা শেষ হলে form নিজে থেকে lock হবে।
   */
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const selectedAssignment = useMemo(() => {
    return (
      assignments.find(
        (assignment) => assignment.id === selectedAssignmentId,
      ) ?? null
    );
  }, [assignments, selectedAssignmentId]);

  const selectedSubmission = useMemo(() => {
    return (
      submissions.find(
        (submission) => submission.assignmentId === selectedAssignmentId,
      ) ?? null
    );
  }, [selectedAssignmentId, submissions]);

  const previousSubmissions = useMemo(() => {
    return [...submissions].sort(
      (firstSubmission, secondSubmission) =>
        new Date(secondSubmission.submittedAt).getTime() -
        new Date(firstSubmission.submittedAt).getTime(),
    );
  }, [submissions]);

  /*
   * Assignment পরিবর্তন হলে সেই assignment-এর
   * আগের submission textarea-তে load হচ্ছে।
   */
  useEffect(() => {
    setSubmissionContent(selectedSubmission?.content ?? "");

    setFeedback(null);
  }, [selectedAssignmentId, selectedSubmission]);

  const selectedAssignmentDeadlinePassed = selectedAssignment
    ? currentTime > new Date(selectedAssignment.dueDate).getTime()
    : true;

  const selectedAssignmentIsOpen =
    selectedAssignment?.status === "Open" && !selectedAssignmentDeadlinePassed;

  const selectedSubmissionIsEditable =
    selectedAssignment && selectedSubmission
      ? isSubmissionEditable(
          selectedSubmission,
          selectedAssignment,
          currentTime,
        )
      : false;

  /*
   * Existing submission থাকলে ৪৮ ঘণ্টা ও deadline check হবে।
   * Existing submission না থাকলে শুধু assignment deadline check হবে।
   */
  const formIsLocked = selectedSubmission
    ? !selectedSubmissionIsEditable
    : !selectedAssignmentIsOpen;

  const pendingAssignmentsCount = assignments.filter((assignment) => {
    const hasSubmission = submissions.some(
      (submission) => submission.assignmentId === assignment.id,
    );

    const deadlinePassed = currentTime > new Date(assignment.dueDate).getTime();

    return !hasSubmission && assignment.status === "Open" && !deadlinePassed;
  }).length;

  const editableSubmissionsCount = submissions.filter((submission) => {
    const assignment = assignments.find(
      (assignmentItem) => assignmentItem.id === submission.assignmentId,
    );

    if (!assignment) {
      return false;
    }

    return isSubmissionEditable(submission, assignment, currentTime);
  }).length;

  const handleAssignmentSelect = (assignmentId: AssignmentId): void => {
    setSelectedAssignmentId(assignmentId);
    setFeedback(null);
  };

  const handleContentChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setSubmissionContent(event.target.value);

    if (feedback) {
      setFeedback(null);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!selectedAssignment) {
      setFeedback({
        type: "error",
        message: "Please select an assignment.",
      });

      return;
    }

    const normalizedContent = submissionContent.trim();

    if (normalizedContent.length < MINIMUM_SUBMISSION_LENGTH) {
      setFeedback({
        type: "error",
        message: `Your submission must contain at least ${MINIMUM_SUBMISSION_LENGTH} characters.`,
      });

      return;
    }

    if (!selectedAssignmentIsOpen) {
      setFeedback({
        type: "error",
        message:
          "The assignment deadline has passed. Submission is no longer available.",
      });

      return;
    }

    const submittedAt = new Date().toISOString();

    /*
     * Existing submission থাকলে update।
     */
    if (selectedSubmission) {
      if (!selectedSubmissionIsEditable) {
        setFeedback({
          type: "error",
          message:
            "The 48-hour editing window has expired. This submission is now read-only.",
        });

        return;
      }

      setSubmissions((previousSubmissions) =>
        previousSubmissions.map((submission) =>
          submission.id === selectedSubmission.id
            ? {
                ...submission,
                content: normalizedContent,
                updatedAt: submittedAt,

                /*
                 * submittedAt পরিবর্তন করছি না।
                 * Original 48-hour window ঠিক থাকবে।
                 */
              }
            : submission,
        ),
      );

      setFeedback({
        type: "success",
        message: "Your assignment submission has been updated successfully.",
      });

      return;
    }

    /*
     * নতুন submission তৈরি।
     */
    const newSubmission: AssignmentSubmission = {
      id: `SUB-${Date.now()}`,
      assignmentId: selectedAssignment.id,
      content: normalizedContent,
      submittedAt,
      updatedAt: null,
    };

    setSubmissions((previousSubmissions) => [
      newSubmission,
      ...previousSubmissions,
    ]);

    setFeedback({
      type: "success",
      message:
        "Your assignment has been submitted successfully. You can edit it for the next 48 hours.",
    });
  };

  const openPreviousSubmission = (assignmentId: AssignmentId): void => {
    setSelectedAssignmentId(assignmentId);

    window.setTimeout(() => {
      document.getElementById("assignment-submission-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-slate-50/60 p-4 text-slate-900 sm:p-6 lg:p-8 dark:bg-zinc-950 dark:text-white">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-900">
            <div>
              <span className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                <Sparkles size={12} />
                Student Submission Desk
              </span>

              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Assignment Center
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-zinc-400">
                Write and submit your assignments, review previous submissions
                and edit eligible work within 48 hours.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 size={15} />
              Submission portal active
            </div>
          </div>

          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Available assignments
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {assignments.length}
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <ClipboardList size={21} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Pending submission
                  </p>

                  <p className="mt-2 text-3xl font-black text-amber-500">
                    {pendingAssignmentsCount}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <Clock3 size={21} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Editable submissions
                  </p>

                  <p className="mt-2 text-3xl font-black text-emerald-500">
                    {editableSubmissionsCount}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <PencilLine size={21} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            {/* Assignment List */}
            <aside className="h-fit overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
              <div className="border-b border-slate-100 p-5 dark:border-zinc-800">
                <h2 className="text-sm font-black">Your assignments</h2>

                <p className="mt-1 text-xs text-slate-400">
                  Select an assignment to submit or review.
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-zinc-800/70">
                {assignments.map((assignment) => {
                  const submission = submissions.find(
                    (submissionItem) =>
                      submissionItem.assignmentId === assignment.id,
                  );

                  const isSelected = selectedAssignmentId === assignment.id;

                  const deadlinePassed =
                    currentTime > new Date(assignment.dueDate).getTime();

                  return (
                    <button
                      key={assignment.id}
                      type="button"
                      onClick={() => handleAssignmentSelect(assignment.id)}
                      className={`w-full cursor-pointer p-5 text-left transition ${
                        isSelected
                          ? "bg-indigo-50/70 dark:bg-indigo-500/10"
                          : "hover:bg-slate-50 dark:hover:bg-zinc-800/30"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                          {assignment.id}
                        </span>

                        {submission ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            Submitted
                          </span>
                        ) : deadlinePassed ? (
                          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-black uppercase text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                            Closed
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                            Pending
                          </span>
                        )}
                      </div>

                      <h3 className="line-clamp-2 text-sm font-black text-slate-900 dark:text-white">
                        {assignment.title}
                      </h3>

                      <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">
                        {assignment.course}
                      </p>

                      <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                        <CalendarDays size={11} />
                        Due {formatDate(assignment.dueDate)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Submission Form */}
            <section
              id="assignment-submission-form"
              className="scroll-mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40"
            >
              {selectedAssignment ? (
                <>
                  <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-700 p-6 text-white dark:border-zinc-800 sm:p-7">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-white/10 px-2.5 py-1 font-mono text-[10px] font-black">
                        {selectedAssignment.id}
                      </span>

                      <span className="rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-bold">
                        {selectedAssignment.maxMarks} Marks
                      </span>
                    </div>

                    <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                      {selectedAssignment.title}
                    </h2>

                    <p className="mt-2 text-xs font-medium text-indigo-100">
                      {selectedAssignment.course} • Instructor:{" "}
                      {selectedAssignment.instructor}
                    </p>
                  </div>

                  <div className="space-y-6 p-6 sm:p-7">
                    {/* Assignment Details */}
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
                      <div className="mb-2 flex items-center gap-2">
                        <FileText size={15} className="text-indigo-500" />

                        <h3 className="text-xs font-black uppercase tracking-wider">
                          Assignment brief
                        </h3>
                      </div>

                      <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
                        {selectedAssignment.description}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-200/70 pt-3 text-[11px] font-semibold text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} />
                          Due: {formatDate(selectedAssignment.dueDate)}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock3 size={12} />
                          48-hour edit window
                        </span>
                      </div>
                    </div>

                    {/* Submission Status */}
                    {selectedSubmission && (
                      <div
                        className={`rounded-2xl border p-4 ${
                          selectedSubmissionIsEditable
                            ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                            : "border-amber-200 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {selectedSubmissionIsEditable ? (
                            <PencilLine
                              size={18}
                              className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                            />
                          ) : (
                            <LockKeyhole
                              size={18}
                              className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                            />
                          )}

                          <div>
                            <p
                              className={`text-sm font-black ${
                                selectedSubmissionIsEditable
                                  ? "text-emerald-700 dark:text-emerald-400"
                                  : "text-amber-700 dark:text-amber-400"
                              }`}
                            >
                              {selectedSubmissionIsEditable
                                ? "This submission is editable"
                                : "This submission is locked"}
                            </p>

                            <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">
                              Submitted:{" "}
                              {formatDate(selectedSubmission.submittedAt)}
                            </p>

                            {selectedSubmissionIsEditable && (
                              <p className="mt-1 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                {getRemainingEditTime(
                                  selectedSubmission,
                                  currentTime,
                                )}
                              </p>
                            )}

                            {selectedSubmission.updatedAt && (
                              <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-500">
                                Last edited:{" "}
                                {formatDate(selectedSubmission.updatedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {feedback && (
                      <div
                        className={`flex items-start gap-2 rounded-xl border p-3 text-xs font-semibold ${
                          feedback.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
                        }`}
                      >
                        {feedback.type === "success" ? (
                          <CheckCircle2 size={15} className="shrink-0" />
                        ) : (
                          <CircleAlert size={15} className="shrink-0" />
                        )}

                        {feedback.message}
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label
                            htmlFor="assignment-content"
                            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-zinc-300"
                          >
                            <MessageSquareText
                              size={14}
                              className="text-indigo-500"
                            />
                            Your answer
                          </label>

                          <span
                            className={`font-mono text-[10px] font-bold ${
                              submissionContent.length >
                              MAXIMUM_SUBMISSION_LENGTH - 200
                                ? "text-rose-500"
                                : "text-slate-400"
                            }`}
                          >
                            {submissionContent.length}/
                            {MAXIMUM_SUBMISSION_LENGTH}
                          </span>
                        </div>

                        <textarea
                          id="assignment-content"
                          value={submissionContent}
                          onChange={handleContentChange}
                          readOnly={formIsLocked}
                          maxLength={MAXIMUM_SUBMISSION_LENGTH}
                          placeholder="Write your assignment answer here..."
                          className={`min-h-72 w-full resize-y rounded-2xl border p-4 text-sm leading-7 outline-none transition ${
                            formIsLocked
                              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-500"
                              : "border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500  focus:ring-4 focus:ring-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white dark:focus:border-indigo-500"
                          }`}
                        />

                        <p className="mt-2 text-[11px] text-slate-400">
                          Minimum {MINIMUM_SUBMISSION_LENGTH} characters. Your
                          work is saved only after pressing the submit button.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                        <div className="text-xs">
                          {formIsLocked ? (
                            <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                              <LockKeyhole size={14} />
                              This submission is read-only.
                            </span>
                          ) : selectedSubmission ? (
                            <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                              <PencilLine size={14} />
                              You are editing your previous submission.
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              Review your answer before submitting.
                            </span>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={
                            formIsLocked ||
                            submissionContent.trim().length <
                              MINIMUM_SUBMISSION_LENGTH
                          }
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto dark:bg-white dark:text-zinc-950 dark:hover:bg-indigo-500 dark:hover:text-white dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
                        >
                          {formIsLocked ? (
                            <>
                              <LockKeyhole size={15} />
                              Submission Locked
                            </>
                          ) : selectedSubmission ? (
                            <>
                              <PencilLine size={15} />
                              Save Changes
                            </>
                          ) : (
                            <>
                              <Send size={15} />
                              Submit Assignment
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="py-20 text-center text-slate-400">
                  Select an assignment to continue.
                </div>
              )}
            </section>
          </div>

          {/* Previous Submissions */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-black tracking-tight">
                Previous Submissions
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Review submitted work and edit eligible assignments.
              </p>
            </div>

            {previousSubmissions.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {previousSubmissions.map((submission) => {
                  const assignment = assignments.find(
                    (assignmentItem) =>
                      assignmentItem.id === submission.assignmentId,
                  );

                  if (!assignment) {
                    return null;
                  }

                  const canEdit = isSubmissionEditable(
                    submission,
                    assignment,
                    currentTime,
                  );

                  return (
                    <article
                      key={submission.id}
                      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-mono text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                            {submission.id}
                          </span>

                          <h3 className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                            {assignment.title}
                          </h3>

                          <p className="mt-1 text-[11px] text-slate-400">
                            {assignment.course}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${
                            canEdit
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {canEdit ? (
                            <PencilLine size={10} />
                          ) : (
                            <LockKeyhole size={10} />
                          )}

                          {canEdit ? "Editable" : "Locked"}
                        </span>
                      </div>

                      <p className="mt-4 line-clamp-3 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-600 dark:bg-zinc-950/40 dark:text-zinc-400">
                        {submission.content}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-zinc-800">
                        <div>
                          <p className="text-[10px] text-slate-400">
                            Submitted
                          </p>

                          <p className="mt-0.5 text-[11px] font-bold text-slate-600 dark:text-zinc-300">
                            {formatDate(submission.submittedAt)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => openPreviousSubmission(assignment.id)}
                          className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            canEdit
                              ? "bg-indigo-600 text-white hover:bg-indigo-500"
                              : "border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {canEdit ? (
                            <PencilLine size={13} />
                          ) : (
                            <FileText size={13} />
                          )}

                          {canEdit ? "Edit Submission" : "View Submission"}

                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
                <FileText
                  size={28}
                  className="mx-auto text-slate-300 dark:text-zinc-600"
                />

                <p className="mt-3 text-sm font-bold">
                  No previous submissions
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
