"use client";

import { type FormEvent, useState } from "react";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";

import FloatingNavbar from "@/components/home/Navbar";

import { setAuth } from "@/redux/store/slices/authSlice";

import type { Role } from "@/types/auth";

/*
 * Email অনুযায়ী Role বের করা হচ্ছে।
 *
 * Valid email পাওয়া গেলে Role return করবে।
 * Invalid email হলে null return করবে।
 */
function getRoleFromEmail(email: string): Role | null {
  if (email === "admin@nex.com") {
    return "admin";
  }

  if (email === "student@nex.com") {
    return "student";
  }

  return null;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    /*
     * FormData দিয়ে form-এর input value নেওয়া হচ্ছে।
     * এতে HTMLInputElement হিসেবে manual cast করা লাগছে না।
     */
    const submittedForm = new FormData(event.currentTarget);

    const emailValue = submittedForm.get("email");

    const passwordValue = submittedForm.get("password");

    /*
     * FormData থেকে string ছাড়াও File অথবা null
     * আসতে পারে। তাই আগে type check করছি।
     */
    if (typeof emailValue !== "string" || typeof passwordValue !== "string") {
      window.alert("Invalid form information.");

      return;
    }

    const email = emailValue.trim().toLowerCase();

    const password = passwordValue.trim();

    /*
     * এই project-এ এখনো real signup API নেই।
     * তাই Sign Up button-কে login হিসেবে ব্যবহার
     * না করে পরিষ্কার message দেখানো হচ্ছে।
     */
    if (!isLogin) {
      window.alert("Sign up API is not connected yet.");

      return;
    }

    if (password !== "1234") {
      window.alert("Password must be 1234");

      return;
    }

    /*
     * এখানে role-এর type:
     *
     * Role | null
     */
    const role = getRoleFromEmail(email);

    /*
     * এই check-এর পরে TypeScript বুঝবে
     * role আর null নয়; এটি এখন নিশ্চিত Role।
     */
    if (role === null) {
      window.alert("Email not found. Use admin@nex.com or student@nex.com.");

      return;
    }

    dispatch(
      setAuth({
        user: {
          email,
        },
        role,
      }),
    );

    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/student/dashboard");
    }
  };

  const toggleAuthMode = (): void => {
    setIsLogin((previousMode) => !previousMode);
  };

  return (
    <div className="min-h-screen bg-white transition-colors duration-500 dark:bg-[#050505]">
      <FloatingNavbar />

      <div className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-sm border border-gray-200 bg-gray-50/50 shadow md:shadow-2xl lg:flex-row dark:border-white/5 dark:bg-[#0a0a0a]">
          {/* Left Banner */}
          <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-blue-600 p-8 lg:flex">
            <div className="relative z-10 flex items-center gap-2 text-white/90">
              <Sparkles size={16} />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Nex-LMS
              </span>
            </div>

            <div className="relative z-10 text-white">
              <h1 className="mb-4 text-4xl font-black tracking-tight">
                Elevate Your
                <br />
                Learning.
              </h1>

              <p className="font-medium leading-relaxed text-blue-100/70">
                Experience the next-gen management system designed for
                excellence.
              </p>
            </div>

            <div className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-white/40">
              © 2026 Nex-LMS
            </div>
          </div>

          {/* Form Area */}
          <div className="flex w-full flex-col justify-center border-gray-200 p-10 md:p-6 lg:w-1/2 lg:border-y lg:border-r dark:border-white/5">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-black text-black dark:text-white">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLogin
                  ? "Please enter your credentials to continue"
                  : "Create your NEX-LMS student account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail
                  className="absolute left-4 top-4 text-gray-400"
                  size={18}
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 pl-12 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock
                  className="absolute left-4 top-4 text-gray-400"
                  size={18}
                />

                <input
                  name="password"
                  type="password"
                  placeholder="Password (1234)"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 pl-12 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white transition-all hover:opacity-90 dark:bg-white dark:text-black"
              >
                {isLogin ? "Sign In" : "Sign Up"}

                <ArrowRight size={16} />
              </button>
            </form>

            <button
              type="button"
              onClick={toggleAuthMode}
              className="mt-6 w-full cursor-pointer text-center text-sm text-gray-500 transition-colors hover:text-blue-600"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>

            <div className="mt-10 border-t border-gray-200 pt-6 text-xs font-bold tracking-wide text-gray-400 dark:border-white/5">
              <p>Admin: admin@nex.com</p>
              <p className="mt-1">Student: student@nex.com</p>
              <p className="mt-1">Password: 1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
