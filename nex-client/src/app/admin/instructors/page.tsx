"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { UserPlus, X } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AddInstructorForm from "@/components/instructors/AddInstructorForm";
import InstructorsTable from "@/components/instructors/InstructorsTable";

import type {
  Instructor,
  InstructorFormData,
  InstructorId,
} from "@/types/instructor";

const initialFormData: InstructorFormData = {
  name: "",
  email: "",
  designation: "",
  education: "",
  job: "",
  phone: "",
  courses: "",
};

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([
    {
      id: 1,
      name: "Anisul Islam",
      email: "anisul@lms.com",
      designation: "Senior Software Engineer",
      education: "BSc in CSE",
      job: "Google",
      phone: "01712345678",
      courses: "MERN Stack, Next.js",
      status: "Active",
    },
  ]);

  const [editingId, setEditingId] = useState<InstructorId | null>(null);

  const [showForm, setShowForm] = useState<boolean>(false);

  const [formData, setFormData] = useState<InstructorFormData>(initialFormData);

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setShowForm(true);
  };

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const fieldName = event.target.name as keyof InstructorFormData;

    const fieldValue = event.target.value;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [fieldName]: fieldValue,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId !== null) {
      setInstructors((previousInstructors) =>
        previousInstructors.map((instructor) =>
          instructor.id === editingId
            ? {
                ...instructor,
                ...formData,
              }
            : instructor,
        ),
      );

      resetForm();
      return;
    }

    const newInstructor: Instructor = {
      id: Date.now(),
      ...formData,
      status: "Active",
    };

    setInstructors((previousInstructors) => [
      newInstructor,
      ...previousInstructors,
    ]);

    resetForm();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-100 p-6 dark:bg-zinc-950">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Instructors Management
            </h1>

            <p className="mt-1 text-slate-500">
              Manage panel members, teachers, and their credentials
            </p>
          </div>

          {!showForm ? (
            <button
              type="button"
              onClick={openCreateForm}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              <UserPlus aria-hidden="true" size={18} />
              Add Instructor
            </button>
          ) : (
            <button
              type="button"
              onClick={resetForm}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              <X aria-hidden="true" size={18} />
              Close Form
            </button>
          )}
        </div>

        <div>
          {showForm ? (
            <AddInstructorForm
              editingId={editingId}
              resetForm={resetForm}
              handleSubmit={handleSubmit}
              formData={formData}
              handleChange={handleChange}
            />
          ) : (
            <InstructorsTable
              instructors={instructors}
              setInstructors={setInstructors}
              setEditingId={setEditingId}
              setShowForm={setShowForm}
              setFormData={setFormData}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
