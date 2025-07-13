export interface Bill {
  id?: string;
  child_id?: number; // Add numeric child_id for backend
  names?: string;
  cash?: string | number;
  check?: string | number;
  total?: number;
  originalIndex?: number;
  classroom?: string;
  date?: string;
}
