// components/TrackingDisplay.js
import React from 'react';

const TrackingDisplay = ({ data }) => {
  return (
    <div className="w-full mt-6">
      {/* Informacje główne */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Informacje główne</h2>
        <div className="space-y-2">
          {Object.entries(data["Informacje główne"]).map(([key, value]) => (
            <div key={key} className="flex justify-between text-gray-300">
              <span className="font-medium">{key}:</span>
              <span>{value || "N/A"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Szczegóły przesyłki */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Szczegóły przesyłki</h2>
        <div className="space-y-4">
          {data["Szczegóły przesyłki"].map((detail, index) => (
            <div key={index} className="bg-gray-600 p-3 rounded-lg">
              <p className="text-sm text-gray-300"><strong>Data:</strong> {detail.Data}</p>
              <p className="text-sm text-gray-300"><strong>Lokalizacja:</strong> {detail.Lokalizacja}</p>
              <p className="text-sm text-gray-300"><strong>Status:</strong> {detail.Status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackingDisplay;
