'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type FuelStation = {
  id: number;
  fuelType: string;
  quantity: number;
  price: number;
  status: 'available' | 'unavailable';
};

export default function FuelDashboard() {
  const router = useRouter();
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<FuelStation>>({});

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchStations(token);
  }, []);

  const fetchStations = async (token: string) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/fuel-stations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStations(response.data);
    } catch (error: any) {
      console.error('Failed to fetch stations:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    if (!confirm('Are you sure you want to delete this fuel station?')) return;

    try {
      await axios.delete(`http://localhost:3000/fuel-stations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStations(stations.filter((s) => s.id !== id));
      alert('Deleted successfully!');
    } catch (error: any) {
      console.error('Delete failed:', error);
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (station: FuelStation) => {
    setEditingId(station.id);
    setEditData({ ...station });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    });
  };

  const handleSave = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const payload = {
        fuelType: editData.fuelType,
        quantity: editData.quantity,
        price: editData.price,
        status: editData.status,
      };

      const response = await axios.put(
        `http://localhost:3000/fuel-stations/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStations(stations.map((s) => (s.id === id ? response.data : s)));
      setEditingId(null);
      alert('Updated successfully!');
    } catch (error: any) {
      console.error('Update failed:', error);
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white text-black flex justify-between items-center p-5 mx-10 mb-8 rounded-lg shadow">
  <h1 className="text-4xl font-extrabold uppercase tracking-widest bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent drop-shadow-md">
    Fuel Station Management
  </h1>

  <div className="flex gap-3">
    <button
      onClick={() => router.push('/dashboard')}
      className="px-5 py-2 bg-blue-500 text-white rounded-md font-bold hover:bg-blue-600 transition"
    >
      Dashboard
    </button>

    <button
      onClick={() => router.push('/fuelstation')}
      className="px-5 py-2 bg-green-500 text-white rounded-md font-bold hover:bg-green-600 transition"
    >
      Station Info
    </button>

    <button
      onClick={handleLogout}
      className="px-5 py-2 bg-red-500 text-white rounded-md font-bold hover:bg-red-600 transition"
    >
      Logout
    </button>
  </div>
</header>


      {/* Table */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b">
            <h2 className="text-2xl font-bold text-black">Fuel Inventory Dashboard</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-black">Loading...</div>
          ) : (
            <table className="min-w-full text-left text-black">
              <thead className="bg-gray-50 text-black text-sm uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Quantity</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stations.map((station) => (
                  <tr key={station.id}>
                    <td className="px-6 py-4">
                      {editingId === station.id ? (
                        <input
                          type="text"
                          name="fuelType"
                          value={editData.fuelType}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        station.fuelType
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === station.id ? (
                        <input
                          type="number"
                          name="quantity"
                          value={editData.quantity}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        station.quantity
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === station.id ? (
                        <input
                          type="number"
                          name="price"
                          value={editData.price}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        `${station.price}tk/liter`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === station.id ? (
                        <select
                          name="status"
                          value={editData.status}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="available">Available</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${
                            station.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {station.status === 'available' ? 'Available' : 'Unavailable'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {editingId === station.id ? (
                        <>
                          <button
                            onClick={() => handleSave(station.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(station)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(station.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
