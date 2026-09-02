import type {
  CourseCatalogItem,
  CourseContentMap,
} from "@/types/studentCourse";

export const STUDENT_COURSES:
  readonly CourseCatalogItem[] = [
    {
      id: "nextjs-14",
      title:
        "Next.js 14 Ultra-Posh Development",
      instructor: "Jhankar Mahbub",
      level: "Advanced",
      rating: 4.9,
      price: "৳৪,৫০০",
      progress: 71,
      totalModules: 45,
      completedModules: 32,
    },
    {
      id: "tailwind-css",
      title:
        "Tailwind CSS Advanced Mechanics",
      instructor: "Sumit Saha",
      level: "Intermediate",
      rating: 4.8,
      price: "৳২,০০০",
      progress: 100,
      totalModules: 20,
      completedModules: 20,
    },
    {
      id: "prisma-backend",
      title:
        "Prisma Orchestration & PostgreSQL Masterclass",
      instructor: "Anisul Islam",
      level: "Advanced",
      rating: 4.9,
      price: "৳৩,৫০০",
      progress: 0,
      totalModules: 30,
      completedModules: 0,
    },
  ];

export const COURSE_DATA_MAP:
  CourseContentMap = {
    "nextjs-14": {
      courseTitle:
        "Next.js 14 Ultra-Posh Development",

      modules: [
        {
          id: 1,
          moduleTitle:
            "Phase 01: Next.js Core Architecture",

          videos: [
            {
              id: "n1",
              title:
                "01. Welcome & Next.js Framework Architecture",
              duration: "12:45",
              url: "https://vjs.zencdn.net/v/oceans.mp4",
            },
            {
              id: "n2",
              title:
                "02. Server Actions vs Client Components",
              duration: "24:10",
              url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            },
          ],
        },
        {
          id: 2,
          moduleTitle:
            "Phase 02: Advanced Streaming & PPR",

          videos: [
            {
              id: "n3",
              title:
                "03. Suspense & Partial Prerendering Deep Dive",
              duration: "18:55",
              url: "https://vjs.zencdn.net/v/oceans.mp4",
            },
          ],
        },
      ],
    },

    "tailwind-css": {
      courseTitle:
        "Tailwind CSS Advanced Mechanics",

      modules: [
        {
          id: 1,
          moduleTitle:
            "Phase 01: Design System & Config",

          videos: [
            {
              id: "t1",
              title:
                "01. Mastering Tailwind Configuration Engine",
              duration: "15:20",
              url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            },
            {
              id: "t2",
              title:
                "02. Arbitrary Variants & Complex Selectors",
              duration: "22:10",
              url: "https://vjs.zencdn.net/v/oceans.mp4",
            },
          ],
        },
      ],
    },

    "prisma-backend": {
      courseTitle:
        "Prisma Orchestration & PostgreSQL Masterclass",

      modules: [
        {
          id: 1,
          moduleTitle:
            "Phase 01: Database Modeling",

          videos: [
            {
              id: "p1",
              title:
                "01. Prisma Schema & PostgreSQL Hub Setup",
              duration: "19:40",
              url: "https://vjs.zencdn.net/v/oceans.mp4",
            },
            {
              id: "p2",
              title:
                "02. Advanced Relations and Fluent API",
              duration: "31:15",
              url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            },
          ],
        },
      ],
    },
  };