export interface ChildrenGuardian {
  id?: number;
  child_id?: number | string;
  guardian_type_id?: number;
  guardian_id: number;
  created_at?: Date;
  updated_at?: Date;
}
