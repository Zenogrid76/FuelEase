'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

type Operator = {
  id: number;
  name: string;
  email: string;
  phoneNo: string;
  age: number;
  gender: string;
  address: string;
  joiningDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  profileImage?: string;
  role: string;
};

export default function OperatorDashboard() {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchOperator() {
      const token = localStorage.getItem('access_token');
      const email = localStorage.getItem('email');

      if (!token || !email) {
        setError('Not authenticated. Please login.');
        router.push('/login');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<Operator>(
          `${backendUrl}/operator/email/${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOperator(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load operator info');
      } finally {
        setLoading(false);
      }
    }

    fetchOperator();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    router.push('/login');
  };

  if (loading) return <p className="text-center text-white">Loading operator data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!operator) return <p className="text-center text-white">No operator data available.</p>;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-10">Fuel Management</h2>
       <nav className="space-y-4">
  <Link href="/dashboard" className="block bg-slate-700 px-3 py-2 rounded-md">
    Dashboard
  </Link>
  <Link href="/operatormanagement" className="block hover:bg-slate-700 px-3 py-2 rounded-md">
    Operators
  </Link>
  <Link href="/fuelstation" className="block hover:bg-slate-700 px-3 py-2 rounded-md">
    Fuel Stations
  </Link>
</nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Operator Dashboard</h1>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-semibold">{operator.name}</p>
              <p className="text-sm text-gray-400">Operator</p>
            </div>
          
          {operator.profileImage ? (
  <img
    src={`${backendUrl}/${operator.profileImage.replace(/\\/g, '/')}`}
    alt="Profile"
    className="w-10 h-10 rounded-full object-cover"
  />
) : (
  <div className="w-10 h-10 rounded-full bg-gray-600"></div>
)}
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Operator Information Card */}
<div className="bg-slate-800 rounded-2xl shadow-lg p-8 mt-6">
  <h2 className="text-xl font-semibold mb-6">Operator Information</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-gray-300">
    <div>
      <p className="text-sm text-gray-400">Name</p>
      <p className="font-medium">{operator.name}</p>
    </div>
    <div>
      <p className="text-sm text-gray-400">Email</p>
      <p className="font-medium">{operator.email}</p>
    </div>
    <div>
      <p className="text-sm text-gray-400">Phone Number</p>
      <p className="font-medium">{operator.phoneNo}</p>
    </div>
    <div>
      <p className="text-sm text-gray-400">Age</p>
      <p className="font-medium">{operator.age}</p>
    </div>
    <div>
      <p className="text-sm text-gray-400">Gender</p>
      <p className="font-medium">{operator.gender}</p>
    </div>
    <div>
      <p className="text-sm text-gray-400">Address</p>
      <p className="font-medium">{operator.address}</p>
    </div>
    <div>
      <p className="text-sm text-gray-400">Joining Date</p>
      <p className="font-medium">
        {new Date(operator.joiningDate).toLocaleDateString()}
      </p>
    </div>
    <div>
      <p className="text-sm text-gray-400">Status</p>
<p
  className={`font-medium ${
    operator.status === 'active'
      ? 'text-green-400'
      : operator.status === 'on_leave'
      ? 'text-yellow-400'
      : 'text-red-400'
  }`}
>
  {operator.status}
</p>
    </div>
    <div>
      <p className="text-sm text-gray-400">Role</p>
      <p className="font-medium">{operator.role}</p>
    </div>
  </div>

  {/* Update Button */}
  <div className="mt-6">
    <Link
      href={`/operatormanagement/update/${operator.id}`}
      className="bg-blue-600 hover:bg-white-700 text-white px-4 py-2 rounded-md"
    >
      Update Operator
    </Link>
  </div>
</div>
        </div>
      </div>
    
  );
}
