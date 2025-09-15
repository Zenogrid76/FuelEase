'use client';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import default_image from '../../../../../public/images/default_image.jpg';

type Admin = {
  id: number;
  fullName: string;
  email: string;
  nidNumber: string;
  phoneNo: string;
  age: number;
  role: string;
  profileImage?: string | null;
  nidImage?: string | null;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export default function AdminUpdatePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loggedInAdminId, setLoggedInAdminId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Admin>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch logged-in admin ID to restrict access
  useEffect(() => {
    async function fetchLoggedInAdmin() {
      try {
        const res = await fetch(`${backendUrl}/admin/profile`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch logged-in profile');
        const data = await res.json();
        setLoggedInAdminId(data.id);
      } catch {
        setLoggedInAdminId(null);
      }
    }
    fetchLoggedInAdmin();
  }, []);

  // Fetch profile by id
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`${backendUrl}/admin/profile/${id}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          const contentType = res.headers.get('content-type');
          let errMsg = 'Failed to fetch admin profile';
          if (contentType?.includes('application/json')) {
            const errJson = await res.json();
            errMsg = errJson.message || errMsg;
          } else {
            errMsg = await res.text();
          }
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then((data: Admin) => {
        setAdmin(data);
        setFormData(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validation rules
  const validateForm = (): boolean => {
    const errors: string[] = [];
    const { email, fullName, nidNumber, phoneNo, age } = formData;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address.');
    }
    if (!fullName || !/^[A-Za-z\s]+$/.test(fullName)) {
      errors.push('Full Name must contain only alphabets and spaces.');
    }
    if (!nidNumber || !/^\d+$/.test(nidNumber)) {
      errors.push('NID Number must contain only numbers.');
    }
    if (!phoneNo || !/^\d+$/.test(phoneNo)) {
      errors.push('Phone Number must contain only numbers.');
    }
    if (age === undefined || age === null || Number(age) < 0 || isNaN(Number(age))) {
      errors.push('Age must be a non-negative number.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!validateForm()) return;

    try {
      const response = await fetch(`${backendUrl}/admin/update-profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errMsg = 'Failed to update profile';
        if (contentType?.includes('application/json')) {
          const errJson = await response.json();
          errMsg = errJson.message || errMsg;
        } else {
          errMsg = await response.text();
        }
        throw new Error(errMsg);
      }
      const updatedAdmin = await response.json();
      setAdmin(updatedAdmin);
      setFormData(updatedAdmin);
      setMessage('Profile updated successfully');
      setValidationErrors([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const uploadImage = async (file: File, type: 'profile-image' | 'nid-image') => {
    setUploading(true);
    setMessage(null);
    setError(null);
    const imageFormData = new FormData();
    imageFormData.append(type === 'profile-image' ? 'profileImage' : 'nidImage', file);

    const method = type === 'profile-image' ? 'PUT' : 'PATCH';

    try {
      const res = await fetch(`${backendUrl}/admin/${type}`, {
        method,
        credentials: 'include',
        body: imageFormData,
      });
      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        let errMsg = `Failed to upload ${type === 'profile-image' ? 'profile' : 'NID'} image`;
        if (contentType?.includes('application/json')) {
          const errJson = await res.json();
          errMsg = errJson.message || errMsg;
        } else {
          errMsg = await res.text();
        }
        throw new Error(errMsg);
      }
      const refreshed = await fetch(`${backendUrl}/admin/profile/${id}`, { credentials: 'include' }).then((r) => r.json());
      setAdmin(refreshed);
      setFormData(refreshed);
      setMessage(`${type === 'profile-image' ? 'Profile' : 'NID'} image updated successfully`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'profile-image' | 'nid-image') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    uploadImage(file, type);
  };

  const handleCancel = () => {
    router.push(`/admin/profile/${id}`);
  };

  if (loading) {
    return (
      <>
        <Header onMenuClick={toggleSidebar} />
        <div className="p-20 text-white">Loading admin data...</div>
      </>
    );
  }

  if (!admin) {
    return (
      <>
        <Header onMenuClick={toggleSidebar} />
        <div className="p-20 text-gray-400">Admin data not found.</div>
      </>
    );
  }

  // Authorization check to restrict access to logged-in admin only
  if (loggedInAdminId !== null && id !== loggedInAdminId) {
    return (
      <>
        <Header onMenuClick={toggleSidebar} />
        <div className="p-20 text-red-500">You are not authorized to edit this profile.</div>
      </>
    );
  }

  return (
    <div
      className={`${sidebarCollapsed ? 'sidebar-collapsed' : ''} flex min-h-screen bg-gray-900 text-gray-400 pt-20`}
      style={{ fontFamily: "'Spline Sans', 'Noto Sans', sans-serif'" }}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col bg-gray-900">
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 p-8 bg-gray-950">
          <div className="w-full max-w-5xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-primary">Update Admin Profile</h2>
              <p className="text-neutral-400">Edit and upload admin profile information and documents.</p>
            </header>

            {validationErrors.length > 0 && (
              <div className="mb-4 rounded bg-red-700 p-4 text-white">
                <ul className="list-disc list-inside">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {message && (
              <div className="mb-4 rounded bg-green-700 p-4 text-white">
                <ul className="list-disc list-inside">
                  <li>{message}</li>
                </ul>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded bg-red-700 p-4 text-white">
                <ul className="list-disc list-inside">
                  <li>{error}</li>
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <section>
                  <InputField label="Full Name" name="fullName" value={formData.fullName || ''} onChange={handleChange} required />
                  <InputField label="Email" name="email" value={formData.email || ''} onChange={handleChange} type="email" required />
                  <InputField label="NID Number" name="nidNumber" value={formData.nidNumber || ''} onChange={handleChange} required />
                  <InputField label="Phone Number" name="phoneNo" value={formData.phoneNo || ''} onChange={handleChange} required />
                  <InputField label="Age" name="age" value={formData.age?.toString() || ''} onChange={handleChange} type="number" min="0" required />
                </section>

                <section>
                  <ImageUploader label="Profile Image" fileName={admin.profileImage || ''} onFileChange={(e) => handleFileChange(e, 'profile-image')} disabled={uploading} />
                  <ImageUploader label="NID Image" fileName={admin.nidImage || ''} onFileChange={(e) => handleFileChange(e, 'nid-image')} disabled={uploading} />
                </section>
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={uploading} className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-950 transition-colors">
                  Save Changes
                </button>
                <button type="button" disabled={uploading} onClick={handleCancel} className="bg-gray-700 text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  min,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <label className="block mb-4">
      <span className="text-neutral-300">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        className="mt-1 block w-full rounded-md bg-gray-800 border-0 py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

function ImageUploader({
  label,
  fileName,
  onFileChange,
  disabled,
}: {
  label: string;
  fileName: string;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}) {
  return (
    <label className="block cursor-pointer mb-6">
      <span className="text-neutral-300">{label}</span>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        disabled={disabled}
        className="mt-1 block w-full cursor-pointer rounded-md border-0 bg-gray-800 py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {fileName && (
        <p className="mt-1 text-xs text-gray-400 truncate" title={fileName}>
          Current: {fileName.split(/[\\/]/).pop()}
        </p>
      )}
    </label>
  );
}
