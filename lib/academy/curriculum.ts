import type { AcademyCourseTrack } from "./types";

export const ACADEMY_CURRICULUM_TRACKS: readonly AcademyCourseTrack[] = [
  {
    trackId: "employee-onboarding",
    title: "Employee onboarding",
    category: "Employee onboarding",
    status: "PLANNED",
    modules: [
      { moduleId: "apc-overview", title: "APC overview", summary: "Planned introduction to company structure and mission.", status: "PLANNED" },
      { moduleId: "role-orientation", title: "Role orientation", summary: "Planned orientation to approved position responsibilities.", status: "PLANNED" },
    ],
  },
  {
    trackId: "operational-readiness",
    title: "Operational readiness",
    category: "Operational training",
    status: "PLANNED",
    modules: [
      { moduleId: "operational-procedures", title: "Operational procedures", summary: "Placeholder for approved operating procedures.", status: "PLANNED" },
      { moduleId: "incident-awareness", title: "Incident awareness", summary: "Placeholder for internal incident reporting and escalation guidance.", status: "PLANNED" },
    ],
  },
  {
    trackId: "leadership-development",
    title: "Leadership development",
    category: "Leadership development",
    status: "PLANNED",
    modules: [
      { moduleId: "leadership-foundations", title: "Leadership foundations", summary: "Planned leadership learning outline; no course is published.", status: "PLANNED" },
      { moduleId: "accountability-practice", title: "Accountability practice", summary: "Placeholder for future scenario-based learning.", status: "PLANNED" },
    ],
  },
];