'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

type Admin = {
  id: number;
  fullName: string;
  email: string;
  phoneNo: string;
  age: number;
  status: 'active' | 'inactive';
  profileImage?: string;
  nidNumber: string;
  nidImage?: string;
  role: string;
  isTwoFactorEnabled: boolean;
  twoFactorEmail?: string | null;
};

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchAdmin() {
      const token = localStorage.getItem('jwtToken');

      if (!token) {
        setError('Not authenticated. Please login.');
        router.push('/login');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<Admin>(`${backendUrl}/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdmin(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load admin info');
      } finally {
        setLoading(false);
      }
    }

    fetchAdmin();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/login');
  };

  if (loading) return <p>Loading admin data...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!admin) return <p>No admin data available.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        {admin.profileImage ? (
          <img
            src={`${backendUrl}/${admin.profileImage}`}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p><strong>Full Name:</strong> {admin.fullName}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Phone Number:</strong> {admin.phoneNo}</p>
        <p><strong>Age:</strong> {admin.age}</p>
        <p><strong>Status:</strong> {admin.status}</p>
        <p><strong>NID Number:</strong> {admin.nidNumber}</p>
        {admin.nidImage && (
          <p>
            <strong>NID Image:</strong>
            <br />
            <img
              src={`${backendUrl}/${admin.nidImage}`}
              alt="NID"
              className="w-48 h-auto border rounded mt-1"
            />
          </p>
        )}
        <p><strong>Role:</strong> {admin.role}</p>
        <p><strong>Two-Factor Authentication Enabled:</strong> {admin.isTwoFactorEnabled ? 'Yes' : 'No'}</p>
        {admin.isTwoFactorEnabled && <p><strong>2FA Email:</strong> {admin.twoFactorEmail}</p>}
      </div>
    </div>
  );
}
