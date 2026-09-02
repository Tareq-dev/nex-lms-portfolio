"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import AddstudentForm from "@/components/students/AddstudentForm";
import StudentsTable from "@/components/students/StudentsTable";

export default function StudentsPage() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Tarequl Islam",
      email: "tareq@gmail.com",
      course: "MERN Stack",
      phone: "01812345678",
      date: "2026-06-01",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahim Uddin",
      email: "rahim@gmail.com",
      course: "Next.js",
      phone: "01700000000",
      date: "2026-06-05",
      status: "Active",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    phone: "",
    date: "",
  });

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      course: "",
      phone: "",
      date: "",
    });

    setShowForm(false);
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editingId ? { ...student, ...formData } : student,
        ),
      );

      resetForm();
      return;
    }

    const newStudent = {
      id: Date.now(),
      ...formData,
      status: "Active",
    };

    setStudents((prev) => [newStudent, ...prev]);

    resetForm();
  };
console.log(editingId);
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-100 p-6 dark:bg-zinc-950">
        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Students Management
            </h1>

            <p className="mt-1 text-slate-500">
              Manage all LMS students from one place
            </p>
          </div>

          {!showForm ? (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              <UserPlus size={18} />
              Add Student
            </button>
          ) : (
            <button
              onClick={resetForm}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              <X /> Close Form
            </button>
          )}
        </div>

        
        <div>
          {/* FORM */}

          {showForm ? (
            <AddstudentForm
              editingId={editingId}
              resetForm={resetForm}
              handleSubmit={handleSubmit}
              formData={formData}
              handleChange={handleChange}
            />
          ) : (
            <StudentsTable
              students={students} setShowForm={setShowForm}
              setStudents={setStudents}
              setFormData={setFormData}
              setEditingId={setEditingId}
            />
          )}

          {/* TABLE */}
        </div>
      </div>
    </DashboardLayout>
  );
}
