'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const goToProfileSettings = async () => {
    try {
      const res = await fetch(`${backendUrl}/admin/profile`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.id) {
        router.push(`/admin/profile/${data.id}`);
      } else {
        alert('Could not resolve own profile.');
      }
    } catch {
      alert('Could not resolve own profile.');
    }
  };

  const isActive = (url: string) => pathname === url || pathname.startsWith(url);

  return (
    <aside
      className={`sidebar flex flex-col items-center gap-y-6 whitespace-nowrap border-r border-solid border-r-[#111827] p-6 bg-[#111827] transition-all duration-300 ${
        collapsed ? 'w-[88px]' : 'w-64'
      }`}
    >
      {/* Toggle button moved to top */}
      <button
        className="text-white mb-4 self-start"
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        <span className="material-symbols-outlined">menu_open</span>
      </button>

      <nav className="flex flex-col items-start gap-4 w-full">
        {/* Dashboard */}
        <Link
          href="/admin-dashboard"
          className={`sidebar-nav-link flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full ${
            isActive('/admin-dashboard')
              ? 'bg-[var(--primary-color)] text-cyan-400'
              : 'text-white hover:bg-gray-500'
          } ${collapsed ? 'justify-center px-0' : 'justify-start'}`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          {!collapsed && <span className="sidebar-text">Dashboard</span>}
        </Link>

        {/* Fuel Stations */}
        <Link
          href="/fuelstations"
          className={`sidebar-nav-link flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full ${
            isActive('/fuelstations')
              ? 'bg-[var(--primary-color)] text-cyan-400'
              : 'text-white hover:bg-gray-500'
          } ${collapsed ? 'justify-center px-0' : 'justify-start'}`}
        >
          <span className="material-symbols-outlined">local_gas_station</span>
          {!collapsed && <span className="sidebar-text">Fuel Stations</span>}
        </Link>


        {/* Profile Settings */}
        <button
          type="button"
          onClick={goToProfileSettings}
          className={`sidebar-nav-link flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full ${
            isActive('/admin/profile')
              ? 'bg-[var(--primary-color)] text-cyan-400'
              : 'text-white hover:bg-gray-500'
          } ${collapsed ? 'justify-center px-0' : 'justify-start'}`}
          style={{ border: 0, background: 'transparent', cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined">settings</span>
          {!collapsed && <span className="sidebar-text">Profile Settings</span>}
        </button>
      </nav>
    </aside>
  );
}
