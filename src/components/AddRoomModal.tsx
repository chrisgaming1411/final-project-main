import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Room } from '../pages/owner/AddNew';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Omit<Room, 'id'>, id: number | null) => void;
  initialData: Room | null;
}

const ALL_INCLUSIONS = ["Bed", "Cabinet", "Aircon", "Wi-Fi", "Private CR"];

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price);
      setCapacity(initialData.capacity);
      setInclusions(initialData.inclusions);
    } else {
      // Reset form for adding a new room
      setName('');
      setPrice('');
      setCapacity('');
      setInclusions([]);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleInclusionChange = (inclusion: string) => {
    setInclusions(prev => 
      prev.includes(inclusion) 
        ? prev.filter(item => item !== inclusion)
        : [...prev, inclusion]
    );
  };

  const handleSave = () => {
    if (!name || !price || !capacity) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    onSave({ name, price, capacity, inclusions }, initialData ? initialData.id : null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold text-brand-dark-navy mb-6">
          {initialData ? 'Edit Room' : 'Add New Room'}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Room Name or Number (e.g., Room 101)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-lg p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <input
            type="number"
            placeholder="Price per Month"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full text-lg p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <input
            type="text"
            placeholder="Capacity (e.g., Good for 1 person)"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full text-lg p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <div>
            <label className="block text-lg font-medium text-brand-gray-text mb-2">Inclusions</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_INCLUSIONS.map(item => (
                <label key={item} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inclusions.includes(item)}
                    onChange={() => handleInclusionChange(item)}
                    className="h-5 w-5 rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-gradient-add-button text-white font-bold text-xl py-3 px-10 rounded-full shadow-lg hover:opacity-90 transition-opacity"
          >
            {initialData ? 'Update Room' : 'Save Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
