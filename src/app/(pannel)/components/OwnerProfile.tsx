
import type { FC } from 'react';

// Define the expected props by destructuring the owner object
const OwnerProfile: FC<{ owner: { full_name: string; email: string; phone_number?: string | null } }> = ({ owner }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Full Name:</span>
          <span className="text-gray-800">{owner.full_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Email:</span>
          <span className="text-gray-800">{owner.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Phone:</span>
          <span className="text-gray-800">{owner.phone_number}</span>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
