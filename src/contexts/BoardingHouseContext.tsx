import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Room } from '../pages/owner/AddNew';

export interface BoardingHouse {
  id: number;
  name: string;
  availableRooms: number;
  imageUrl: string;
  ownerName: string;
  contactNo: string;
  address: string;
  description: string;
  facebookUrl: string;
  rooms: Room[];
}

interface BoardingHouseContextType {
  boardingHouses: BoardingHouse[];
  getBoardingHouseById: (id: number) => BoardingHouse | undefined;
  addBoardingHouse: (house: Omit<BoardingHouse, 'id'>) => void;
  updateBoardingHouse: (id: number, updatedHouse: Omit<BoardingHouse, 'id'>) => void;
  deleteBoardingHouse: (id: number) => void;
}

const initialBoardingHouses: BoardingHouse[] = [
    {
      id: 1,
      name: 'The Urban Nest',
      availableRooms: 2,
      imageUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/0397/7d65/57ce3d70b9b66c773f1dfd6dbd3a4945?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ACnyPGcyNXmCatGLm3G0Hob8jNudOzWWvyHS4n2zO~Nx8ivYGP23tn2RKu45p3jV5dI9MmUuxgYZFvX5Qa2m~nbVDOfPJ3d-anXfxA095U2ZVG-1jK3chMUITmzYmqIXjh3bt8mpNNPKMHb7InEWbIYLlybGqlgb-7jLT9q~QxJbzUBmciVGohUt3oFwl6sffMBLKm3ggh1-gL5d6t6ith9LFvAI4u2FMPppGC4D5PYudOYTppPV4LvTF46jg1Z1IiXkparuuBqBntM0I7G~mtaTdMDHGp2RRg8fqaaIrUuRiNT9tNHwaKVd2UfEZhyx7b5QihMQdlOl0p7EPVzugA__',
      ownerName: 'Jane Smith',
      contactNo: '09123456789',
      address: '123 Main St, Cebu City',
      description: 'A cozy place in the heart of the city.',
      facebookUrl: 'https://facebook.com/urbannest',
      rooms: [
        { id: 101, name: 'Room A', price: '5000', capacity: '1 person', inclusions: ['Bed', 'Wi-Fi'] },
        { id: 102, name: 'Room B', price: '6000', capacity: '1 person', inclusions: ['Bed', 'Wi-Fi', 'Aircon'] },
      ]
    },
    {
      id: 2,
      name: 'Riverside Rooms',
      availableRooms: 5,
      imageUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/e028/f9c9/84c06ea76a1efdc4cee8804dec43a9dd?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=RLI11XsVGpGC-3qkbSuwk7bITPvlE5gOBouHpOkbro7wGSY5-rTkCxGDKNTBWd1GvcxWYLHrALiNocFF-kyIdNI8dKzc9-qltLyuVH~qYD7g9cinRB3pdwS5aWojww2MKMEDFZ9VaS9Z2jieAOdITYF2n-hTSeosYBMgI7w1~16gh7DPz3zOD1muLEolCprpmrzEsRTKrp74m3~hsLknzCR0UUr9w6~uRmZUC4CC3heGmjsbPyQpCrhWOpXbKvdIzdsyyCg-68-aqivDtzrX-lbSIyjETlU2z-gxpbG9pmB1hxfKxQNMbbv17GQlIAC9qTlO024Fnb-dTjZPyjbJ~A__',
      ownerName: 'Mark Chen',
      contactNo: '09987654321',
      address: '456 River Rd, Mandaue City',
      description: 'Quiet rooms with a view of the river.',
      facebookUrl: 'https://facebook.com/riversiderooms',
      rooms: []
    },
];

const BoardingHouseContext = createContext<BoardingHouseContextType | undefined>(undefined);

export const BoardingHouseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boardingHouses, setBoardingHouses] = useState<BoardingHouse[]>(initialBoardingHouses);

  const getBoardingHouseById = (id: number) => {
    return boardingHouses.find(house => house.id === id);
  };

  const addBoardingHouse = (house: Omit<BoardingHouse, 'id'>) => {
    const newHouse = { ...house, id: Date.now() };
    setBoardingHouses(prevHouses => [newHouse, ...prevHouses]);
  };

  const updateBoardingHouse = (id: number, updatedHouseData: Omit<BoardingHouse, 'id'>) => {
    setBoardingHouses(prevHouses =>
      prevHouses.map(house =>
        house.id === id ? { ...house, ...updatedHouseData, id } : house
      )
    );
  };

  const deleteBoardingHouse = (id: number) => {
    setBoardingHouses(prevHouses => prevHouses.filter(house => house.id !== id));
  };

  return (
    <BoardingHouseContext.Provider value={{ boardingHouses, getBoardingHouseById, addBoardingHouse, updateBoardingHouse, deleteBoardingHouse }}>
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
