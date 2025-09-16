'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Simple validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[\w.-]+@gmail\.com$/.test(formData.email))
      newErrors.email = 'Email must end with @gmail.com';

    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/auth/operator/login',
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // Save JWT token
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('email', formData.email);

      alert('Login successful!');
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-10 bg-gray-50 font-sans text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-md w-[400px] text-left"
      >
        <h2 className="text-2xl mb-2 font-bold text-center">
          Log in to your account
        </h2>
        <p className="text-gray-500 text-sm mb-5 text-center">
          Welcome back! Please enter your details.
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="w-full px-3 py-2 mt-1 rounded-md border border-gray-300 text-sm outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-3 py-2 mt-1 rounded-md border border-gray-300 text-sm outline-none pr-16"
          />
          {/* Show/Hide toggle button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-[10%] text-blue-600 text-xs font-bold cursor-pointer bg-none border-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 w-full rounded-md text-base font-bold cursor-pointer hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {/* Footer */}
        <p className="mt-4 text-sm text-gray-500 text-center">
          Don’t have an account?{' '}
          <Link href="/registration" className="text-blue-600 no-underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
