"use client";

import { useState } from "react";
import type { AcademyCourse, AcademyCourseStatus, AcademyCourseTrack } from "@/lib/academy/types";

type View = "CATALOG" | "MY_LEARNING";

export default function AcademyLearningConsole({ courses, categories, tracks }: { courses: readonly AcademyCourse[]; categories: readonly string[]; tracks: readonly AcademyCourseTrack[] }) {
  const [view, setView] = useState<View>("CATALOG");
  const [courseCategory, setCourseCategory] = useState("ALL");
  const [trackCategory, setTrackCategory] = useState("ALL");
  const [status, setStatus] = useState<AcademyCourseStatus | "ALL">("ALL");
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);
  const [requestedCourseIds, setRequestedCourseIds] = useState<ReadonlySet<string>>(new Set());
  const visibleCourses = courses.filter((course) => (courseCategory === "ALL" || course.category === courseCategory) && (status === "ALL" || course.status === status));
  const requestedCourses = courses.filter((course) => requestedCourseIds.has(course.courseId));

  return (
    <section className="apc-card p-6" aria-labelledby="academy-learning-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="academy-learning-heading" className="text-2xl font-black">Learning and enrollment</h2>
          <p className="mt-2 text-sm text-zinc-600">Course status comes from the local course snapshot. Enrollment requests are session-only.</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Learning view">
          <button type="button" aria-pressed={view === "CATALOG"} onClick={() => setView("CATALOG")} className={`rounded-lg border px-3 py-2 text-sm font-bold ${view === "CATALOG" ? "border-[#c1121f] bg-red-50 text-[#c1121f]" : "border-zinc-300 text-zinc-700"}`}>Course catalog</button>
          <button type="button" aria-pressed={view === "MY_LEARNING"} onClick={() => setView("MY_LEARNING")} className={`rounded-lg border px-3 py-2 text-sm font-bold ${view === "MY_LEARNING" ? "border-[#c1121f] bg-red-50 text-[#c1121f]" : "border-zinc-300 text-zinc-700"}`}>My learning ({requestedCourses.length})</button>
        </div>
      </div>

      {view === "CATALOG" ? (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-zinc-700">
              Category
              <select value={courseCategory} onChange={(event) => setCourseCategory(event.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2">
                <option value="ALL">All categories</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-700">
              Course status
              <select value={status} onChange={(event) => setStatus(event.target.value as AcademyCourseStatus | "ALL")} className="rounded-lg border border-zinc-300 bg-white px-3 py-2">
                <option value="ALL">All statuses</option>
                <option value="PLANNED">Planned</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </label>
          </div>
          <div className="mt-5 space-y-3" aria-live="polite">
            {visibleCourses.length === 0 ? <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">No courses are connected for this selection.</p> : visibleCourses.map((course) => (
              <article key={course.courseId} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-200 p-4">
                <div><h3 className="font-bold">{course.title}</h3><p className="mt-1 text-sm text-zinc-600">{course.category} · {course.status}</p><p className="mt-2 text-sm text-zinc-600">{course.description}</p></div>
                {course.status === "PUBLISHED" && <button type="button" disabled={requestedCourseIds.has(course.courseId)} onClick={() => setRequestedCourseIds((current) => new Set(current).add(course.courseId))} className="rounded-lg border border-[#c1121f] px-3 py-2 text-sm font-bold text-[#c1121f] disabled:border-zinc-300 disabled:text-zinc-500">{requestedCourseIds.has(course.courseId) ? "Requested locally" : "Request enrollment"}</button>}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 space-y-3" aria-live="polite">
          {requestedCourses.length === 0 ? <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">No local enrollment requests in this session.</p> : requestedCourses.map((course) => <article key={course.courseId} className="rounded-lg border border-zinc-200 p-4"><h3 className="font-bold">{course.title}</h3><p className="mt-1 text-sm text-zinc-600">Enrollment request: local session only</p></article>)}
        </div>
      )}
      <div className="mt-6 border-t border-zinc-200 pt-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h3 className="text-lg font-black">Course tracks</h3><p className="mt-1 text-sm text-zinc-600">Outline placeholders only; no lessons are published or completed.</p></div>
          <label className="grid gap-1 text-sm font-bold text-zinc-700">
            Track category
            <select value={trackCategory} onChange={(event) => setTrackCategory(event.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2">
              <option value="ALL">All tracks</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 divide-y divide-zinc-200">
          {tracks.filter((track) => trackCategory === "ALL" || track.category === trackCategory).map((track) => (
            <article key={track.trackId} className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h4 className="font-bold">{track.title}</h4><p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#c1121f]">{track.status} · {track.modules.length} planned modules</p></div>
                <button type="button" aria-expanded={expandedTrackId === track.trackId} onClick={() => setExpandedTrackId((current) => current === track.trackId ? null : track.trackId)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold">{expandedTrackId === track.trackId ? "Hide outline" : "View outline"}</button>
              </div>
              {expandedTrackId === track.trackId && <ol className="mt-3 space-y-2 border-l-2 border-zinc-200 pl-4">{track.modules.map((module) => <li key={module.moduleId} className="rounded-lg bg-zinc-50 p-3"><p className="text-sm font-bold">{module.title} <span className="ml-2 text-[10px] font-black uppercase tracking-wide text-[#c1121f]">{module.status}</span></p><p className="mt-1 text-sm text-zinc-600">{module.summary}</p></li>)}</ol>}
            </article>
          ))}
          {tracks.length === 0 && <p className="text-sm text-zinc-600">No curriculum tracks are configured.</p>}
        </div>
      </div>
      <p className="mt-4 text-xs text-zinc-500">Source: {courses.length === 0 ? "NOT_CONNECTED" : "LOCAL_DEVELOPMENT"}. Requests clear when this page session ends.</p>
    </section>
  );
}