'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

type Operator = {
  id: number;
  name: string;
  email: string;
  dob?: string;
  age: number;
  phoneNo: string;
  address: string;
  joiningDate: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive' | 'on_leave';
  profileImage?: string;
  role: string;
};

export default function OperatorForm() {
  const router = useRouter();
  const { id } = useParams();
  const operatorId = id as string;

  const [formData, setFormData] = useState<Partial<Operator>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load token from localStorage on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('access_token'));
    }
  }, []);

  // Fetch operator after token and operatorId are available
  useEffect(() => {
    if (!token || !operatorId) return;

    const fetchOperator = async () => {
      try {
        const response = await axios.get<Operator>(`${backendUrl}/operator/${operatorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        setFormData({
          ...data,
          gender: data.gender?.toLowerCase() as 'male' | 'female',
          status: data.status?.toLowerCase().replace(' ', '_') as 'active' | 'inactive' | 'on_leave',
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch operator');
      } finally {
        setLoading(false);
      }
    };

    fetchOperator();
  }, [operatorId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!token) {
      alert('Not authenticated');
      return;
    }

    try {
      await axios.put(`${backendUrl}/operator/update/${operatorId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileFile) {
        const formDataFile = new FormData();
        formDataFile.append('file', profileFile);
        await axios.patch(`${backendUrl}/operator/profile-image/${operatorId}`, formDataFile, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      alert('Operator updated successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!token) {
      alert('Not authenticated');
      return;
    }

    if (!confirm('Are you sure you want to delete this operator?')) return;

    try {
      await axios.delete(`${backendUrl}/operator/delete/${operatorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Operator deleted successfully!');
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <p className="text-white">Loading operator data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fuel Management</h1>
        <div className="flex gap-4">
          <button
            className="bg-blue-600 px-4 py-2 rounded-md font-semibold"
            onClick={() => router.push('/dashboard')}
          >
            Dashboard
          </button>
          <button
            className="bg-red-600 px-4 py-2 rounded-md font-semibold"
            onClick={() => {
              localStorage.removeItem('access_token');
              router.push('/login');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <form
        className="bg-slate-800 p-8 rounded-2xl shadow-lg max-w-3xl mx-auto space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Operator Information</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600"
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600"
            />
          </div>

          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo || ''}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600"
            />
          </div>

          <div>
            <label className="block mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600"
            />
          </div>

          <div>
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600"
            />
          </div>

          <div>
            <label className="block mb-1">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate || ''}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600"
            />
          </div>

          <div>
            <label className="block mb-1">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          <div>
            <label className="block mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            className="bg-red-600 px-6 py-2 rounded-md font-semibold"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="submit"
            className="bg-blue-600 px-6 py-2 rounded-md font-semibold"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
