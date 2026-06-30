const acknowledgedIds = new Set<string>();

export function acknowledgeOperation(id: string) {
  acknowledgedIds.add(id);
}

export function isOperationAcknowledged(id: string) {
  return acknowledgedIds.has(id);
}

export function getAcknowledgedOperationIds() {
  return Array.from(acknowledgedIds);
}
