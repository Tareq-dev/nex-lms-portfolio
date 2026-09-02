"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";

import { Globe, Loader2, Send, Sparkles, Users } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import type {
  BroadcastAudience,
  BroadcastChannel,
  BroadcastFormData,
} from "@/types/broadcast";

const initialBroadcastForm: BroadcastFormData = {
  audience: "all-active",
  channel: "email",
  subject: "",
  message: "",
};

export default function AdminBroadcastCenter() {
  const [formData, setFormData] =
    useState<BroadcastFormData>(initialBroadcastForm);

  const [isSending, setIsSending] = useState<boolean>(false);

  /*
   * K শুধুমাত্র BroadcastFormData-এর
   * property name হতে পারবে।
   *
   * উদাহরণ:
   * updateFormField("subject", "Hello")
   * updateFormField("channel", "email")
   */
  function updateFormField<K extends keyof BroadcastFormData>(
    field: K,
    value: BroadcastFormData[K],
  ): void {
    setFormData((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  }

  const handleAudienceChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    updateFormField("audience", event.target.value as BroadcastAudience);
  };

  const handleSubjectChange = (event: ChangeEvent<HTMLInputElement>): void => {
    updateFormField("subject", event.target.value);
  };

  const handleMessageChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    updateFormField("message", event.target.value);
  };

  const handleChannelChange = (channel: BroadcastChannel): void => {
    updateFormField("channel", channel);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!subject || !message) {
      return;
    }

    setIsSending(true);

    try {
      /*
       * এখানে পরবর্তীতে আসল API request হবে।
       *
       * উদাহরণ:
       *
       * await fetch("/api/broadcast", {
       *   method: "POST",
       *   headers: {
       *     "Content-Type": "application/json",
       *   },
       *   body: JSON.stringify(formData),
       * });
       *
       * এখন demo loading দেখানোর জন্য timeout।
       */
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 1200);
      });

      setFormData(initialBroadcastForm);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-8 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-zinc-900 dark:text-white">
              Broadcast Center
              <Sparkles size={18} className="text-indigo-500" />
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Send bulk announcements to your students.
            </p>
          </div>

          <div className="w-fit rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            System Admin Mode
          </div>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          {/* Audience and Channel */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Target Audience */}
            <div className="space-y-2">
              <label
                htmlFor="broadcast-audience"
                className="text-[10px] font-black uppercase text-zinc-400"
              >
                Target Audience
              </label>

              <select
                id="broadcast-audience"
                value={formData.audience}
                onChange={handleAudienceChange}
                disabled={isSending}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-800 outline-none ring-indigo-500/20 transition focus:border-indigo-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="all-active">All Active Students</option>

                <option value="trial-users">Trial Users Only</option>

                <option value="premium-subscribers">Premium Subscribers</option>

                <option value="course-cohort">Specific Course Cohort</option>
              </select>
            </div>

            {/* Delivery Channel */}
            <div className="space-y-2">
              <span className="block text-[10px] font-black uppercase text-zinc-400">
                Delivery Channel
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChannelChange("email")}
                  disabled={isSending}
                  aria-pressed={formData.channel === "email"}
                  className={`flex-1 cursor-pointer rounded-2xl p-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    formData.channel === "email"
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  Email
                </button>

                <button
                  type="button"
                  onClick={() => handleChannelChange("push")}
                  disabled={isSending}
                  aria-pressed={formData.channel === "push"}
                  className={`flex-1 cursor-pointer rounded-2xl p-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    formData.channel === "push"
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  Push App
                </button>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label
              htmlFor="broadcast-subject"
              className="text-[10px] font-black uppercase text-zinc-400"
            >
              Subject Line
            </label>

            <input
              id="broadcast-subject"
              type="text"
              value={formData.subject}
              onChange={handleSubjectChange}
              disabled={isSending}
              required
              placeholder="Ex: New module launch alert!"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-900 outline-none ring-indigo-500/20 transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label
              htmlFor="broadcast-message"
              className="text-[10px] font-black uppercase text-zinc-400"
            >
              Message Content
            </label>

            <textarea
              id="broadcast-message"
              value={formData.message}
              onChange={handleMessageChange}
              disabled={isSending}
              required
              placeholder="Write your announcement here..."
              className="h-64 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-900 outline-none ring-indigo-500/20 transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSending}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950"
          >
            {isSending ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sending Broadcast...
              </>
            ) : (
              <>
                <Send size={18} />
                Broadcast Message
              </>
            )}
          </button>
        </form>

        {/* Stats */}
        <div className="flex flex-col items-center justify-center gap-3 text-xs text-zinc-400 sm:flex-row sm:gap-6">
          <span className="flex items-center gap-1">
            <Users size={14} />
            1,240 Total Recipients
          </span>

          <span className="flex items-center gap-1">
            <Globe size={14} />
            Delivery Rate: 98%
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}
