import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoardingHouses } from '../contexts/BoardingHouseContext';
import { CheckCircle, ChevronDown } from 'lucide-react';
import { Room } from './owner/AddNew';

const NotFound = () => (
  <div className="text-center py-20">
    <h2 className="text-3xl font-bold text-brand-dark-navy">Boardinghouse Not Found</h2>
    <p className="text-gray-600 mt-4">The listing you are looking for does not exist or has been removed.</p>
  </div>
);

const BoardingHouseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBoardingHouseById } = useBoardingHouses();

  const house = getBoardingHouseById(Number(id));
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (house && house.rooms.length > 0) {
      setSelectedRoom(house.rooms[0]);
    } else {
      setSelectedRoom(null);
    }
  }, [house]);

  if (!house) {
    return (
      <div className="bg-brand-light-cyan py-12">
        <div className="container mx-auto px-6">
          <NotFound />
        </div>
      </div>
    );
  }
  
  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomId = Number(e.target.value);
    const room = house.rooms.find(r => r.id === roomId) || null;
    setSelectedRoom(room);
  };

  const images = [
    "https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/0397/7d65/57ce3d70b9b66c773f1dfd6dbd3a4945?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ACnyPGcyNXmCatGLm3G0Hob8jNudOzWWvyHS4n2zO~Nx8ivYGP23tn2RKu45p3jV5dI9MmUuxgYZFvX5Qa2m~nbVDOfPJ3d-anXfxA095U2ZVG-1jK3chMUITmzYmqIXjh3bt8mpNNPKMHb7InEWbIYLlybGqlgb-7jLT9q~QxJbzUBmciVGohUt3oFwl6sffMBLKm3ggh1-gL5d6t6ith9LFvAI4u2FMPppGC4D5PYudOYTppPV4LvTF46jg1Z1IiXkparuuBqBntM0I7G~mtaTdMDHGp2RRg8fqaaIrUuRiNT9tNHwaKVd2UfEZhyx7b5QihMQdlOl0p7EPVzugA__",
    "https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/e028/f9c9/84c06ea76a1efdc4cee8804dec43a9dd?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=RLI11XsVGpGC-3qkbSuwk7bITPvlE5gOBouHpOkbro7wGSY5-rTkCxGDKNTBWd1GvcxWYLHrALiNocFF-kyIdNI8dKzc9-qltLyuVH~qYD7g9cinRB3pdwS5aWojww2MKMEDFZ9VaS9Z2jieAOdITYF2n-hTSeosYBMgI7w1~16gh7DPz3zOD1muLEolCprpmrzEsRTKrp74m3~hsLknzCR0UUr9w6~uRmZUC4CC3heGmjsbPyQpCrhWOpXbKvdIzdsyyCg-68-aqivDtzrX-lbSIyjETlU2z-gxpbG9pmB1hxfKxQNMbbv17GQlIAC9qTlO024Fnb-dTjZPyjbJ~A__",
    "https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/0f5e/21f0/66a27fa1b3cb1096bc957fa2709e994a?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=E~dYmUXSvH~3gS5n53bce-oNIFNOxdxUhvwx~oY9tghM2BLceuWZfPrP-JT5JXuzZ3X~d2L5PliIhGCD1k9HdQJnHCmi4d~jdOIwfijti~EU87aqVJn2KHAXW1Wef59DqA3E9bVCi9cu95gxWRz-JAzLFQ6q0w6Hz1mxFgPUT7GKrHwrSS-p6gHN5bXWVZvZkCrLTQIziSXt-N59wRmu8ddsoftfU-B-8WozyajUayUGxUmqZ~v1SLNCswBkpwjT7g0WTlak5IFmNxgL7yJSLF7ht7PnsHWMTGXAm3UEy6-t6912t4Oxa-2KsFsIoGmoyq10AI0eoPPPujtcxOWJqw__",
    house.imageUrl,
  ];
  
  const allInclusions = [...new Set(house.rooms.flatMap(r => r.inclusions))];

  const getAvailableBeds = (capacity: string) => {
    const match = capacity.match(/\d+/);
    return match ? match[0] : 'N/A';
  }

  return (
    <div className="bg-brand-light-cyan font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 relative">
          <h2 className="text-4xl font-bold text-black mb-8">Boardinghouse Details</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {images.slice(0, 3).map((img, index) => (
              <img key={index} src={img} alt={`Gallery image ${index + 1}`} className="w-full h-48 object-cover rounded-2xl shadow-md" />
            ))}
            <div className="relative w-full h-48">
              <img src={images[3]} alt="Gallery image 4" className="w-full h-full object-cover rounded-2xl shadow-md" />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center cursor-pointer">
                <span className="text-white text-2xl font-bold">View All</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 flex flex-col">
              <h1 className="text-5xl font-bold text-brand-teal mb-6">{house.name}</h1>
              <div className="space-y-4 text-2xl font-bold text-black mb-6">
                <p>Gender Allowed: Male</p>
                <p>Price: ₱{house.rooms.length > 0 ? Math.min(...house.rooms.map(r => parseFloat(r.price))) : 'N/A'}</p>
              </div>
              
              {house.rooms.length > 0 && selectedRoom && (
                <div className="space-y-4 mb-8">
                  <div className="relative">
                    <select
                      id="room"
                      value={selectedRoom.id}
                      onChange={handleRoomChange}
                      className="w-full bg-brand-cyan-border text-black font-bold text-xl py-4 px-6 rounded-3xl appearance-none focus:outline-none shadow-[0px_4px_4px_0px_rgba(55,239,252,0.25)] cursor-pointer"
                    >
                      {house.rooms.map(room => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={30} />
                  </div>
                  <p className="text-2xl font-bold text-black">Price: ₱ {selectedRoom.price}</p>
                  <p className="text-2xl font-bold text-black">Available Beds: {getAvailableBeds(selectedRoom.capacity)}</p>
                </div>
              )}

              <div className="mt-auto">
                <button
                  onClick={() => navigate('/find')}
                  className="w-full bg-gradient-button text-white font-semibold text-xl py-4 px-12 rounded-full shadow-lg hover:opacity-90 transition-opacity transform hover:scale-105"
                >
                  Back to Listings
                </button>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-1 border-l border-gray-300 mx-auto h-full"></div>

            <div className="lg:col-span-7">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Description:</h3>
                  <p className="text-brand-gray-text text-lg leading-relaxed">{house.description}</p>
                </div>
                
                {allInclusions.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Additional Information:</h3>
                    <ul className="space-y-2 text-brand-gray-text text-lg">
                      {allInclusions.map(inc => (
                        <li key={inc} className="flex items-center gap-2">
                          <CheckCircle size={20} className="text-green-500" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h3 className="text-2xl font-bold mb-2">Contact Information:</h3>
                  <div className="text-brand-gray-text text-lg space-y-1">
                    <p>Owner: {house.ownerName}</p>
                    <p>Phone: {house.contactNo}</p>
                    <p>FB Acc: <a href={house.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{house.facebookUrl.split('/').pop()}</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right mt-12">
            <p className="text-sm text-gray-400">
                <a href="#" className="hover:underline">Privacy Policy</a> | <a href="#" className="hover:underline">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingHouseDetailsPage;
