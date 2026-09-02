export type CourseCategory =
  | "Development"
  | "Design"
  | "Marketing";

export type CourseLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export interface CourseModule {
  title: string;
  lessons: string[];
}

export interface Course {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  price: string;
  originalPrice: string;
  rating: number;
  students: string;
  image: string;
  tag: CourseCategory;
  duration: string;
  totalLessons: number;
  level: CourseLevel;
  language: string;
  instructor: {
    name: string;
    role: string;
  };
  highlights: string[];
  curriculum: CourseModule[];
}

export const COURSES: Course[] = [
  {
    id: 1,
    title: "Full Stack Web Mastery",
    shortDescription:
      "Build modern production-ready applications with React, Next.js and Node.js.",
    description:
      "A complete full-stack development program designed to take you from core web fundamentals to building and deploying professional applications.",
    price: "$99",
    originalPrice: "$149",
    rating: 4.9,
    students: "12k+",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=90",
    tag: "Development",
    duration: "16 weeks",
    totalLessons: 84,
    level: "Intermediate",
    language: "English",
    instructor: {
      name: "Alex Morgan",
      role: "Senior Full Stack Engineer",
    },
    highlights: [
      "Build five production-ready projects",
      "Learn React, Next.js, Node.js and databases",
      "Weekly live mentorship sessions",
      "Lifetime access to course updates",
      "Professional certificate after completion",
    ],
    curriculum: [
      {
        title: "Web Development Foundations",
        lessons: [
          "Modern HTML and semantic structure",
          "Responsive CSS and Tailwind CSS",
          "JavaScript fundamentals",
        ],
      },
      {
        title: "React and Next.js",
        lessons: [
          "React components, props and state",
          "Next.js App Router",
          "Server and Client Components",
        ],
      },
      {
        title: "Backend Development",
        lessons: [
          "Building REST APIs",
          "Authentication and authorization",
          "Database integration",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "UI/UX Advanced Design",
    shortDescription:
      "Design thoughtful digital products through research, systems and prototyping.",
    description:
      "Learn how professional designers research users, build design systems and create polished interfaces for modern digital products.",
    price: "$79",
    originalPrice: "$119",
    rating: 4.8,
    students: "8k+",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=90",
    tag: "Design",
    duration: "12 weeks",
    totalLessons: 62,
    level: "Intermediate",
    language: "English",
    instructor: {
      name: "Sarah Williams",
      role: "Senior Product Designer",
    },
    highlights: [
      "Create a professional design portfolio",
      "Master wireframing and prototyping",
      "Build scalable design systems",
      "Receive expert portfolio feedback",
      "Professional certificate after completion",
    ],
    curriculum: [
      {
        title: "Design Foundations",
        lessons: [
          "Visual design principles",
          "Typography and color systems",
          "Layout and spacing",
        ],
      },
      {
        title: "User Experience",
        lessons: [
          "User research",
          "User personas and journeys",
          "Information architecture",
        ],
      },
      {
        title: "Advanced Product Design",
        lessons: [
          "Interactive prototyping",
          "Usability testing",
          "Portfolio case studies",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Digital Marketing Strategy",
    shortDescription:
      "Create data-driven marketing campaigns that attract and convert customers.",
    description:
      "Understand modern digital marketing channels and learn how to create, measure and improve effective marketing campaigns.",
    price: "$59",
    originalPrice: "$99",
    rating: 4.7,
    students: "15k+",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=90",
    tag: "Marketing",
    duration: "10 weeks",
    totalLessons: 48,
    level: "Beginner",
    language: "English",
    instructor: {
      name: "Daniel Carter",
      role: "Digital Marketing Strategist",
    },
    highlights: [
      "Create complete marketing strategies",
      "Learn SEO and content marketing",
      "Understand paid advertising",
      "Measure campaigns with analytics",
      "Professional certificate after completion",
    ],
    curriculum: [
      {
        title: "Marketing Foundations",
        lessons: [
          "Understanding target audiences",
          "Brand positioning",
          "Customer journey mapping",
        ],
      },
      {
        title: "Organic Marketing",
        lessons: [
          "Search engine optimization",
          "Content marketing",
          "Social media strategy",
        ],
      },
      {
        title: "Performance Marketing",
        lessons: [
          "Paid advertising",
          "Conversion optimization",
          "Marketing analytics",
        ],
      },
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((course) => course.id === Number(id));
}