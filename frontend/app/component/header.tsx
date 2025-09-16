// components/Header.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-gray-800/80 text-white py-5 px-10 flex justify-between items-center">
      
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <Image 
          src="/logofuel.webp" 
          alt="Fuelease Logo" 
          width={50} 
          height={50} 
          className="rounded-full border-2 border-white shadow-lg" // round + border + shadow
        />
        <h1 className="text-3xl m-0 font-bold">Fuelease</h1>
      </div>

      {/* Navigation */}
      <nav className="flex gap-5 text-base">
        <Link href="/homepage" className="hover:text-gray-300 no-underline">
          Home
        </Link>
        <Link href="/login" className="hover:text-gray-300 no-underline">
          Sign Up
        </Link>
        <Link href="/registration" className="hover:text-gray-300 no-underline">
          Registration
        </Link>
      </nav>
    </header>
  );
}
