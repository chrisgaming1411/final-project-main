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
  availableRooms: number;
  rooms: Room[];
}
