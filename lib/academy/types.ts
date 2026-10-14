export type AcademyCourseStatus = "PLANNED" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type AcademyTrackStatus = "PLANNED" | "NOT_CONNECTED";

export interface AcademyLessonModule {
  moduleId: string;
  title: string;
  summary: string;
  status: "PLANNED" | "NOT_CONNECTED";
}

export interface AcademyCourseTrack {
  trackId: string;
  title: string;
  category: string;
  status: AcademyTrackStatus;
  modules: readonly AcademyLessonModule[];
}

export interface AcademyCourse {
  courseId: string;
  title: string;
  description: string;
  category: string;
  status: AcademyCourseStatus;
  requiredForPositionIds: readonly string[];
}

export interface AcademySnapshot {
  courses: readonly AcademyCourse[];
  sourceStatus: "NOT_CONNECTED" | "LOCAL_DEVELOPMENT" | "LIVE";
}

export const EMPTY_ACADEMY_SNAPSHOT: AcademySnapshot = {
  courses: [],
  sourceStatus: "NOT_CONNECTED",
};