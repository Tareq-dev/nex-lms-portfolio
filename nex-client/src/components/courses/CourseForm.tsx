"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BookOpen, Layers, Plus, Trash2, Video, X } from "lucide-react";

import { addCourse, updateCourse } from "@/redux/features/courses/courseSlice";

import type {
  AdminCourse,
  CourseChapter,
  CourseLevel,
  CourseModule,
  CourseStatus,
} from "@/types/adminCourse";

type CoursePayload = Parameters<typeof updateCourse>[0];
type CourseWithoutId = Omit<CoursePayload, "id">;

interface CourseFormValues {
  title: string;
  instructor: string;
  category: string;
  price: string;
  duration: string;
  level: "" | CourseLevel;
  language: string;
  description: string;
  thumbnail: string | null;
  modules: CourseModule[];
  status: "" | CourseStatus;
}

interface CourseFormProps {
  editing?: AdminCourse | null;
  onCancel: () => void;
}

type ValidationField =
  | "title"
  | "instructor"
  | "category"
  | "price"
  | "duration"
  | "level"
  | "description"
  | "thumbnail";

type FormErrors = Partial<Record<ValidationField, string>>;

type TextInputField =
  | "title"
  | "instructor"
  | "category"
  | "price"
  | "duration"
  | "language"
  | "description";

function createInitialForm(editing?: AdminCourse | null): CourseFormValues {
  if (editing) {
    return {
      title: editing.title,
      instructor: editing.instructor,
      category: editing.category,
      price: String(editing.price),
      duration: editing.duration,
      level: editing.level,
      language: editing.language,
      description: editing.description,
      thumbnail: editing.thumbnail,
      modules: editing.modules ?? [],
      status: editing.status,
    };
  }

  return {
    title: "",
    instructor: "",
    category: "",
    price: "",
    duration: "",
    level: "",
    language: "",
    description: "",
    thumbnail: null,
    modules: [],
    status: "",
  };
}

