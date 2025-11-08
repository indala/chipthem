export interface Pet {
  id: string;
  pet_name: string | null;
  pet_type: string | null;
  breed: string | null;
  sex: string | null;
  primary_color: string | null;
  is_verified: boolean;
  status: string | null;
  owner?:Owner | null;
}

export interface Owner {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string | null;
  street_address?: string | null;
  city?: string | null;
  country?: string | null;
  is_verified: boolean;
  status: string | null;
  created_at: string;
  pets?: Pet[];
}
