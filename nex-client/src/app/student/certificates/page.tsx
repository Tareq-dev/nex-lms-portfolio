"use client";

import { type ChangeEvent, useMemo, useState } from "react";

import {
  Award,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  Linkedin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

type Certificate = {
  id: string;
  title: string;
  instructor: string;
  issueDate: string;
  credentialUrl: string;
  grade: string;
  type: string;
  isFeatured: boolean;
};

const CERTIFICATES_DATA: readonly Certificate[] = [
  {
    id: "CERT-2026-9041",
    title: "Advanced Next.js 14 & Enterprise Architecture",
    instructor: "Alex Mercer",
    issueDate: "May 2026",
    credentialUrl: "#",
    grade: "A+ (94%)",
    type: "Professional",
    isFeatured: true,
  },
  {
    id: "CERT-2026-3122",
    title: "Full-Stack Web Development Mastery (MERN)",
    instructor: "Fahim Murshed",
    issueDate: "February 2026",
    credentialUrl: "#",
    grade: "A (88%)",
    type: "Masterclass",
    isFeatured: false,
  },
  {
    id: "CERT-2025-0845",
    title: "UI/UX Design Systems for Developers",
    instructor: "Sarah Jenkins",
    issueDate: "December 2025",
    credentialUrl: "#",
    grade: "Pass",
    type: "Workshop",
    isFeatured: false,
  },
];

export default function Certificates() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const normalizedSearch = searchQuery.trim().toLowerCase();

   
  const featuredCertificate = CERTIFICATES_DATA.find(
    (certificate) => certificate.isFeatured,
  );

  const filteredCertificates = useMemo<Certificate[]>(() => {
    if (!normalizedSearch) {
      return [...CERTIFICATES_DATA];
    }

    return CERTIFICATES_DATA.filter((certificate) => {
      const searchableContent = [
        certificate.title,
        certificate.instructor,
        certificate.id,
        certificate.type,
        certificate.grade,
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalizedSearch);
    });
  }, [normalizedSearch]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  const handleDownload = (certificate: Certificate): void => {
    /*
     * এখন dummy functionality।
     * Backend যুক্ত করার পরে এখানে API call করে PDF Blob download করবে।
     */
    window.alert(
      `Download API is not connected yet.\nCertificate: ${certificate.id}`,
    );
  };

  const handleLinkedInShare = (certificate: Certificate): void => {
    const shareUrl = new URL("https://www.linkedin.com/sharing/share-offsite/");

    /*
     * credentialUrl এখন "#" হওয়ায় বর্তমান website URL ব্যবহার করা হচ্ছে।
     * Backend এ real verification URL পাওয়ার পরে সেটি ব্যবহার করবে।
     */
    const credentialUrl =
      certificate.credentialUrl === "#"
        ? window.location.href
        : certificate.credentialUrl;

    shareUrl.searchParams.set("url", credentialUrl);

    window.open(
      shareUrl.toString(),
      "_blank",
      "noopener,noreferrer,width=700,height=600",
    );
  };

  return (
    <DashboardLayout>
      <div className="relative min-h-screen space-y-8 overflow-hidden bg-zinc-50 p-4 text-zinc-900 antialiased lg:p-8 dark:bg-zinc-950 dark:text-white">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute right-1/4 top-0 h-[350px] w-[350px] animate-pulse rounded-full bg-amber-500/10 blur-[100px] dark:bg-amber-500/5" />

        <div className="pointer-events-none absolute bottom-10 left-10 h-[250px] w-[250px] rounded-full bg-indigo-600/5 blur-[90px] dark:bg-indigo-500/5" />

        {/* Header */}
        <div className="relative z-10 flex flex-col gap-4 border-b border-zinc-200/60 pb-6 md:flex-row md:items-center md:justify-between dark:border-zinc-900">
          <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
              <Sparkles size={12} />
              Credentials & Badges
            </span>

            <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
              Verified Certificates
              <Award className="text-amber-500" size={24} />
            </h1>

            <p className="text-xs font-medium text-zinc-400">
              Your official academic achievements and industry-recognized
              milestones.
            </p>
          </div>

          {/* Search */}
          <div className="group relative w-full md:w-80">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-amber-500"
            />

            <input
              type="search"
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium backdrop-blur-md transition-all outline-none focus:border-amber-500/50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:focus:border-amber-400/30"
            />
          </div>
        </div>

        {/* Featured Certificate */}
        {!normalizedSearch && featuredCertificate && (
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-zinc-100/50 to-transparent p-6 shadow-xl md:flex-row lg:p-8 dark:border-amber-500/20 dark:from-amber-500/10 dark:via-zinc-900/40 dark:to-zinc-950">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 md:h-20 md:w-20">
                <Award size={36} strokeWidth={1.5} />
              </div>

              <div className="space-y-2">
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Featured Credential
                </span>

                <h2 className="text-base font-black tracking-tight text-zinc-800 md:text-xl dark:text-zinc-100">
                  {featuredCertificate.title}
                </h2>

                <p className="text-xs font-medium text-zinc-400">
                  Issued by Authorized Lead:{" "}
                  <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                    {featuredCertificate.instructor}
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-medium text-zinc-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar size={12} />
                    {featuredCertificate.issueDate}
                  </span>

                  <span className="flex items-center gap-1 font-mono">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    ID: {featuredCertificate.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Actions */}
            <div className="flex w-full shrink-0 flex-row justify-end gap-2.5 md:w-auto md:flex-col lg:flex-row">
              <button
                type="button"
                onClick={() => handleDownload(featuredCertificate)}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-95 md:flex-none dark:bg-white dark:text-zinc-950"
              >
                <Download size={14} />
                Download PDF
              </button>

              <button
                type="button"
                onClick={() => handleLinkedInShare(featuredCertificate)}
                title="Share on LinkedIn"
                aria-label="Share certificate on LinkedIn"
                className="flex cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white/50 p-2.5 text-zinc-600 shadow-2xs transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Linkedin
                  size={14}
                  className="fill-current text-blue-600 dark:text-blue-400"
                />
              </button>
            </div>
          </div>
        )}

        {/* Certificate Grid */}
        <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((certificate) => (
              <div
                key={certificate.id}
                className="group relative flex flex-col justify-between gap-5 rounded-2xl border border-zinc-200/60 bg-white/70 p-5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-zinc-300 dark:border-zinc-900 dark:bg-zinc-900/20 dark:hover:border-zinc-800"
              >
                {/* Card Top */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:border dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                      {certificate.type}
                    </span>

                    <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={10} />
                      Grade: {certificate.grade}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="line-clamp-2 text-sm font-black tracking-tight text-zinc-800 transition-colors group-hover:text-amber-500 dark:text-zinc-100 dark:group-hover:text-amber-400">
                      {certificate.title}
                    </h3>

                    <p className="text-[11px] font-medium text-zinc-400">
                      By {certificate.instructor}
                    </p>
                  </div>
                </div>

                {/* Card Bottom */}
                <div className="flex items-center justify-between gap-4 border-t border-zinc-100 pt-3 dark:border-zinc-900/60">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] font-black uppercase tracking-wider text-zinc-400">
                      ID: {certificate.id}
                    </span>

                    <span className="text-[10px] font-medium text-zinc-500">
                      {certificate.issueDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDownload(certificate)}
                      title="Download Certificate"
                      aria-label={`Download ${certificate.title}`}
                      className="cursor-pointer rounded-lg border border-zinc-200/60 p-2 text-zinc-600 shadow-3xs transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                    >
                      <Download size={13} />
                    </button>

                    <a
                      href={certificate.credentialUrl}
                      title="Verify on Platform"
                      aria-label={`Verify ${certificate.title}`}
                      className="flex items-center gap-1 rounded-lg bg-zinc-900 p-2 text-[11px] font-bold text-white shadow-2xs transition hover:opacity-90 dark:bg-white dark:text-zinc-950"
                    >
                      <ExternalLink size={12} />
                      Verify
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-xs font-medium text-zinc-400 dark:border-zinc-800">
              No verified credentials found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Verification Footer */}
        <div className="relative z-10 mx-auto max-w-5xl pt-6 text-center">
          <p className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            All certificates generated by EduPulse LMS are secured via unique ID
            cryptographic verification.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
