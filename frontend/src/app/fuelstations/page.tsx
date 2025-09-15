"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

interface Admin {
  id: number;
  fullName: string;
  email: string;
}

interface FuelStation {
  id: number;
  name: string;
  location: string;
  notes: string;
  createdAt: string;
  admin: Admin;
}

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function FuelStationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // Fuel stations state
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [errorStations, setErrorStations] = useState<string | null>(null);

  // Form state for Add Station (no admin field because backend assigns admin automatically)
  const [form, setForm] = useState({
    name: "",
    location: "",
    notes: "",
  });

  // Edit mode state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
    notes: "",
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Fetch fuel stations from backend
  useEffect(() => {
    async function fetchStations() {
      setLoadingStations(true);
      setErrorStations(null);
      try {
        const response = await axios.get<FuelStation[]>(
          `${backendUrl}/fuelstation/all`,
          {
            withCredentials: true,
          }
        );
        setStations(response.data);
      } catch (err: any) {
        setErrorStations(
          err.response?.data?.message ||
            err.message ||
            "Failed to load fuel stations"
        );
      } finally {
        setLoadingStations(false);
      }
    }
    fetchStations();
  }, []);

  // Handle Add Station form input changes
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Handle Add Station form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        location: form.location,
        notes: form.notes,
      };

      const response = await axios.post(
        `${backendUrl}/fuelstation/add`,
        payload,
        {
          withCredentials: true,
        }
      );
      setStations((prev) => [...prev, response.data as FuelStation]);
      setForm({ name: "", location: "", notes: "" });
    } catch (err: any) {
      alert(
        err.response?.data?.message || err.message || "Failed to create station"
      );
    }
  }

  // Start editing row
  function startEdit(station: FuelStation) {
    setEditingId(station.id);
    setEditForm({
      name: station.name,
      location: station.location,
      notes: station.notes || "",
    });
    setUpdateError(null);
  }

  // Handle editing form input change
  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);
    setUpdateError(null);
  }

  // Save edited station to backend
  async function saveEdit() {
    if (!editingId) return;
    setUpdating(true);
    setUpdateError(null);
    try {
      const res = await axios.put(
        `${backendUrl}/fuelstation/update/${editingId}`,
        {
          name: editForm.name,
          location: editForm.location,
          notes: editForm.notes,
        },
        { withCredentials: true }
      );
      setStations((prev) =>
        prev.map((station) =>
          station.id === editingId ? (res.data as FuelStation) : station
        )
      );
      setEditingId(null);
    } catch (err: any) {
      setUpdateError(
        err.response?.data?.message || err.message || "Failed to update station"
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div
      className={`${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      } flex min-h-screen bg-gray-900 text-gray-400 pt-20`}
      style={{ fontFamily: "'Spline Sans', 'Noto Sans', sans-serif" }}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col bg-gray-950">
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 px-10 py-8">
          <div className="layout-content-container flex flex-col w-full">
            <div className="flex flex-wrap justify-between items-center gap-4 pb-6">
              <h1 className="text-white text-3xl font-bold leading-tight min-w-72">
                Fuel Stations
              </h1>
            </div>

            {loadingStations && <p>Loading fuel stations...</p>}
            {errorStations && <p className="text-red-500">{errorStations}</p>}

            {!loadingStations && !errorStations && (
              <div className="flex flex-col @container">
                <div className="flex overflow-hidden rounded-lg border border-gray-800  bg-gray-900">
                  <table className="w-full">
                    <thead className="border-b bg-gray-900">
                      <tr className=" bg-gray-900">
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                          Notes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60">
                          Related Admin
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#29382f]">
                      {stations.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-4 text-sm text-white/60"
                          >
                            No fuel stations found.
                          </td>
                        </tr>
                      ) : (
                        stations.map((station) => (
                          <tr key={station.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {editingId === station.id ? (
                                <input
                                  type="text"
                                  name="name"
                                  value={editForm.name}
                                  onChange={handleEditChange}
                                  className="w-full bg-[#1c2620] border border-[#29382f] text-white rounded px-2 py-1"
                                />
                              ) : (
                                station.name
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9eb7a8]">
                              {editingId === station.id ? (
                                <input
                                  type="text"
                                  name="location"
                                  value={editForm.location}
                                  onChange={handleEditChange}
                                  className="w-full bg-[#1c2620] border border-[#29382f] text-white rounded px-2 py-1"
                                />
                              ) : (
                                station.location
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9eb7a8]">
                              {editingId === station.id ? (
                                <textarea
                                  name="notes"
                                  rows={2}
                                  value={editForm.notes}
                                  onChange={handleEditChange}
                                  className="w-full bg-[#1c2620] border border-[#29382f] text-white rounded px-2 py-1 resize-none"
                                />
                              ) : (
                                station.notes
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9eb7a8]">
                              {new Date(station.createdAt).toLocaleString()}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9eb7a8]">
                              <div>{station.admin?.fullName || "N/A"}</div>
                              <div className="text-xs text-white/50">
                                {station.admin?.email || "No email"}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {editingId === station.id ? (
                                <>
                                  <button
                                    onClick={saveEdit}
                                    disabled={updating}
                                    className="mr-2 text-primary-500 hover:text-primary-400"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    disabled={updating}
                                    className="text-red-500 hover:text-red-400"
                                  >
                                    Cancel
                                  </button>
                                  {updateError && (
                                    <div className="text-xs text-red-400 mt-1">
                                      {updateError}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <button
                                  onClick={() => startEdit(station)}
                                  className="text-primary-500 hover:text-primary-400"
                                >
                                  Edit
                                </button>
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

            {/* Add Station Form */}
            <div className="mt-8 pt-8 border-t border-[#29382f]">
              <h2 className="text-white text-2xl font-bold leading-tight tracking-tight mb-6">
                Add New Station
              </h2>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Downtown Fuel Stop"
                    className="w-full  border-gray-800  bg-gray-900  text-white rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-white/50"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g., 555 FuelEase Ave, Metropolis"
                    className="w-full  border-gray-800  bg-gray-900 text-white rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-white/50"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-white/80 mb-2"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Add any relevant notes here..."
                    className="w-full  border-gray-800  bg-gray-900 text-white rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-white/50"
                    value={form.notes}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2 flex justify-start">
                  <button
                    type="submit"
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 gap-2 bg-blue-400 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white hover:text-blue-900 transition-colors"
                  >
                    <span className="truncate">Add Station</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
