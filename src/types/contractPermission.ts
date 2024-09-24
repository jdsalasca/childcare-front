  
interface ContractPermission {
    contract_id: number;
    share_photos_with_families: boolean;
    allow_other_parents_to_take_photos: boolean;
    use_photos_for_art_and_activities: boolean;
    use_photos_for_promotion: boolean;
    walk_around_neighborhood: boolean;
    walk_to_park_or_transport: boolean;
    walk_in_school: boolean;
    guardian_received_manual: boolean;
    updated_at: string; // ISO date string
    created_at: string; // ISO date string
    id: number;
  }
  