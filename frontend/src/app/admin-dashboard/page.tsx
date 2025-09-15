"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import default_image from "../../../public/images/default_image.jpg";

type Admin = {
  id: number;
  fullName: string;
  email: string;
  phoneNo: string;
  role: string;
  status: "active" | "inactive";
  profileImage?: string | null;
  age: number ;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function AdminDashboard() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInactive, setFilterInactive] = useState(false);
  const [filterAge, setFilterAge] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterDropdownOpen &&
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterDropdownOpen]);

  useEffect(() => {
    async function fetchAdmins() {
      setLoading(true);
      setError(null);
      try {
        let url = `${backendUrl}/admin/all`;

        if (filterInactive) {
          url = `${backendUrl}/admin/inactive`;
        } else if (filterAge !== undefined) {
          url = `${backendUrl}/admin/older-than/${filterAge}`;
        }

        const response = await axios.get<Admin[]>(url, {
          withCredentials: true,
        });
        setAdmins(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to load admins"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchAdmins();
  }, [filterInactive, filterAge, backendUrl]);


  const filteredAdmins = admins.filter((admin) => {
    const term = searchTerm.toLowerCase();
    return (
      admin.fullName.toLowerCase().includes(term) ||
      admin.email.toLowerCase().includes(term) ||
      admin.phoneNo.toLowerCase().includes(term) ||
      admin.role.toLowerCase().includes(term)
    );
  });

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);



  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  const toggleDropdown = (adminId: number) => {
    setActiveDropdownId((prev) => (prev === adminId ? null : adminId));
  };

  const handleViewProfile = (adminId: number) => {
    window.location.href = `/admin/profile/${adminId}`;
  };

  const handleChangeStatus = async (admin: Admin) => {
    const newStatus = admin.status === "active" ? "inactive" : "active";
    try {
      await axios.patch(
        `${backendUrl}/admin/status/${admin.id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, status: newStatus } : a))
      );
      setActiveDropdownId(null);
      alert(`Status changed to ${newStatus} for ${admin.fullName}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to change status");
    }
  };

  return (
   <div className={`${sidebarCollapsed ? "sidebar-collapsed" : ""} flex min-h-screen bg-gray-900 text-gray-400 pt-20`} style={{ fontFamily: "'Spline Sans', 'Noto Sans', sans-serif" }}>
  <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
  <div className="flex-1 flex flex-col bg-gray-900">
    <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 p-8 bg-gray-950">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-xl font-semibold text-white">Administrators</h1>

            <div className="flex w-full max-w-sm gap-4">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  search
                </span>
                <input
                  type="search"
                  placeholder="Search administrators..."
                  className="w-full rounded-md border-0 bg-gray-900 py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search administrators"
                />
              </div>
            </div>

            <div className="relative">
              <button
                ref={filterButtonRef}
                className="flex items-center gap-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 ring-1 ring-gray-700 transition-colors hover:bg-gray-800"
                aria-haspopup="true"
                aria-expanded={filterDropdownOpen}
                onClick={() => setFilterDropdownOpen((prev) => !prev)}
              >
                <span className="material-symbols-outlined text-base">
                  filter_list
                </span>
                Filter
              </button>

              {filterDropdownOpen && (
                <div
                  ref={filterDropdownRef}
                  className="absolute right-0 mt-2 w-48 rounded-md border border-gray-700 bg-gray-800 shadow-lg z-50 p-4 flex flex-col gap-3"
                  role="menu"
                  aria-label="Filter options"
                >
                  <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterInactive}
                      onChange={() => setFilterInactive((prev) => !prev)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    />
                    Inactive Only
                  </label>

                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <label
                      htmlFor="filterAge"
                      className="select-none cursor-pointer"
                    >
                      Age older than:
                    </label>
                    <input
                      id="filterAge"
                      type="number"
                      min={0}
                      value={filterAge !== undefined ? filterAge : ""}
                      onChange={(e) =>
                        setFilterAge(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      placeholder="e.g. 30"
                      aria-label="Filter admins older than"
                      className="w-16 rounded-md border-0 bg-gray-900 py-1 px-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {loading && <p className="text-white">Loading admins...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="overflow-hidden rounded-md border border-gray-800 bg-gray-900">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Phone Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Status
                      </th>
                       <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                       Age
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 bg-gray-900">
                    {filteredAdmins.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-gray-400 text-center py-4"
                        >
                          No administrators found.
                        </td>
                      </tr>
                    ) : (
                      filteredAdmins.map((admin) => (
                        <tr key={admin.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={
                                  admin.profileImage
                                    ? `${backendUrl}/${admin.profileImage}`
                                    : default_image.src
                                }
                                alt={`${admin.fullName} avatar`}
                                className="h-10 w-10 rounded-full object-cover"
                                onError={(e) => {
                                  const target =
                                    e.currentTarget as HTMLImageElement;
                                  if (target.src !== default_image.src) {
                                    target.src = default_image.src;
                                  }
                                }}
                              />
                              <span className="text-white text-sm font-medium">
                                {admin.fullName}
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                            {admin.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                            {admin.phoneNo}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                            {admin.role}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                admin.status === "active"
                                  ? "bg-green-900/50 text-green-400"
                                  : "bg-red-900/50 text-red-400"
                              }`}
                            >
                              {admin.status.charAt(0).toUpperCase() +
                                admin.status.slice(1)}
                            </span>
                          </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                            {admin.age ?? "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(admin.id);
                              }}
                              className="text-gray-400 hover:text-white"
                              aria-label={`Actions for ${admin.fullName}`}
                            >
                              <span className="material-symbols-outlined">
                                more_vert
                              </span>
                            </button>

                            {activeDropdownId === admin.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-2 w-40 rounded-md border border-gray-700 bg-gray-800 shadow-lg z-50"
                              >
                                <button
                                  onClick={() => handleViewProfile(admin.id)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-700"
                                >
                                  <span className="material-symbols-outlined">
                                    visibility
                                  </span>
                                  View Profile
                                </button>
                                <button
                                  onClick={() => handleChangeStatus(admin)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700"
                                >
                                  <span className="material-symbols-outlined">
                                    {admin.status === "active"
                                      ? "toggle_off"
                                      : "toggle_on"}
                                  </span>
                                  Change Status
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
