"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  Maximize,
  MessageSquare,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import { COURSE_DATA_MAP } from "@/data/studentCourses";

import {
  isCourseId,
  type CourseBottomTab,
  type CourseId,
  type CourseVideo,
} from "@/types/studentCourse";

function formatTime(timeInSeconds: number): string {
  if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(timeInSeconds / 60);

  const seconds = Math.floor(timeInSeconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    let videoId: string | null = null;

    if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.replace("/", "").trim() || null;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/")[2] ?? null;
      } else {
        videoId = parsedUrl.searchParams.get("v");
      }
    }

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
  } catch {
    return null;
  }
}

export default function WatchCourse() {
  const params = useParams<{ courseId: string }>();

  const rawCourseId = params.courseId ?? "";

  const courseId: CourseId = isCourseId(rawCourseId)
    ? rawCourseId
    : "nextjs-14";

  const activeCourse = COURSE_DATA_MAP[courseId];

  const modules = activeCourse.modules;

  const videoRef = useRef<HTMLVideoElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState<number>(0);

  const [duration, setDuration] = useState<number>(0);

  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [playbackRate, setPlaybackRate] = useState<number>(1);

  const [showControls, setShowControls] = useState<boolean>(true);

  const [currentVideo, setCurrentVideo] = useState<CourseVideo>(
    modules[0].videos[0],
  );

  const [activeBottomTab, setActiveBottomTab] =
    useState<CourseBottomTab>("discussion");

  const [expandedModule, setExpandedModule] = useState<number | null>(
    modules[0].id,
  );

  const youtubeEmbedUrl = getYouTubeEmbedUrl(currentVideo.url);

  /*
   * URL-এর courseId পরিবর্তন হলে সেই course-এর
   * প্রথম video ও module select হবে।
   */
  useEffect(() => {
    setCurrentVideo(activeCourse.modules[0].videos[0]);

    setExpandedModule(activeCourse.modules[0].id);

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [activeCourse]);

  /*
   * Video পরিবর্তন হলে নতুন media load হবে।
   */
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.load();
    }
  }, [currentVideo.url]);

  /*
   * Video চললে ৩ সেকেন্ড পর controls hide হবে।
   */
  useEffect(() => {
    if (!isPlaying || !showControls) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isPlaying, showControls]);

  const togglePlay = (): void => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (videoElement.paused) {
      void videoElement.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      videoElement.pause();
    }
  };

  const handleTimeUpdate = (): void => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    setCurrentTime(videoElement.currentTime);
  };

  const handleLoadedMetadata = (): void => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    setDuration(
      Number.isFinite(videoElement.duration) ? videoElement.duration : 0,
    );
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>): void => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    const seekTime = Number(event.target.value);

    videoElement.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const toggleMute = (): void => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    videoElement.muted = !videoElement.muted;

    setIsMuted(videoElement.muted);
  };

  const handleSpeedChange = (rate: number): void => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    videoElement.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = async (): Promise<void> => {
    const containerElement = containerRef.current;

    if (!containerElement) {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await containerElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      window.alert("Fullscreen mode is not available.");
    }
  };

  const handleVideoSelect = (video: CourseVideo): void => {
    setCurrentVideo(video);

    const isYouTubeVideo = getYouTubeEmbedUrl(video.url) !== null;

    if (isYouTubeVideo) {
      return;
    }

    /*
     * State update-এর পরে নতুন video element
     * render হওয়ার জন্য অল্প সময় অপেক্ষা।
     */
    window.setTimeout(() => {
      const videoElement = videoRef.current;

      if (!videoElement) {
        return;
      }

      void videoElement.play().catch(() => {
        setIsPlaying(false);
      });
    }, 100);
  };

  return (
    <DashboardLayout>
      <div className="relative flex min-h-screen flex-col bg-zinc-50 text-zinc-900 antialiased lg:flex-row dark:bg-zinc-950 dark:text-white">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/4 top-0 h-[350px] w-[350px] rounded-full bg-indigo-500/5 blur-[100px] dark:bg-indigo-500/10" />

        {/* Player side */}
        <div className="flex-1 space-y-5 overflow-y-auto p-4 lg:p-8">
          {/* Back navigation */}
          <div className="flex items-center justify-between gap-4 pb-2">
            <Link
              href="/student/courses"
              className="group flex w-fit items-center gap-2 text-xs font-bold text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-0.5"
              />

              <span>Back to Course Vault</span>
            </Link>

            <span className="rounded-md border bg-zinc-100 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
              Cohort: {courseId}
            </span>
          </div>

          {/* Video player */}
          <div
            ref={containerRef}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => {
              if (isPlaying) {
                setShowControls(false);
              }
            }}
            className="group relative aspect-video w-full select-none overflow-hidden rounded-3xl border border-zinc-200/80 bg-black shadow-2xl transition-all duration-300 dark:border-zinc-800/80"
          >
            {youtubeEmbedUrl ? (
              <iframe
                key={currentVideo.id}
                src={youtubeEmbedUrl}
                title={currentVideo.title}
                className="h-full w-full rounded-3xl border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center">
                <video
                  key={currentVideo.id}
                  ref={videoRef}
                  src={currentVideo.url}
                  playsInline
                  preload="metadata"
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  className="h-full w-full cursor-pointer rounded-3xl object-cover"
                />

                {/* Controls overlay */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between rounded-3xl bg-gradient-to-t from-black/60 via-transparent to-black/30 p-4 transition-opacity duration-300 ${
                    showControls
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                >
                  <div className="flex items-center justify-between text-white/80">
                    <span className="line-clamp-1 max-w-[80%] rounded-md border border-white/5 bg-black/40 px-2.5 py-1 text-[10px] font-medium tracking-wide backdrop-blur-md">
                      {currentVideo.title}
                    </span>
                  </div>

                  {!isPlaying && (
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label="Play video"
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-white/10 p-4 text-white shadow-xl backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-white/20"
                    >
                      <Play size={18} className="ml-0.5 fill-current" />
                    </button>
                  )}

                  <div className="w-full space-y-2 px-1">
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      aria-label="Video timeline"
                      className="h-[3px] w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-indigo-500 transition-all duration-150 hover:h-[5px]"
                    />

                    <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={togglePlay}
                          aria-label={isPlaying ? "Pause video" : "Play video"}
                          className="cursor-pointer transition hover:text-white"
                        >
                          {isPlaying ? (
                            <Pause size={13} className="fill-current" />
                          ) : (
                            <Play size={13} className="fill-current" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={toggleMute}
                          aria-label={isMuted ? "Unmute video" : "Mute video"}
                          className="cursor-pointer transition hover:text-white"
                        >
                          {isMuted ? (
                            <VolumeX size={14} />
                          ) : (
                            <Volume2 size={14} />
                          )}
                        </button>

                        <div className="font-mono text-[11px] tracking-tight text-zinc-400">
                          <span className="text-white">
                            {formatTime(currentTime)}
                          </span>

                          <span className="mx-1">/</span>

                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <div className="flex rounded-md border border-white/10 bg-white/5 p-0.5 text-[9px] font-black backdrop-blur-md">
                          {[1, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              type="button"
                              onClick={() => handleSpeedChange(rate)}
                              className={`cursor-pointer rounded-sm px-1.5 py-0.5 transition ${
                                playbackRate === rate
                                  ? "bg-indigo-600 text-white"
                                  : "text-zinc-400 hover:text-white"
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            void toggleFullscreen();
                          }}
                          aria-label="Toggle fullscreen"
                          className="cursor-pointer transition hover:text-white"
                        >
                          <Maximize size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video details */}
          <div className="flex items-start justify-between border-b border-zinc-200/60 pb-4 dark:border-zinc-900">
            <div className="space-y-1">
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                <Sparkles size={10} className="animate-pulse" />

                {activeCourse.courseTitle}
              </span>

              <h1 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                {currentVideo.title}
              </h1>
            </div>
          </div>

          {/* Bottom tabs */}
          <div className="space-y-4">
            <div className="flex w-fit gap-2 rounded-xl border bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900/60">
              <button
                type="button"
                onClick={() => setActiveBottomTab("discussion")}
                className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  activeBottomTab === "discussion"
                    ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-white"
                    : "text-zinc-400"
                }`}
              >
                <MessageSquare size={12} />
                Live Forum
              </button>

              <button
                type="button"
                onClick={() => setActiveBottomTab("notes")}
                className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  activeBottomTab === "notes"
                    ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-white"
                    : "text-zinc-400"
                }`}
              >
                <FileText size={12} />
                Instructor Notes
              </button>
            </div>

            <div className="min-h-36 rounded-2xl border border-zinc-200/50 bg-white/50 p-5 dark:border-zinc-800/60 dark:bg-zinc-900/10">
              {activeBottomTab === "discussion" ? (
                <div className="space-y-4 animate-in duration-200 fade-in">
                  <div className="flex gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Naimur"
                      alt="Naimur Rahman"
                      className="h-7 w-7 rounded-lg bg-zinc-100"
                    />

                    <div className="flex-1 rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-900">
                      <p className="text-[11px] font-bold text-indigo-500">
                        Naimur Rahman •{" "}
                        <span className="font-normal text-zinc-400">
                          2 mins ago
                        </span>
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-700 dark:text-zinc-300">
                        ভাইয়া, PostgreSQL Docker container run করার সময় port
                        blocked দেখাচ্ছে। সমাধান কী?
                      </p>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Drop your query inside this cohort..."
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </div>
              ) : (
                <div className="space-y-2 text-xs font-medium leading-relaxed text-zinc-600 animate-in duration-200 fade-in dark:text-zinc-400">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">
                    📌 Module memo and source links
                  </p>

                  <ul className="list-inside list-disc space-y-1 pl-1">
                    <li>Project source GitHub link will be available here.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course module sidebar */}
        <aside className="w-full space-y-6 overflow-y-auto border-t border-zinc-200 bg-white p-6 lg:w-96 lg:border-l lg:border-t-0 dark:border-zinc-900 dark:bg-zinc-950/40">
          <div>
            <h2 className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-zinc-400">
              <Layers size={12} className="text-indigo-500" />
              Course Playdeck
            </h2>

            <p className="mt-0.5 text-[11px] text-zinc-400">
              {modules.length} Core Phases Available
            </p>
          </div>

          <div className="space-y-3">
            {modules.map((courseModule) => (
              <div
                key={courseModule.id}
                className="overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50/50 dark:border-zinc-900 dark:bg-zinc-950/20"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedModule(
                      expandedModule === courseModule.id
                        ? null
                        : courseModule.id,
                    )
                  }
                  className="flex w-full cursor-pointer items-center justify-between bg-zinc-100/60 p-4 transition hover:bg-zinc-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60"
                >
                  <span className="line-clamp-1 text-left text-xs font-black tracking-tight text-zinc-800 dark:text-zinc-200">
                    {courseModule.moduleTitle}
                  </span>

                  {expandedModule === courseModule.id ? (
                    <ChevronUp size={14} className="text-zinc-400" />
                  ) : (
                    <ChevronDown size={14} className="text-zinc-400" />
                  )}
                </button>

                {expandedModule === courseModule.id && (
                  <div className="divide-y divide-zinc-100/50 border-t p-2 animate-in duration-200 slide-in-from-top-2 dark:divide-zinc-900/30 dark:border-zinc-900">
                    {courseModule.videos.map((video) => {
                      const isActiveVideo = video.id === currentVideo.id;

                      return (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => handleVideoSelect(video)}
                          className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl p-3 text-left transition ${
                            isActiveVideo
                              ? "border border-indigo-500/20 bg-indigo-500/5 shadow-xs dark:bg-indigo-500/10"
                              : "hover:bg-zinc-100/50 dark:hover:bg-zinc-900/20"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Play
                              size={10}
                              className={
                                isActiveVideo
                                  ? "fill-current text-indigo-500"
                                  : "text-zinc-400"
                              }
                            />

                            <span
                              className={`line-clamp-1 text-xs font-bold ${
                                isActiveVideo
                                  ? "text-indigo-600 dark:text-indigo-400"
                                  : "text-zinc-700 dark:text-zinc-300"
                              }`}
                            >
                              {video.title}
                            </span>
                          </div>

                          <span className="shrink-0 rounded-md border bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
                            {video.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
