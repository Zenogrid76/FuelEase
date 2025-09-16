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

export default function FuelStationDashboard() {
  const router = useRouter();
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [formData, setFormData] = useState({
    fuelType: '',
    quantity: '',
    price: '',
    status: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You must be logged in!');
      router.push('/login');
      return;
    }
    fetchStations(token);
  }, []);

  const fetchStations = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:3000/fuel-stations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStations(response.data);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      alert('Failed to fetch stations. Please login again.');
      localStorage.removeItem('access_token');
      router.push('/login');
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    else if (!/^\d+$/.test(formData.quantity)) newErrors.quantity = 'Quantity must be a number';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (!/^\d+(\.\d{1,2})?$/.test(formData.price)) newErrors.price = 'Price must be a valid number';
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You must be logged in!');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        fuelType: formData.fuelType,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        status: formData.status.toLowerCase(),
      };

      const response = await axios.post(
        'http://localhost:3000/fuel-stations/create',
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Fuel station created successfully!');
      setFormData({ fuelType: '', quantity: '', price: '', status: '' });
      setStations(prev => [...prev, response.data]);
    } catch (error: any) {
      console.error('Creation failed:', error);
      alert(error.response?.data?.message || 'Creation failed');
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white text-black flex justify-between items-center p-5 mb-8 rounded-lg shadow">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
          Fuel Station Management
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white px-5 py-2 rounded-md font-bold hover:bg-blue-600 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push('/fueldashboard')}
            className="bg-green-500 text-white px-5 py-2 rounded-md font-bold hover:bg-green-600 transition"
          >
            Modify Station Details
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-md font-bold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex gap-10 px-10">
        {/* Table Section */}
        <div className="flex-2 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold mb-1 text-black">Fuel Inventory</h2>
          <p className="text-blue-900 mb-5">Manage your fuel stock and add new entries.</p>

          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-black">
                <th className="text-sm font-semibold text-black pb-2">TYPE</th>
                <th className="text-sm font-semibold text-black pb-2">QUANTITY</th>
                <th className="text-sm font-semibold text-black pb-2">PRICE</th>
                <th className="text-sm font-semibold text-black pb-2">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {stations.map(item => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3 text-sm text-black">{item.fuelType}</td>
                  <td className="py-3 text-sm text-black">{item.quantity}</td>
                  <td className="py-3 text-sm text-black">{item.price} tk/liter</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status === 'available' ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Section */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-lg font-bold mb-5 text-black">Create New Fuel Entry</h3>
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-black">Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-blue-800 rounded-md outline-none text-black"
              >
                <option value="">Select Fuel Type</option>
                <option>Gasoline</option>
                <option>Diesel</option>
                <option>Ethanol</option>
                <option>Propane</option>
                <option>Kerosene</option>
              </select>
              {errors.fuelType && <p className="text-red-600 text-sm mt-1">{errors.fuelType}</p>}
            </div>

            <div>
              <label className="block text-black">Quantity (liters)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-blue-800 rounded-md outline-none text-black"
              />
              {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-black">Price (tk/liter)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-blue-800 rounded-md outline-none text-black"
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-black">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-blue-800 rounded-md outline-none text-black"
              >
                <option value="">Select Status</option>
                <option>Available</option>
                <option>Unavailable</option>
              </select>
              {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
