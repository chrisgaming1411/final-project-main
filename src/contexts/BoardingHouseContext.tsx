import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { BoardingHouse, mapBoardingHouseFromSupabase, Room } from '../types';
import { TablesInsert, TablesUpdate } from '../types/supabase';
import { useAuth } from './AuthContext';

interface BoardingHouseContextType {
  boardingHouses: BoardingHouse[];
  loading: boolean;
  getBoardingHouseById: (id: number) => BoardingHouse | undefined;
  addBoardingHouse: (house: Omit<BoardingHouse, 'id' | 'availableRooms' | 'ownerName'>, imageFile?: File) => Promise<{ error: any }>;
  updateBoardingHouse: (id: number, updatedHouse: Omit<BoardingHouse, 'id' | 'availableRooms' | 'ownerName'>, imageFile?: File) => Promise<{ error: any }>;
  deleteBoardingHouse: (id: number) => Promise<void>;
}

const BoardingHouseContext = createContext<BoardingHouseContextType | undefined>(undefined);

export const BoardingHouseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boardingHouses, setBoardingHouses] = useState<BoardingHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBoardingHouses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('boarding_houses')
      .select(`
        *,
        rooms(*),
        profiles(*)
      `);

    if (error) {
      console.error('Error fetching boarding houses:', error);
      setBoardingHouses([]);
    } else if (data) {
      const mappedData = data.map(house => mapBoardingHouseFromSupabase(house as any));
      setBoardingHouses(mappedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBoardingHouses();
  }, []);

  const getBoardingHouseById = (id: number) => {
    return boardingHouses.find(house => house.id === id);
  };

  const uploadBoardingHouseImage = async (imageFile: File, houseName: string): Promise<string | null> => {
    if (!user) return null;
    const filePath = `${user.id}/${houseName.replace(/\s+/g, '-')}-${Date.now()}`;
    const { error: uploadError } = await supabase.storage.from('boarding-house-images').upload(filePath, imageFile);
    if (uploadError) {
      console.error('Image upload error:', uploadError);
      return null;
    }
    const { data } = supabase.storage.from('boarding-house-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const addBoardingHouse = async (houseData: Omit<BoardingHouse, 'id'| 'availableRooms' | 'ownerName'>, imageFile?: File) => {
    if (!user) return { error: 'User not authenticated' };
    
    let imageUrl = houseData.imageUrl;
    if (imageFile) {
      const uploadedUrl = await uploadBoardingHouseImage(imageFile, houseData.name);
      if (!uploadedUrl) return { error: 'Image upload failed' };
      imageUrl = uploadedUrl;
    }

    const houseInsert: TablesInsert<'boarding_houses'> = {
      name: houseData.name,
      address: houseData.address,
      description: houseData.description,
      contact_no: houseData.contactNo,
      facebook_url: houseData.facebookUrl,
      image_url: imageUrl,
      owner_id: user.id
    };

    const { data: newHouse, error: houseError } = await supabase.from('boarding_houses').insert(houseInsert).select().single();

    if (houseError) return { error: houseError };

    if (houseData.rooms.length > 0) {
      const roomsInsert: TablesInsert<'rooms'>[] = houseData.rooms.map(room => ({
        boarding_house_id: newHouse.id,
        name: room.name,
        price: parseFloat(room.price),
        capacity: room.capacity,
        inclusions: room.inclusions
      }));
      const { error: roomsError } = await supabase.from('rooms').insert(roomsInsert);
      if (roomsError) return { error: roomsError };
    }
    
    await fetchBoardingHouses();
    return { error: null };
  };

  const updateBoardingHouse = async (id: number, updatedData: Omit<BoardingHouse, 'id' | 'availableRooms' | 'ownerName'>, imageFile?: File) => {
    let imageUrl = updatedData.imageUrl;
    if (imageFile) {
        const uploadedUrl = await uploadBoardingHouseImage(imageFile, updatedData.name);
        if (!uploadedUrl) return { error: 'Image upload failed' };
        imageUrl = uploadedUrl;
    }

    const houseUpdate: TablesUpdate<'boarding_houses'> = {
        name: updatedData.name,
        address: updatedData.address,
        description: updatedData.description,
        contact_no: updatedData.contactNo,
        facebook_url: updatedData.facebookUrl,
        image_url: imageUrl,
    };

    const { error: houseError } = await supabase.from('boarding_houses').update(houseUpdate).eq('id', id);
    if (houseError) return { error: houseError };

    // Simple approach: delete all existing rooms and re-insert.
    const { error: deleteError } = await supabase.from('rooms').delete().eq('boarding_house_id', id);
    if (deleteError) return { error: deleteError };

    if (updatedData.rooms.length > 0) {
        const roomsInsert: TablesInsert<'rooms'>[] = updatedData.rooms.map(room => ({
            boarding_house_id: id,
            name: room.name,
            price: parseFloat(room.price),
            capacity: room.capacity,
            inclusions: room.inclusions,
        }));
        const { error: roomsError } = await supabase.from('rooms').insert(roomsInsert);
        if (roomsError) return { error: roomsError };
    }
    
    await fetchBoardingHouses();
    return { error: null };
  };

  const deleteBoardingHouse = async (id: number) => {
    const { error } = await supabase.from('boarding_houses').delete().eq('id', id);
    if (error) {
      console.error('Error deleting boarding house:', error);
    } else {
      setBoardingHouses(prev => prev.filter(house => house.id !== id));
    }
  };

  return (
    <BoardingHouseContext.Provider value={{ boardingHouses, loading, getBoardingHouseById, addBoardingHouse, updateBoardingHouse, deleteBoardingHouse }}>
      {children}
    </BoardingHouseContext.Provider>
  );
};

export const useBoardingHouses = () => {
  const context = useContext(BoardingHouseContext);
  if (context === undefined) {
    throw new Error('useBoardingHouses must be used within a BoardingHouseProvider');
  }
  return context;
};
