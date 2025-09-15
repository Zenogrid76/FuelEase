import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-3 text-white">
            <h2 className="text-white text-lg font-bold leading-tight">FuelEase</h2>
          </div>
          <p className="text-gray-400 text-base font-normal leading-normal">© 2024 FuelEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
