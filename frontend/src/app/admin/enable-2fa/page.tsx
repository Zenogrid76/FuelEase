"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function TwoFactorAuthPage() {
  const [emailForOtp, setEmailForOtp] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch logged-in user email on mount to prefill email field (editable)
  useEffect(() => {
    async function fetchProfile() {
      setLoadingProfile(true);
      try {
        const profileResponse = await axios.get<{ email: string }>(`${backendUrl}/admin/profile`, {
          withCredentials: true,
        });
        setEmailForOtp(profileResponse.data.email);
      } catch (err) {
        console.error("Failed to fetch profile email", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Send OTP code
  const handleSendCode = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await axios.post(
        `${backendUrl}/admin/enable-2fa`,
        { emailForOtp },
        { withCredentials: true }
      );
      setIsCodeSent(true);
      setSuccessMessage(`Verification code sent to ${emailForOtp}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  // Verify 2FA setup code
  const handleVerifyCode = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await axios.post(
        `${backendUrl}/admin/verify-2fa-setup`,
        { code: verificationCode },
        { withCredentials: true }
      );
      setSuccessMessage("Two-factor authentication enabled successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-50">
        Loading user information...
      </div>
    );
  }

  return (
    <div
      className={`${sidebarCollapsed ? "sidebar-collapsed" : ""} flex min-h-screen bg-neutral-900 text-neutral-50 pt-20`}
      style={{ fontFamily: "'Spline Sans', 'Noto Sans', sans-serif" }}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col">
        <Header onMenuClick={toggleSidebar} />

        <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Set Up Email Two-Factor Authentication</h2>
              <p className="mt-3 text-neutral-400">
                Secure your account by enabling 2FA. A verification code will be sent to your email address.
              </p>
            </div>

            {error && <div className="mb-4 text-center text-red-500">{error}</div>}
            {successMessage && <div className="mb-4 text-center text-green-500">{successMessage}</div>}
            
            {!isCodeSent && (
              <>
                <label className="block mb-2 text-sm font-medium text-neutral-50" htmlFor="emailForOtp">
                  Email for OTP
                </label>
                <input
                  id="emailForOtp"
                  type="email"
                  className="form-input w-full h-10 px-5 rounded-md border-neutral-700 bg-neutral-800 text-neutral-50 focus:border-primary-500 focus:ring-primary-500"
                  value={emailForOtp}
                  onChange={(e) => setEmailForOtp(e.target.value)}
                  placeholder="Enter email for verification code"
                  autoComplete="email"
                />
                <button
                  type="button"
                  className="mt-4 w-full rounded-md bg-blue-400 px-4 py-2.5 text-sm font-bold text-neutral-900 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendCode}
                  disabled={loading || !emailForOtp}
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
              </>
            )}

            {isCodeSent && (
              <>
                <label className="block mt-8 mb-2 text-sm font-medium text-neutral-50" htmlFor="verificationCode">
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  maxLength={6}
                  className="form-input w-full rounded-md border-neutral-700 bg-neutral-800 text-center text-2xl tracking-[0.5em] text-neutral-50 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="mt-4 w-full rounded-md  bg-blue-400 px-4 py-2.5 text-sm font-bold text-neutral-900 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleVerifyCode}
                  disabled={loading || verificationCode.length !== 6}
                >
                  {loading ? "Verifying..." : "Enable 2FA"}
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
