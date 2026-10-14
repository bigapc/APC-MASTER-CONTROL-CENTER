import type { AcademySnapshot } from "./types";

export interface AcademyDataAdapter {
  readonly status: AcademySnapshot["sourceStatus"];
  listCourses(): Promise<AcademySnapshot["courses"]>;
}

export const unavailableAcademyAdapter: AcademyDataAdapter = {
  status: "NOT_CONNECTED",
  async listCourses() { return []; },
};

export function getAcademyDataAdapter(): AcademyDataAdapter {
  return unavailableAcademyAdapter;
}

export async function getAcademySnapshot(): Promise<AcademySnapshot> {
  const adapter = getAcademyDataAdapter();
  return { courses: await adapter.listCourses(), sourceStatus: adapter.status };
}