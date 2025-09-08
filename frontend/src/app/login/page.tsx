'use client';
import { useState } from 'react';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      interface LoginResponse {
        access_token?: string;
        twoFactorRequired?: boolean;
        [key: string]: any;
      }

      const response = await axios.post<LoginResponse>(
        `${backendUrl}/auth/admin/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const { access_token, twoFactorRequired } = response.data;

      if (access_token) {
        localStorage.setItem('jwtToken', access_token);
        window.location.href = '/admin-dashboard';
      } else if (twoFactorRequired) {
        alert('Two-factor authentication required.');
        // Handle 2FA here if needed
      } else {
        setSubmitError('Invalid login response from server.');
      }
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || error.message || 'Login failed.'
      );
    }
  };

  const errorMessage = Object.values(errors)[0] || submitError || '';

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col items-center">
      <h1 className="text-4xl text-cyan-700 mb-6">Login</h1>
      <form onSubmit={handleSubmit} noValidate className="w-full">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {errorMessage && <p style={{ color: 'red', marginTop: 10 }}>{errorMessage}</p>}

        <button
          type="submit"
          className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
