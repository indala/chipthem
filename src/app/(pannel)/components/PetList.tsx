
import type { FC } from 'react';
import { Pet } from '@/types/owners';

// Define the structure for a single pet


// Define the props for the PetList component
const PetList: FC<{ pets: Pet[] }> = ({ pets }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Registered Pets</h2>
      {pets.length > 0 ? (
        <div className="space-y-4">
          {pets.map((pet) => (
            <div key={pet.id} className="border rounded-lg p-4 bg-gray-50">
              <p className="font-bold text-lg text-gray-800">{pet.pet_name}</p>
              <p className="text-sm text-gray-600"><strong>Type:</strong> {pet.pet_type}</p>
              <p className="text-sm text-gray-600"><strong>Microchip:</strong> {pet.microchip_number}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">You have no registered pets yet.</p>
      )}
    </div>
  );
};

export default PetList;
