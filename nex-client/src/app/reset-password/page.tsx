"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!token) {
      setMessage("Password reset token পাওয়া যায়নি।");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password কমপক্ষে 8 characters হতে হবে।");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Password should be matched");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.errors?.[0]?.message ??
          result.message ??
          "Password reset করা যায়নি।";

        setMessage(errorMessage);
        return;
      }

      setIsSuccess(true);
      setMessage(
        result.message ?? "Password successfully reset হয়েছে। এখন login করুন।",
      );

      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("Server-এর সঙ্গে connection করা যাচ্ছে না।");
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid reset link
          </h1>

          <p className="mt-3 text-gray-600">
            URL-এর মধ্যে password reset token নেই।
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 text-black p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>

        <p className="mt-2 text-sm text-gray-600">Enter Your New Password</p>

        <div className="mt-6">
          <label
            htmlFor="newPassword"
            className="mb-2 block text-sm font-medium"
          >
            New password
          </label>

          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium"
          >
            Confirm password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {message && (
          <p
            className={`mt-4 rounded-lg p-3 text-sm ${
              isSuccess
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="mt-6 cursor-pointer w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Resetting..."
            : isSuccess
              ? "Password reset complete"
              : "Reset password"}
        </button>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Loading reset form...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
