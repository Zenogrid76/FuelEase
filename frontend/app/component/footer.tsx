// components/Footer.jsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800/80 text-white py-5 px-10 flex justify-between items-center font-sans text-sm">
      
      {/* Left Section - Links */}
      <div className="flex gap-5">
        <Link href="/services" className="hover:text-gray-300 no-underline">
          Services
        </Link>
        <Link href="/company" className="hover:text-gray-300 no-underline">
          Company
        </Link>
        <Link href="/legal" className="hover:text-gray-300 no-underline">
          Legal
        </Link>
      </div>

      {/* Center Section - Copyright */}
      <p>© 2025 FUELEASE Company. All rights reserved.</p>

    </footer>
  );
}
