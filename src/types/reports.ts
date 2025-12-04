export interface Report {
  id: string;
  pet_name?: string;
  pet_type: string;
  color: string;
  size: string;
  last_seen_location?: string;
  found_location?: string;
  created_at: string;
  pet_photo: string;
  status: string;
}
