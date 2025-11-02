import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BoardingHouseCard from '../../components/BoardingHouseCard';

const boardingHouses = [
  {
    id: 1,
    name: 'The Urban Nest',
    availableRooms: 2,
    imageUrl: 'https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/0397/7d65/57ce3d70b9b66c773f1dfd6dbd3a4945?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ACnyPGcyNXmCatGLm3G0Hob8jNudOzWWvyHS4n2zO~Nx8ivYGP23tn2RKu45p3jV5dI9MmUuxgYZFvX5Qa2m~nbVDOfPJ3d-anXfxA095U2ZVG-1jK3chMUITmzYmqIXjh3bt8mpNNPKMHb7InEWbIYLlybGqlgb-7jLT9q~QxJbzUBmciVGohUt3oFwl6sffMBLKm3ggh1-gL5d6t6ith9LFvAI4u2FMPppGC4D5PYudOYTppPV4LvTF46jg1Z1IiXkparuuBqBntM0I7G~mtaTdMDHGp2RRg8fqaaIrUuRiNT9tNHwaKVd2UfEZhyx7b5QihMQdlOl0p7EPVzugA__',
  },
  {
    id: 2,
    name: 'The Urban Nest',
    availableRooms: 2,
    imageUrl: 'https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/e028/f9c9/84c06ea76a1efdc4cee8804dec43a9dd?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=RLI11XsVGpGC-3qkbSuwk7bITPvlE5gOBouHpOkbro7wGSY5-rTkCxGDKNTBWd1GvcxWYLHrALiNocFF-kyIdNI8dKzc9-qltLyuVH~qYD7g9cinRB3pdwS5aWojww2MKMEDFZ9VaS9Z2jieAOdITYF2n-hTSeosYBMgI7w1~16gh7DPz3zOD1muLEolCprpmrzEsRTKrp74m3~hsLknzCR0UUr9w6~uRmZUC4CC3heGmjsbPyQpCrhWOpXbKvdIzdsyyCg-68-aqivDtzrX-lbSIyjETlU2z-gxpbG9pmB1hxfKxQNMbbv17GQlIAC9qTlO024Fnb-dTjZPyjbJ~A__',
  },
];

const MyBoardinghousePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div className="flex items-center space-x-4 mb-6 sm:mb-0">
          <button onClick={() => navigate(-1)} className="text-black hover:text-gray-600">
            <ArrowLeft size={32} />
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold text-black">My Boardinghouse</h1>
        </div>
        <button className="bg-gradient-add-button text-white font-semibold text-lg py-4 px-8 rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center space-x-2">
          <Plus size={24} />
          <span>Add</span>
        </button>
      </div>

      <div className="space-y-8">
        {boardingHouses.map((house) => (
          <BoardingHouseCard key={house.id} house={house} />
        ))}
      </div>
    </div>
  );
};

export default MyBoardinghousePage;
