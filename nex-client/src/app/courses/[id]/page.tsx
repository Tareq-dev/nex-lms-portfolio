import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Globe2,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";

import FloatingNavbar from "@/components/home/Navbar";
import {
  COURSES,
  getCourseById,
} from "@/data/courses";

interface CourseDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return COURSES.map((course) => ({
    id: course.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: CourseDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    return {
      title: "Course Not Found | NEX-LMS",
    };
  }

  return {
    title: `${course.title} | NEX-LMS`,
    description: course.shortDescription,
  };
}

export default async function CourseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-black transition-colors duration-500 dark:bg-[#050505] dark:text-white">
      <FloatingNavbar />

      <section className="px-6 pt-32 pb-16 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/#courses"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <ArrowLeft aria-hidden="true" size={18} />
            Back to courses
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.5fr_0.7fr]">
            <div>
              <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/10">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-[340px] w-full object-cover md:h-[520px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute right-0 bottom-0 left-0 p-7 md:p-12">
                  <span className="mb-4 inline-block rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase backdrop-blur-md">
                    {course.tag}
                  </span>

                  <h1 className="max-w-4xl text-3xl leading-tight font-black tracking-tighter text-white md:text-6xl">
                    {course.title}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-200 md:text-lg">
                    {course.shortDescription}
                  </p>
                </div>
              </div>

              <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                <InformationCard
                  icon={<Star size={18} />}
                  label="Rating"
                  value={`${course.rating}/5`}
                />

                <InformationCard
                  icon={<Users size={18} />}
                  label="Students"
                  value={course.students}
                />

                <InformationCard
                  icon={<Clock3 size={18} />}
                  label="Duration"
                  value={course.duration}
                />

                <InformationCard
                  icon={<BookOpen size={18} />}
                  label="Lessons"
                  value={course.totalLessons.toString()}
                />
              </div>

              <section className="mb-12">
                <p className="mb-3 text-xs font-bold tracking-[0.2em] text-blue-600 uppercase dark:text-blue-400">
                  About this course
                </p>

                <h2 className="mb-5 text-3xl font-black tracking-tight md:text-4xl">
                  Build practical, industry-ready skills
                </h2>

                <p className="max-w-4xl leading-8 text-gray-600 dark:text-gray-400">
                  {course.description}
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-black md:text-3xl">
                  What you will get
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {course.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/5"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        size={20}
                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                      />

                      <span className="text-sm font-semibold leading-relaxed text-gray-700 dark:text-gray-300">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-6 text-2xl font-black md:text-3xl">
                  Course curriculum
                </h2>

                <div className="space-y-4">
                  {course.curriculum.map((module, moduleIndex) => (
                    <div
                      key={module.title}
                      className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10"
                    >
                      <div className="flex items-center justify-between bg-gray-100 px-6 py-5 dark:bg-white/5">
                        <div>
                          <span className="mb-1 block text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase dark:text-blue-400">
                            Module {moduleIndex + 1}
                          </span>

                          <h3 className="font-bold">
                            {module.title}
                          </h3>
                        </div>

                        <span className="text-xs font-semibold text-gray-500">
                          {module.lessons.length} lessons
                        </span>
                      </div>

                      <div className="divide-y divide-gray-200 px-6 dark:divide-white/5">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson}
                            className="flex items-center gap-3 py-4 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <PlayCircle
                              aria-hidden="true"
                              size={17}
                              className="text-blue-600 dark:text-blue-400"
                            />

                            <span>
                              {lessonIndex + 1}. {lesson}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside>
              <div className="sticky top-28 rounded-[2rem] border border-gray-200 bg-gray-50 p-7 shadow-xl shadow-black/5 md:p-8 dark:border-white/10 dark:bg-zinc-900">
                <div className="mb-6 flex items-end gap-3">
                  <span className="text-4xl font-black">
                    {course.price}
                  </span>

                  <span className="pb-1 text-lg text-gray-400 line-through">
                    {course.originalPrice}
                  </span>
                </div>

                <button
                  type="button"
                  className="mb-4 w-full rounded-full bg-blue-600 px-6 py-4 text-sm font-black tracking-wider text-white uppercase shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Enroll Now
                </button>

                <button
                  type="button"
                  className="mb-8 w-full rounded-full border border-gray-300 px-6 py-4 text-sm font-bold transition hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/5"
                >
                  Preview Course
                </button>

                <div className="space-y-5 border-t border-gray-200 pt-7 dark:border-white/10">
                  <SidebarItem
                    icon={<Award size={18} />}
                    label="Level"
                    value={course.level}
                  />

                  <SidebarItem
                    icon={<Globe2 size={18} />}
                    label="Language"
                    value={course.language}
                  />

                  <SidebarItem
                    icon={<BookOpen size={18} />}
                    label="Access"
                    value="Lifetime"
                  />
                </div>

                <div className="mt-8 rounded-2xl bg-white p-5 dark:bg-white/5">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                    Your instructor
                  </p>

                  <p className="mt-2 font-black">
                    {course.instructor.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {course.instructor.role}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

interface InformationCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InformationCard({
  icon,
  label,
  value,
}: InformationCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 text-blue-600 dark:text-blue-400">
        {icon}
      </div>

      <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
        {label}
      </p>

      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function SidebarItem({
  icon,
  label,
  value,
}: SidebarItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-blue-600 dark:text-blue-400">
        {icon}
      </div>

      <div className="flex flex-1 items-center justify-between gap-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>

        <span className="text-sm font-bold">{value}</span>
      </div>
    </div>
  );
} ;
