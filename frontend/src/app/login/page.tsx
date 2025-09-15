'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Header from '@/components/header';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 2FA states
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        `${backendUrl}/auth/admin/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
      const data = response.data as { twoFactorRequired?: boolean; tempToken?: string; };
      if (data.twoFactorRequired && data.tempToken) {
        setTwoFactorRequired(true);
        setTempToken(data.tempToken);
        return;
      }
      window.location.href = '/admin-dashboard';
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || error.message || 'Login failed.'
      );
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError(null);
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setTwoFactorError('Please enter a valid 6-digit code');
      return;
    }
    try {
      await axios.post(
        `${backendUrl}/auth/verify-2fa`,
        { code: twoFactorCode },
        {
          headers: { Authorization: `Bearer ${tempToken}` },
          withCredentials: true,
        }
      );
      window.location.href = '/admin-dashboard';
    } catch (error: any) {
      setTwoFactorError(
        error.response?.data?.message || error.message || 'Invalid 2FA code.'
      );
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-900 text-gray-200"
      style={{ fontFamily: "'Inter', 'Spline Sans', sans-serif" }}
    >
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900 -z-10"></div>
        <div className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8 animate-slide-in">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl shadow-2xl shadow-green-500/10 p-8 backdrop-blur-md">
            <div className="text-center mb-8">
              {!twoFactorRequired ? (
                <>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
                  <p className="text-gray-400 mt-2">Login to access your dashboard.</p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Two-Factor Authentication</h1>
                  <p className="text-gray-400 mt-2">Enter the code from your authenticator app.</p>
                </>
              )}
            </div>
            {!twoFactorRequired ? (
              <form onSubmit={handleLoginSubmit} noValidate className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400">email</span>
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-600 bg-gray-700/50 py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm transition-colors"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400">lock</span>
                    </div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-600 bg-gray-700/50 py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm transition-colors"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>}
                </div>
                {submitError && <p className="text-red-600 mt-2">{submitError}</p>}
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-full bg-[#10B981] py-3 px-4 text-base font-semibold text-white shadow-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handle2FASubmit} className="space-y-6">
                <div>
                  <label htmlFor="2fa-code" className="block text-sm font-medium text-gray-300">Authentication Code</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400">password</span>
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      name="2fa-code"
                      id="2fa-code"
                      placeholder="123456"
                      value={twoFactorCode}
                      onChange={e => setTwoFactorCode(e.target.value)}
                      className="block w-full rounded-md border-gray-600 bg-gray-700/50 py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm transition-colors [appearance:textfield]"
                      minLength={6}
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                  {twoFactorError && <p className="text-red-500 mt-1 text-sm">{twoFactorError}</p>}
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-full bg-[#10B981] py-3 px-4 text-base font-semibold text-white shadow-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Verify
                  </button>
                </div>
              </form>
            )}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                {!twoFactorRequired ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <a href="/register" className="font-medium text-green-500 hover:text-green-400">
                      Sign up
                    </a>
                  </>
                ) : (
                  <>
                    Can&apos;t access your authenticator?{' '}
                    <a href="/contact" className="font-medium text-green-500 hover:text-green-400">
                      contact us
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
