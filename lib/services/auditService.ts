export interface AuditRecord {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
}

export const auditService = {
  logs: [] as AuditRecord[],

  add(record: AuditRecord) {
    this.logs.push(record);
  },

  getAll() {
    return this.logs;
  },
};