export default function CourseForm({ editing, onCancel }: CourseFormProps) {
  const dispatch = useDispatch();

  const [form, setForm] = useState<CourseFormValues>(() =>
    createInitialForm(editing),
  );

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(createInitialForm(editing));
    setErrors({});
  }, [editing]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    if (name === "level") {
      setForm((previousForm) => ({
        ...previousForm,
        level: value as CourseFormValues["level"],
      }));
      return;
    }

    if (name === "status") {
      setForm((previousForm) => ({
        ...previousForm,
        status: value as CourseFormValues["status"],
      }));
      return;
    }

    const fieldName = name as TextInputField;

    setForm((previousForm) => ({
      ...previousForm,
      [fieldName]: value,
    }));
  };

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const thumbnailUrl = URL.createObjectURL(file);

    setForm((previousForm) => ({
      ...previousForm,
      thumbnail: thumbnailUrl,
    }));
  };

  const addModule = () => {
    const newModule: CourseModule = {
      title: "",
      chapters: [],
    };

    setForm((previousForm) => ({
      ...previousForm,
      modules: [...previousForm.modules, newModule],
    }));
  };

  const removeModule = (moduleIndex: number) => {
    setForm((previousForm) => ({
      ...previousForm,
      modules: previousForm.modules.filter((_, index) => index !== moduleIndex),
    }));
  };

  const updateModule = (moduleIndex: number, value: string) => {
    setForm((previousForm) => ({
      ...previousForm,
      modules: previousForm.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              title: value,
            }
          : module,
      ),
    }));
  };

  const addChapter = (moduleIndex: number) => {
    const newChapter: CourseChapter = {
      title: "",
      video: "",
    };

    setForm((previousForm) => ({
      ...previousForm,
      modules: previousForm.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              chapters: [...module.chapters, newChapter],
            }
          : module,
      ),
    }));
  };

  const removeChapter = (moduleIndex: number, chapterIndex: number) => {
    setForm((previousForm) => ({
      ...previousForm,
      modules: previousForm.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              chapters: module.chapters.filter(
                (_, currentIndex) => currentIndex !== chapterIndex,
              ),
            }
          : module,
      ),
    }));
  };

  const updateChapter = (
    moduleIndex: number,
    chapterIndex: number,
    field: keyof CourseChapter,
    value: string,
  ) => {
    setForm((previousForm) => ({
      ...previousForm,
      modules: previousForm.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              chapters: module.chapters.map((chapter, currentIndex) =>
                currentIndex === chapterIndex
                  ? {
                      ...chapter,
                      [field]: value,
                    }
                  : chapter,
              ),
            }
          : module,
      ),
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Course title is required";
    }

    if (!form.instructor.trim()) {
      newErrors.instructor = "Instructor name required";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category required";
    }

    if (!form.price.trim()) {
      newErrors.price = "Price required";
    }

    if (!form.duration.trim()) {
      newErrors.duration = "Duration required";
    }

    if (!form.level) {
      newErrors.level = "Level required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description required";
    }

    if (!form.thumbnail) {
      newErrors.thumbnail = "Thumbnail required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    /*
     * validate() boolean return করলেও TypeScript
     * form.thumbnail-এর null type সরাতে পারে না।
     */
    if (!validate() || !form.level || !form.thumbnail) {
      return;
    }

    const courseData: CourseWithoutId = {
      title: form.title.trim(),
      instructor: form.instructor.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      duration: form.duration.trim(),
      level: form.level,
      language: form.language.trim(),
      description: form.description.trim(),
      thumbnail: form.thumbnail,
      modules: form.modules,
      status: form.status || "Draft",
      students: editing?.students ?? 0,
    };

    if (editing) {
      dispatch(
        updateCourse({
          ...courseData,
          id: editing.id,
        }),
      );
    } else {
      dispatch(
        addCourse({
          ...courseData,
          id: Date.now(),
        }),
      );
    }

    onCancel();
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-900";

  const labelClass =
    "mb-1.5 block text-xs font-semibold text-slate-600 dark:text-zinc-400";

  return (
    <div className="h-fit w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between border-b border-slate-50 pb-4 dark:border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-xl p-2.5 ${
              editing
                ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            }`}
          >
            <BookOpen aria-hidden="true" size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {editing ? "Update Course Details" : "Create New Course"}
            </h2>

            <p className="text-xs text-slate-400 dark:text-zinc-500">
              {editing
                ? "Modify the course architecture below"
                : "Fill in the details to publish a new course"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Course Title</label>

            <input
              name="title"
              type="text"
              placeholder="e.g. Next.js Masterclass"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
            />

            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Instructor Name</label>

            <input
              name="instructor"
              type="text"
              placeholder="e.g. Jane Doe"
              value={form.instructor}
              onChange={handleChange}
              className={inputClass}
            />

            {errors.instructor && (
              <p className="mt-1 text-xs text-red-500">{errors.instructor}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Category</label>

            <input
              name="category"
              type="text"
              placeholder="e.g. Web Development"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            />

            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Price ($)</label>

            <input
              name="price"
              type="number"
              min="0"
              placeholder="e.g. 99"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
            />

            {errors.price && (
              <p className="mt-1 text-xs text-red-500">{errors.price}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Duration</label>

            <input
              name="duration"
              type="text"
              placeholder="e.g. 12 Hours"
              value={form.duration}
              onChange={handleChange}
              className={inputClass}
            />

            {errors.duration && (
              <p className="mt-1 text-xs text-red-500">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Difficulty Level</label>

            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className={`${inputClass} appearance-none`}
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {errors.level && (
              <p className="mt-1 text-xs text-red-500">{errors.level}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Publication Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`${inputClass} appearance-none`}
            >
              <option value="">Select Status</option>
              <option value="Published">Published</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Language</label>

            <input
              name="language"
              type="text"
              placeholder="e.g. English"
              value={form.language}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/30 p-4 sm:col-span-2 dark:border-zinc-700 dark:bg-zinc-800/20">
            <label className={labelClass}>Course Thumbnail</label>

            <div className="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-zinc-300"
              />

              {form.thumbnail && (
                <img
                  src={form.thumbnail}
                  alt="Course thumbnail preview"
                  className="h-20 w-32 rounded-xl border bg-white object-cover shadow-sm dark:border-zinc-700"
                />
              )}
            </div>

            {errors.thumbnail && (
              <p className="mt-1 text-xs text-red-500">{errors.thumbnail}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Course Description</label>

            <textarea
              name="description"
              placeholder="Write a comprehensive course overview..."
              value={form.description}
              onChange={handleChange}
              className={`${inputClass} h-28 resize-none`}
            />

            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-6 dark:border-zinc-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-zinc-200">
                <Layers
                  aria-hidden="true"
                  size={18}
                  className="text-indigo-500"
                />
                Course Modules
              </h3>

              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Add segments and structural topics for this course
              </p>
            </div>

            <button
              type="button"
              onClick={addModule}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-500/10 transition-all hover:bg-indigo-700 active:scale-95"
            >
              <Plus aria-hidden="true" size={14} />
              Add Module
            </button>
          </div>

          <div className="space-y-4">
            {form.modules.map((module, moduleIndex) => (
              <div
                key={moduleIndex}
                className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all dark:border-zinc-800 dark:bg-zinc-800/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 rounded-lg bg-slate-200/60 px-2.5 py-1 text-xs font-bold text-slate-400 dark:bg-zinc-800">
                    M-{moduleIndex + 1}
                  </div>

                  <input
                    type="text"
                    placeholder="Module title"
                    value={module.title}
                    onChange={(event) =>
                      updateModule(moduleIndex, event.target.value)
                    }
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => removeModule(moduleIndex)}
                    aria-label={`Remove module ${moduleIndex + 1}`}
                    className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                  >
                    <Trash2 aria-hidden="true" size={18} />
                  </button>
                </div>

                <div className="space-y-3 border-l-2 border-slate-200/60 pl-6 dark:border-zinc-800">
                  {module.chapters.map((chapter, chapterIndex) => (
                    <div
                      key={chapterIndex}
                      className="flex flex-col items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 sm:flex-row dark:border-zinc-800/80 dark:bg-zinc-900"
                    >
                      <input
                        type="text"
                        placeholder="Chapter title"
                        value={chapter.title}
                        onChange={(event) =>
                          updateChapter(
                            moduleIndex,
                            chapterIndex,
                            "title",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        type="url"
                        placeholder="Video URL"
                        value={chapter.video}
                        onChange={(event) =>
                          updateChapter(
                            moduleIndex,
                            chapterIndex,
                            "video",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() => removeChapter(moduleIndex, chapterIndex)}
                        aria-label={`Remove chapter ${chapterIndex + 1}`}
                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:text-red-500"
                      >
                        <Trash2 aria-hidden="true" size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addChapter(moduleIndex)}
                    className="mt-2 flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Video aria-hidden="true" size={14} />
                    Add Chapter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full gap-3 border-t border-slate-100 pt-4 sm:w-[50%] dark:border-zinc-800/60">
          <button
            type="submit"
            className="flex-1 cursor-pointer rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
          >
            {editing ? "Save Changes" : "Create Course"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X aria-hidden="true" size={15} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
