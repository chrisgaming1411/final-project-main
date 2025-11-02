import { Tables } from "./types/supabase";

// Application-specific types, mapped from Supabase types for frontend consistency

export interface UserProfile {
  id: string;
  name: string;
  type: 'owner' | 'seeker';
  profilePicture?: string;
}

export interface Room {
  id: number;
  name: string;
  price: string;
  capacity: string;
  inclusions: string[];
}

export interface BoardingHouse {
  id: number;
  name:string;
  ownerName: string;
  address: string;
  description: string;
  imageUrl: string;
  contactNo: string;
  facebookUrl: string;
  availableRooms: number; // This will be calculated from rooms.length
  rooms: Room[];
}


// Mapper functions

export const mapProfileFromSupabase = (profile: Tables<'profiles'>): UserProfile => ({
  id: profile.id,
  name: profile.full_name || 'User',
  type: profile.user_type,
  profilePicture: profile.avatar_url || undefined,
});

export const mapRoomFromSupabase = (room: Tables<'rooms'>): Room => ({
  id: room.id,
  name: room.name,
  price: String(room.price),
  capacity: room.capacity,
  inclusions: room.inclusions || [],
});

export const mapBoardingHouseFromSupabase = (
  house: Tables<'boarding_houses'> & { rooms: Tables<'rooms'>[], profiles: Tables<'profiles'> | null }
): BoardingHouse => ({
  id: house.id,
  name: house.name,
  ownerName: house.profiles?.full_name || 'N/A',
  address: house.address,
  description: house.description || '',
  imageUrl: house.image_url || `https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/e0f7fa/08637c?text=${encodeURIComponent(house.name)}`,
  contactNo: house.contact_no || 'N/A',
  facebookUrl: house.facebook_url || '',
  availableRooms: house.rooms.length,
  rooms: house.rooms.map(mapRoomFromSupabase),
});
