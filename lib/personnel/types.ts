export type PersonnelRecordStatus = "ACTIVE" | "ON_LEAVE" | "INACTIVE";

export interface PersonnelRecord {
  personnelId: string;
  displayName: string;
  positionId: string | null;
  departmentId: string | null;
  status: PersonnelRecordStatus;
}

export interface PersonnelSnapshot {
  personnel: readonly PersonnelRecord[];
  sourceStatus: "NOT_CONNECTED" | "LOCAL_DEVELOPMENT" | "LIVE";
}

export const EMPTY_PERSONNEL_SNAPSHOT: PersonnelSnapshot = {
  personnel: [],
  sourceStatus: "NOT_CONNECTED",
};