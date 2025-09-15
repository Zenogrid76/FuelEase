"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import defaultImage from "../../public/images/default_image.jpg";
import pusher from "../app/lib/pusherClient"; 

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; read: boolean }[]
  >([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${backendUrl}/admin/profile`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not logged in");
        const json = await res.json();
        setIsLoggedIn(true);
        setProfileImageUrl(
          json.profileImage
            ? `${backendUrl}/${json.profileImage}`
            : defaultImage.src
        );
        setFullName(json.fullName || null);
      } catch {
        setIsLoggedIn(false);
        setProfileImageUrl(null);
        setFullName(null);
        setNotifications([]);
      }
    }
    fetchUser();
  }, [backendUrl]);

  // Setup Pusher subscription for notifications
  useEffect(() => {
    if (!isLoggedIn) return;

    const channel = pusher.subscribe("admin-channel");

    // Listen for new station notifications
    channel.bind(
      "new-station",
      (data: { stationId: number; adminId: number; message: string }) => {
        setNotifications((prev) => [
          {
            id: data.stationId,
            message: data.message,
            read: false,
          },
          ...prev,
        ]);
      }
    );
    // Listen for station update notifications
    channel.bind(
      "update-station",
      (data: { stationId: number; adminId: number; message: string }) => {
        setNotifications((prev) => [
          {
            id: data.stationId,
            message: data.message,
            read: false,
          },
          ...prev,
        ]);
      }
    );

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("admin-channel");
    };
  }, [isLoggedIn]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setProfileImageUrl(null);
      setFullName(null);
      setNotifications([]);
      alert("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    router.push("/login");
  };

  const goToProfileSettings = async () => {
    try {
      const res = await fetch(`${backendUrl}/admin/profile`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.id) {
        router.push(`/admin/profile/${data.id}`);
      } else {
        alert("Could not resolve own profile.");
      }
    } catch {
      alert("Could not resolve own profile.");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap bg-gray-900/80 backdrop-blur-sm px-10 py-4 shadow-lg shadow-gray-900/50 transition-all duration-300">
      <div className="flex items-center gap-3 text-white">
        {isLoggedIn && onMenuClick && (
          <button
            onClick={onMenuClick}
            className=" text-white hover:text-gray-300"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
        <Link href="/" className="flex items-center gap-2">
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
            FuelEase
          </h2>
        </Link>
      </div>

      {!isLoggedIn && (
        <nav className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors text-base font-medium leading-normal"
          >
            Home
          </Link>
          <Link
            href="/about-us"
            className="text-gray-300 hover:text-white transition-colors text-base font-medium leading-normal"
          >
            About Us
          </Link>
        </nav>
      )}

      <div className="flex items-center gap-4 relative">
        {isLoggedIn ? (
          <>
          
            <div ref={dropdownRef} className="relative">
              <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                aria-label="Notifications"
              >
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: 28 }}
                >
                  notifications
                </span>
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-gray-900" />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-120 max-h-96 overflow-y-auto  rounded bg-gray-800 shadow-lg z-50">
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <span className="text-white font-semibold">
                      Notifications
                    </span>
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-green-400 hover:text-green-600 focus:outline-none"
                    >
                      Mark all read
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-400 text-sm">
                      No notifications
                    </p>
                  ) : (
                    notifications.map(({ id, message, read }) => (
                      <div
                        key={id}
                        className={`px-4 py-3 border-b border-gray-700 cursor-default ${
                          read
                            ? "text-gray-500"
                            : "text-white font-medium bg-gray-700"
                        }`}
                      >
                        {message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {mounted && fullName && (
              <Link
                href="/admin-dashboard"
                className="text-white font-semibold mr-2 max-w-[150px] truncate "
              >
                {fullName}
              </Link>
            )}

            <button
              className="rounded-full overflow-hidden h-10 w-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981]"
              aria-label="User Profile"
            >
              <img
                src={profileImageUrl || defaultImage.src}
                alt="User profile"
                className="h-full w-full object-cover"
                onClick={goToProfileSettings}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== defaultImage.src)
                    target.src = defaultImage.src;
                }}
              />
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors duration-300"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="px-6 py-2 rounded-full bg-[#10B981] text-white hover:bg-white hover:text-[#10B981] font-semibold hover:bg-opacity-90 transition-all duration-300 hidden md:block">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-2 rounded-full border border-[#10B981] text-[#10B981] font-semibold hover:bg-[#10B981] hover:text-white transition-all duration-300 hidden md:block">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
