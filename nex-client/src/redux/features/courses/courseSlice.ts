import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  Course,
  CourseId,
  CoursesState,
} from "@/types/course";

const initialState: CoursesState = {
  courses: [
    {
      id: 1,
      title: "Complete React Bootcamp",
      instructor: "John Doe",
      category: "Frontend",
      description:
        "Learn React from scratch and build powerful single-page applications.",
      price: 49,
      duration: "6 Weeks",
      level: "Beginner",
      students: 120,
      status: "Published",
      thumbnail: "",
      modules: [
        {
          title: "React Basics",
          chapters: [
            {
              title: "What is React",
              video:
                "https://www.youtube.com/watch?v=xqoYkX4hfwg&t=13792s",
            },
            {
              title: "JSX Introduction",
              video:
                "https://www.youtube.com/watch?v=xqoYkX4hfwg&t=13792s",
            },
          ],
        },
        {
          title: "React Hooks",
          chapters: [
            {
              title: "useState Hook",
              video:
                "https://www.youtube.com/watch?v=xqoYkX4hfwg&t=13792s",
            },
            {
              title: "useEffect Hook",
              video:
                "https://www.youtube.com/watch?v=xqoYkX4hfwg&t=13792s",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Next.js Mastery",
      instructor: "Sarah Ali",
      category: "Frontend",
      description:
        "Learn Next.js from scratch and build powerful server-rendered React applications with ease.",
      price: 59,
      level: "Intermediate",
      duration: "5 Weeks",
      students: 80,
      status: "Published",
      thumbnail: "",
      modules: [
        {
          title: "Next.js Fundamentals",
          chapters: [
            {
              title: "App Router",
              video:
                "https://www.youtube.com/watch?v=xqoYkX4hfwg&t=13792s",
            },
            {
              title: "Layouts & Pages",
              video:
                "https://www.youtube.com/watch?v=xqoYkX4hfwg&t=13792s",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Node.js API Development",
      instructor: "Mike Ross",
      category: "Backend",
      description:
        "Learn to build powerful RESTful APIs with Node.js and Express.",
      price: 45,
      duration: "4 Weeks",
      level: "Intermediate",
      students: 95,
      status: "Draft",
      thumbnail: "",
      modules: [
        {
          title: "Node Basics",
          chapters: [
            {
              title: "Intro to Node",
              video:
                "https://www.youtube.com/watch?v=xqoYkX4hfwg&t=13792s",
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: "UI UX Design",
      instructor: "Jessica",
      category: "Design",
      description:
        "Master the principles of UI/UX design and create stunning user interfaces.",
      price: 39,
      duration: "3 Weeks",
      level: "Beginner",
      students: 140,
      status: "Published",
      thumbnail: "",
      modules: [],
    },
    {
      id: 5,
      title: "MongoDB Database",
      instructor: "David",
      category: "Backend",
      description:
        "Learn MongoDB from scratch and build powerful NoSQL databases for your applications.",
      price: 30,
      duration: "2 Weeks",
      level: "Beginner",
      students: 60,
      status: "Published",
      thumbnail: "",
      modules: [],
    },
    {
      id: 6,
      title: "Full Stack MERN",
      instructor: "Alex",
      category: "Fullstack",
      description:
        "Become a full stack MERN developer and build complete web applications using MongoDB, Express, React, and Node.js.",
      price: 99,
      duration: "8 Weeks",
      level: "Advanced",
      students: 200,
      status: "Published",
      thumbnail: "",
      modules: [
        {
          title: "MERN Introduction",
          chapters: [
            {
              title: "Stack Overview",
              video:
                "https://www.youtube.com/watch?v=xqoYkX4hfwg&t=13792s",
            },
          ],
        },
      ],
    },
    {
      id: 7,
      title: "TypeScript for Devs",
      instructor: "Andrew",
      category: "Programming",
      description:
        "Learn TypeScript from scratch and add strong typing to your JavaScript projects for improved reliability and maintainability.",
      price: 29,
      duration: "2 Weeks",
      level: "Beginner",
      students: 50,
      status: "Draft",
      thumbnail: "",
      modules: [],
    },
    {
      id: 8,
      title: "Tailwind CSS Pro",
      instructor: "Chris",
      category: "Frontend",
      description:
        "Master Tailwind CSS and rapidly build beautiful, responsive user interfaces with utility-first CSS.",
      price: 25,
      duration: "1 Week",
      level: "Intermediate",
      students: 70,
      status: "Published",
      thumbnail: "",
      modules: [],
    },
  ],
};

const courseSlice = createSlice({
  name: "courses",
  initialState,

  reducers: {
    addCourse: (
      state,
      action: PayloadAction<Course>,
    ) => {
      state.courses.push(action.payload);
    },

    updateCourse: (
      state,
      action: PayloadAction<Course>,
    ) => {
      const courseIndex = state.courses.findIndex(
        (course) =>
          course.id === action.payload.id,
      );

      if (courseIndex === -1) {
        return;
      }

      state.courses[courseIndex] = action.payload;
    },

    deleteCourse: (
      state,
      action: PayloadAction<CourseId>,
    ) => {
      state.courses = state.courses.filter(
        (course) =>
          course.id !== action.payload,
      );
    },
  },
});

export const {
  addCourse,
  updateCourse,
  deleteCourse,
} = courseSlice.actions;

export default courseSlice.reducer;