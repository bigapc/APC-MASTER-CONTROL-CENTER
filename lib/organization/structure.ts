import type { UserRole } from "@/lib/roles";

export type OrganizationalLevel =
  | "OWNER_EXECUTIVE"
  | "EXECUTIVE_LEADERSHIP"
  | "UNIT_LEADERSHIP"
  | "SUPERVISORS"
  | "STAFF";

export type OrganizationalPosition = {
  id: string;
  title: string;
  level: OrganizationalLevel;
  responsibility: string;
  unitId: string | null;
  departmentId: string | null;
  reportsToPositionId: string | null;
  occupantUserId: string | null;
  status: "PLANNED" | "POSITION_NOT_ASSIGNED" | "FILLED";
  applicationRole: UserRole | null;
};

export type APCDepartment = {
  id: string;
  name: string;
  leaderPositionId: string | null;
  assignedStaffUserIds: readonly string[];
  supportedUnitIds: readonly string[];
  responsibilities: readonly string[];
};

export const APC_DEPARTMENTS: readonly APCDepartment[] = [
  { id: "executive-administration", name: "Executive Administration", leaderPositionId: "owner-executive", assignedStaffUserIds: [], supportedUnitIds: [], responsibilities: ["Executive command", "Organizational governance"] },
  { id: "operations", name: "Operations", leaderPositionId: null, assignedStaffUserIds: [], supportedUnitIds: ["safeconnect", "communitysafeconnect", "csc-2-0", "safeconnect-dispatcher"], responsibilities: ["Operational coordination", "Service readiness"] },
  { id: "finance", name: "Finance", leaderPositionId: "cfo", assignedStaffUserIds: [], supportedUnitIds: [], responsibilities: ["Financial planning", "Approved financial oversight"] },
  { id: "marketing", name: "Marketing", leaderPositionId: "cmo", assignedStaffUserIds: [], supportedUnitIds: [], responsibilities: ["Brand stewardship", "Communications planning"] },
  { id: "technology", name: "Technology", leaderPositionId: null, assignedStaffUserIds: [], supportedUnitIds: ["apc-ai"], responsibilities: ["Technology architecture", "Integration readiness"] },
  { id: "communications", name: "Communications", leaderPositionId: null, assignedStaffUserIds: [], supportedUnitIds: ["apc-daily"], responsibilities: ["Internal communications", "Future notifications"] },
  { id: "training-development", name: "Training & Development", leaderPositionId: null, assignedStaffUserIds: [], supportedUnitIds: ["apc-academy"], responsibilities: ["Learning architecture", "Organizational development"] },
  { id: "community-relations", name: "Community Relations", leaderPositionId: null, assignedStaffUserIds: [], supportedUnitIds: ["apn", "safeworkconnect", "ecochain"], responsibilities: ["Community partnerships", "Community responsibility"] },
];

export const APC_POSITIONS: readonly OrganizationalPosition[] = [
  { id: "owner-executive", title: "Owner / Executive Authority", level: "OWNER_EXECUTIVE", responsibility: "APC-wide executive command and organizational authority.", unitId: null, departmentId: "executive-administration", reportsToPositionId: null, occupantUserId: null, status: "POSITION_NOT_ASSIGNED", applicationRole: "super_admin" },
  { id: "cfo", title: "Chief Financial Officer", level: "EXECUTIVE_LEADERSHIP", responsibility: "Financial oversight and planning.", unitId: null, departmentId: "finance", reportsToPositionId: "owner-executive", occupantUserId: null, status: "POSITION_NOT_ASSIGNED", applicationRole: null },
  { id: "coo", title: "Chief Operating Officer", level: "EXECUTIVE_LEADERSHIP", responsibility: "Enterprise operations and execution oversight.", unitId: null, departmentId: "operations", reportsToPositionId: "owner-executive", occupantUserId: null, status: "POSITION_NOT_ASSIGNED", applicationRole: null },
  { id: "cmo", title: "Chief Marketing Officer", level: "EXECUTIVE_LEADERSHIP", responsibility: "Brand, growth, and communications oversight.", unitId: null, departmentId: "marketing", reportsToPositionId: "owner-executive", occupantUserId: null, status: "POSITION_NOT_ASSIGNED", applicationRole: null },
  { id: "unit-leadership", title: "APC Unit Leadership", level: "UNIT_LEADERSHIP", responsibility: "Future leadership for assigned APC units.", unitId: null, departmentId: "operations", reportsToPositionId: "coo", occupantUserId: null, status: "POSITION_NOT_ASSIGNED", applicationRole: null },
  { id: "supervisor", title: "Supervisor", level: "SUPERVISORS", responsibility: "Future oversight of teams, projects, training, and communications.", unitId: null, departmentId: "operations", reportsToPositionId: "unit-leadership", occupantUserId: null, status: "POSITION_NOT_ASSIGNED", applicationRole: null },
  { id: "staff-team-member", title: "Staff / Team Member", level: "STAFF", responsibility: "Future operations, administration, technology, training, finance, marketing, and community support.", unitId: null, departmentId: null, reportsToPositionId: "supervisor", occupantUserId: null, status: "POSITION_NOT_ASSIGNED", applicationRole: null },
];

export const PERSONNEL_DIRECTORY_FIELDS = [
  "Name", "Position", "Department", "Application Authorization Role", "Assigned APC Units", "Supervisor Relationship", "Employment Status", "Authorized Access Level",
] as const;

export interface OrganizationSnapshot {
  positions: typeof APC_POSITIONS;
  departments: typeof APC_DEPARTMENTS;
  sourceStatus: "LOCAL_DEVELOPMENT" | "NOT_CONNECTED" | "LIVE";
}

export const EMPTY_ORGANIZATION_SNAPSHOT: OrganizationSnapshot = {
  positions: APC_POSITIONS,
  departments: APC_DEPARTMENTS,
  sourceStatus: "LOCAL_DEVELOPMENT",
};
