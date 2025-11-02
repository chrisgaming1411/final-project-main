import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import AddRoomModal from '../../components/AddRoomModal';
import { useBoardingHouses } from '../../contexts/BoardingHouseContext';
import { Room } from '../../types';

const AddNewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== undefined;
  const { addBoardingHouse, updateBoardingHouse, getBoardingHouseById } = useBoardingHouses();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    contactNo: '',
    address: '',
    description: 'A boardinghouse is a residential building where individuals can rent a room...',
    facebookUrl: 'https://facebook.com/username',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const houseToEdit = getBoardingHouseById(Number(id));
      if (houseToEdit) {
        setFormData({
          name: houseToEdit.name,
          contactNo: houseToEdit.contactNo,
          address: houseToEdit.address,
          description: houseToEdit.description,
          facebookUrl: houseToEdit.facebookUrl,
        });
        setRooms(houseToEdit.rooms.map(r => ({...r, id: Math.random()}))); // Use temp ID for client-side key
        setImagePreview(houseToEdit.imageUrl);
      }
    }
  }, [id, isEditMode, getBoardingHouseById]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChooseFilesClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleAddRoomClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditingRoom(null);
    setIsModalOpen(true);
  };
  
  const handleEditRoomClick = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleSaveRoom = (newRoomData: Omit<Room, 'id'>, roomId: number | null) => {
    if (roomId !== null) {
      setRooms(prev => prev.map(room => room.id === roomId ? { ...room, ...newRoomData } : room));
    } else {
      const roomWithId = { ...newRoomData, id: Date.now() };
      setRooms(prev => [...prev, roomWithId]);
    }
    setIsModalOpen(false);
  };
  
  const handleDeleteRoom = (roomId: number) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.address) {
      setFormError('Please fill in Boardinghouse Name and Address.');
      return;
    }

    setLoading(true);

    const listingData = {
      ...formData,
      rooms: rooms,
      imageUrl: imagePreview || '',
    };

    let result;
    if (isEditMode) {
      result = await updateBoardingHouse(Number(id), listingData, imageFile || undefined);
    } else {
      result = await addBoardingHouse(listingData, imageFile || undefined);
    }
    
    setLoading(false);
    if (result.error) {
      setFormError(result.error.message || 'An unknown error occurred.');
    } else {
      alert(`Boardinghouse listing ${isEditMode ? 'updated' : 'saved'} successfully!`);
      navigate('/dashboard/my-boardinghouse');
    }
  };

  return (
    <>
      <AddRoomModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoom}
        initialData={editingRoom}
      />
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-6 mb-10">
          <button onClick={() => navigate(-1)} className="text-black hover:text-gray-600">
            <ArrowLeft size={32} />
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold text-black">
            {isEditMode ? 'Edit Boardinghouse' : 'Add Boardinghouse'}
          </h1>
        </div>

        <div className="bg-white rounded-[30px] shadow-lg p-8 md:p-12">
          <form onSubmit={handleSaveListing} className="space-y-8" noValidate>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Boardinghouse Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full text-lg p-5 rounded-[30px] border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue placeholder-brand-gray-text"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="contactNo"
                  placeholder="Contact No."
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  className="w-full text-lg p-5 rounded-[30px] border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue placeholder-brand-gray-text"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                 <input
                  type="text"
                  name="address"
                  placeholder="Full Address/Location"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full text-lg p-5 rounded-[30px] border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue placeholder-brand-gray-text"
                />
              </div>
              <div className="flex items-center">
                <button onClick={handleAddRoomClick} className="w-full bg-gradient-add-button text-white font-bold text-xl py-5 px-8 rounded-[30px] shadow-lg hover:opacity-90 transition-opacity">
                  Add Room
                </button>
              </div>
            </div>

            {rooms.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-brand-dark-navy mb-2">Added Rooms</h3>
                {rooms.map(room => (
                  <div key={room.id} className="bg-brand-light-cyan p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">{room.name}</p>
                      <p className="text-sm text-gray-600">₱{room.price}/month - {room.capacity}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button type="button" onClick={() => handleEditRoomClick(room)} className="p-2 text-gray-500 hover:text-blue-600">
                        <Edit size={20} />
                      </button>
                      <button type="button" onClick={() => handleDeleteRoom(room.id)} className="p-2 text-gray-500 hover:text-red-600">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-brand-gray-text mb-2 ml-4">Description</label>
              <textarea
                name="description"
                id="description"
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full text-lg p-5 rounded-[30px] border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue text-brand-gray-text"
              />
            </div>

            <div>
              <label htmlFor="facebookUrl" className="block text-lg font-medium text-brand-gray-text mb-2 ml-4">Facebook Page or Profile</label>
              <input
                type="text"
                name="facebookUrl"
                id="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleInputChange}
                className="w-full text-lg p-5 rounded-[30px] border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue text-brand-gray-text"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-brand-gray-text mb-2 ml-4">Upload Photos</label>
              <div className="border border-brand-gray-text rounded-[10px] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                       <img 
                          src={imagePreview || "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/c190/6cd4/ea46f756f8919f131d76213a8f823244?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GUuOaXFPiLph2wepvUj5Vohj1frKIL7R611cPDziot3NWXeq3KqkVUukNsakSlOo7jDFoHJStWnTJMBcKbVOzt2W~LMrEqsgzRVd6eJ~2CKvnuFU0wWdDnydhd6gxnd9HU73I9XRm4HwzpBUv6GCJZ41QTew5osyYfndSvsZC2LVAgBOR0BpEnChiGV8c0~~Tl-PK3PynZHmadvhKoPdzoPjDjeOm8bI7w-8yCcsgeFzb163JxTwDf7sebri9T6IiniJMiNwSlkNsC3g82Z~oX6xSB6r8mB5r~Nv4XRnSgpmV~-PqD84ABHInuocwVJw~iOkR9q2fHLmY8ar~wr7Nw__"} 
                          alt="upload preview" 
                          className="w-16 h-16 object-cover rounded-md"
                      />
                      <span className="text-gray-500">
                          {imageFile ? imageFile.name : (imagePreview ? 'Current image' : 'No file chosen')}
                      </span>
                  </div>
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                  />
                  <button
                      type="button"
                      onClick={handleChooseFilesClick}
                      className="bg-brand-cyan-border text-white font-semibold text-lg py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
                  >
                      Choose File
                  </button>
              </div>
            </div>

            {formError && <p className="text-red-500 text-center">{formError}</p>}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-button text-white font-bold text-3xl py-5 rounded-full shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'SAVING...' : (isEditMode ? 'Update Listing' : 'Save Listing')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewPage;
