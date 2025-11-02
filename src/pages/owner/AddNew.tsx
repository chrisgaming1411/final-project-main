import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import AddRoomModal from '../../components/AddRoomModal';
import { useBoardingHouses } from '../../contexts/BoardingHouseContext';

export interface Room {
  id: number;
  name: string;
  price: string;
  capacity: string;
  inclusions: string[];
}

const AddNewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== undefined;
  const { addBoardingHouse, updateBoardingHouse, getBoardingHouseById } = useBoardingHouses();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    ownerName: '',
    contactNo: '',
    boardinghouseName: '',
    address: '',
    description: 'A boardinghouse is a residential building where individuals can rent a room...',
    facebookUrl: 'https://facebook.com/username',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
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
          ownerName: houseToEdit.ownerName,
          contactNo: houseToEdit.contactNo,
          boardinghouseName: houseToEdit.name,
          address: houseToEdit.address,
          description: houseToEdit.description,
          facebookUrl: houseToEdit.facebookUrl,
        });
        setRooms(houseToEdit.rooms);
        setExistingImageUrl(houseToEdit.imageUrl);
      }
    }
  }, [id, isEditMode, getBoardingHouseById]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setExistingImageUrl(null); // Clear existing image if new one is chosen
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
    if (roomId !== null) { // Editing existing room
      setRooms(prev => prev.map(room => room.id === roomId ? { ...room, ...newRoomData } : room));
    } else { // Adding new room
      const roomWithId = { ...newRoomData, id: Date.now() };
      setRooms(prev => [...prev, roomWithId]);
    }
    setIsModalOpen(false);
  };
  
  const handleDeleteRoom = (roomId: number) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.boardinghouseName || !formData.ownerName || !formData.address) {
      setFormError('Please fill in Boardinghouse Name, Owner Name, and Address.');
      return;
    }

    setLoading(true);

    let imageUrl = existingImageUrl;
    if (files.length > 0) {
      imageUrl = URL.createObjectURL(files[0]);
    } else if (!imageUrl) {
      imageUrl = `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/e0f7fa/08637c?text=${encodeURIComponent(formData.boardinghouseName)}`;
    }

    const newListingData = {
      name: formData.boardinghouseName,
      availableRooms: rooms.length,
      imageUrl: imageUrl!,
      ownerName: formData.ownerName,
      contactNo: formData.contactNo,
      address: formData.address,
      description: formData.description,
      facebookUrl: formData.facebookUrl,
      rooms: rooms,
    };

    if (isEditMode) {
      updateBoardingHouse(Number(id), newListingData);
    } else {
      addBoardingHouse(newListingData);
    }
    
    setLoading(false);
    alert(`Boardinghouse listing ${isEditMode ? 'updated' : 'saved'} successfully!`);
    navigate('/dashboard/my-boardinghouse');
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
                  name="ownerName"
                  placeholder="Owner Name"
                  value={formData.ownerName}
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
                  name="boardinghouseName"
                  placeholder="Boardinghouse Name"
                  value={formData.boardinghouseName}
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
                          src={existingImageUrl || (files.length > 0 ? URL.createObjectURL(files[0]) : "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/c190/6cd4/ea46f756f8919f131d76213a8f823244?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GUuOaXFPiLph2wepvUj5Vohj1frKIL7R611cPDziot3NWXeq3KqkVUukNsakSlOo7jDFoHJStWnTJMBcKbVOzt2W~LMrEqsgzRVd6eJ~2CKvnuFU0wWdDnydhd6gxnd9HU73I9XRm4HwzpBUv6GCJZ41QTew5osyYfndSvsZC2LVAgBOR0BpEnChiGV8c0~~Tl-PK3PynZHmadvhKoPdzoPjDjeOm8bI7w-8yCcsgeFzb163JxTwDf7sebri9T6IiniJMiNwSlkNsC3g82Z~oX6xSB6r8mB5r~Nv4XRnSgpmV~-PqD84ABHInuocwVJw~iOkR9q2fHLmY8ar~wr7Nw__")} 
                          alt="upload icon" 
                          className="w-16 h-16 object-cover rounded-md"
                      />
                      <span className="text-gray-500">
                          {files.length > 0 ? `${files.length} file(s) selected` : (existingImageUrl ? 'Current image' : 'No file chosen')}
                      </span>
                  </div>
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                  />
                  <button
                      type="button"
                      onClick={handleChooseFilesClick}
                      className="bg-brand-cyan-border text-white font-semibold text-lg py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
                  >
                      Choose Files
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
