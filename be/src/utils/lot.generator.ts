export function generateRMLotNo(materialCode: string, sequence: number) {
  const year = new Date().getFullYear();
  return `RM-${materialCode}-${year}-${sequence.toString().padStart(4, "0")}`;
}
