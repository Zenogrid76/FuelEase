'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
};

export default function OperatorManagement() {
  const router = useRouter();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'on_leave'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('No JWT token found, redirecting to login...');
      router.push('/login');
      return;
    }
    fetchOperators(token);
  }, []);

  const fetchOperators = async (token: string) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/operator', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOperators(response.data);
    } catch (error: any) {
      console.error('Failed to fetch operators:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Unauthorized. Please login again.');
        localStorage.removeItem('access_token');
        router.push('/login');
      } else {
        alert('Failed to fetch operators. Check console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredOperators = operators.filter((op) => {
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    const matchesSearch =
      op.name.toLowerCase().includes(search.toLowerCase()) ||
      op.email.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 p-10 text-white font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Operator Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-5 py-2 rounded-md font-bold hover:bg-blue-700"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-md font-bold hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Status & Search */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          {['all', 'active', 'inactive', 'on_leave'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-full border-none text-sm cursor-pointer ${
                statusFilter === status ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md border-none outline-none w-72 bg-slate-800 text-white text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr] px-6 py-4 bg-slate-700 font-bold text-sm">
          <div>OPERATOR</div>
          <div>CONTACT</div>
          <div>DETAILS</div>
          <div>JOINING DATE</div>
          <div>STATUS</div>
        </div>

        {loading ? (
          <div className="p-5 text-center">Loading...</div>
        ) : (
          filteredOperators.map((op) => (
            <div
              key={op.id}
              className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr] px-6 py-5 border-b border-slate-700 items-center"
            >
              {/* Operator */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold text-white text-sm uppercase"
                  style={{
                    backgroundImage: op.profileImage ? `url("${op.profileImage}")` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!op.profileImage &&
                    op.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                </div>
                <div>
                  <div className="font-bold text-sm">{op.name}</div>
                  <div className="text-slate-400 text-xs">
                    {op.gender}, {op.age}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="text-sm">
                <div>{op.email}</div>
                <div className="text-slate-400">{op.phoneNo}</div>
              </div>

              {/* Details */}
              <div className="text-sm">{op.address}</div>

              {/* Joining Date */}
              <div className="text-sm">{op.joiningDate}</div>

              {/* Status */}
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    op.status === 'active'
                      ? 'bg-green-400 text-black'
                      : op.status === 'inactive'
                      ? 'bg-red-400 text-black'
                      : 'bg-yellow-400 text-black'
                  }`}
                >
                  {op.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
