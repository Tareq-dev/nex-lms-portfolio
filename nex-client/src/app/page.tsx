"use client";
import React, { useState } from "react";

import FloatingNavbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Sponsorship from "@/components/home/Sponsorship";
import VideoIntro from "@/components/home/VideoIntro";
import Benefits from "@/components/home/Benefits";
import CoursesCard from "@/components/home/CoursesCard";
import HowToStart from "@/components/home/HowToStart";
import Mentors from "@/components/home/Mentors";
import Footer from "@/components/home/Footer";
import BackToTop from "@/components/home/BackToTop";

export default function LandingPage() {
  return (
    <div className="relative bg-[#050505] text-white selection:bg-blue-500 selection:text-white">
      {/* --- Floating Navbar --- */}

      <FloatingNavbar />

      {/* --- Hero Section --- */}
      <Hero />

      {/* --- Sponsorship / Brands --- */}
      <Sponsorship />

      {/* --- Video Intro Section --- */}
      <VideoIntro />

      {/* --- Why Buy / Benefits --- */}
      <Benefits />

      {/* --- Courses Section --- */}

      <CoursesCard />
      {/* --- How to Start (Process) --- */}
      <HowToStart />

      {/* --- Mentors Section --- */}
      <Mentors />

      {/* --- Footer --- */}
      <Footer />
      <BackToTop />
    </div>
  );
}
