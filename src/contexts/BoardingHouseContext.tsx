import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BoardingHouse, Room } from '../types';
import { useAuth } from './AuthContext';

const MOCK_BOARDING_HOUSES: Omit<BoardingHouse, 'id'>[] = [
  {
    name: 'Urban Nest',
    ownerName: 'John Doe',
    address: '123 Main St, Cebu City',
    description: 'A modern and stylish boarding house in the heart of the city, perfect for students and young professionals. Enjoy our rooftop lounge and high-speed internet.',
    imageUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/43bd/9102/b9f5173e8557076ba5e86bdbd5f466fd',
    contactNo: '09171234567',
    facebookUrl: 'https://facebook.com/urbannest',
    availableRooms: 2,
    rooms: [
      { id: 101, name: 'Room 101', price: '5000', capacity: 'Good for 1 person', inclusions: ['Bed', 'Wi-Fi', 'Cabinet'] },
      { id: 102, name: 'Room 102', price: '8000', capacity: 'Good for 2 persons', inclusions: ['Bed', 'Wi-Fi', 'Cabinet', 'Aircon'] },
    ],
  },
  {
    name: 'Serene Stay',
    ownerName: 'Jane Smith',
    address: '456 Oak Avenue, Mandaue City',
    description: 'Find peace and quiet at Serene Stay. A comfortable and affordable option with a beautiful garden and friendly atmosphere.',
    imageUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/0397/7d65/57ce3d70b9b66c773f1dfd6dbd3a4945',
    contactNo: '09187654321',
    facebookUrl: 'https://facebook.com/serenestay',
    availableRooms: 1,
    rooms: [
      { id: 201, name: 'Solo Pad', price: '4500', capacity: 'Good for 1 person', inclusions: ['Bed', 'Private CR'] },
    ],
  },
];

const getStoredHouses = (): BoardingHouse[] => {
  const houses = localStorage.getItem('boardingHouses');
  if (houses) {
    return JSON.parse(houses);
  }
  const initialHouses = MOCK_BOARDING_HOUSES.map((house, index) => ({ ...house, id: index + 1 }));
  localStorage.setItem('boardingHouses', JSON.stringify(initialHouses));
  return initialHouses;
};

const storeHouses = (houses: BoardingHouse[]) => {
  localStorage.setItem('boardingHouses', JSON.stringify(houses));
};

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

  useEffect(() => {
    setLoading(true);
    const houses = getStoredHouses();
    setBoardingHouses(houses);
    setLoading(false);
  }, []);

  const getBoardingHouseById = (id: number) => {
    return boardingHouses.find(house => house.id === id);
  };

  const addBoardingHouse = async (houseData: Omit<BoardingHouse, 'id' | 'availableRooms' | 'ownerName'>, imageFile?: File) => {
    if (!user) return { error: 'User not authenticated' };
    
    let imageUrl = houseData.imageUrl;
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    } else if (!imageUrl) {
      imageUrl = `https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/e0f7fa/08637c?text=${encodeURIComponent(houseData.name)}`;
    }

    const allHouses = getStoredHouses();
    const newHouse: BoardingHouse = {
      ...houseData,
      id: allHouses.length > 0 ? Math.max(...allHouses.map(h => h.id)) + 1 : 1,
      ownerName: user.name,
      availableRooms: houseData.rooms.length,
      imageUrl,
    };

    const updatedHouses = [...allHouses, newHouse];
    storeHouses(updatedHouses);
    setBoardingHouses(updatedHouses);
    
    return { error: null };
  };

  const updateBoardingHouse = async (id: number, updatedData: Omit<BoardingHouse, 'id' | 'availableRooms' | 'ownerName'>, imageFile?: File) => {
    let imageUrl = updatedData.imageUrl;
    if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }
    
    const allHouses = getStoredHouses();
    const houseIndex = allHouses.findIndex(h => h.id === id);
    if (houseIndex === -1) return { error: 'Boarding house not found' };

    const originalHouse = allHouses[houseIndex];
    const updatedHouse = {
      ...originalHouse,
      ...updatedData,
      imageUrl,
      availableRooms: updatedData.rooms.length,
    };

    allHouses[houseIndex] = updatedHouse;
    storeHouses(allHouses);
    setBoardingHouses(allHouses);

    return { error: null };
  };

  const deleteBoardingHouse = async (id: number) => {
    const updatedHouses = boardingHouses.filter(house => house.id !== id);
    storeHouses(updatedHouses);
    setBoardingHouses(updatedHouses);
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
