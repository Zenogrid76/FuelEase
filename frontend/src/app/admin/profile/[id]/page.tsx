"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import default_image from "../../../../../public/images/default_image.jpg";

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
  joinedYearsAgo?: number;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function AdminProfilePage() {
  const params = useParams();
  const id = params?.id ?? "";
  const router = useRouter();

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loggedInAdminId, setLoggedInAdminId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch logged-in admin ID to check for editing rights
  useEffect(() => {
    fetch(`${backendUrl}/admin/profile`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch logged-in profile");
        return res.json();
      })
      .then((data: Admin) => setLoggedInAdminId(data.id))
      .catch(() => setLoggedInAdminId(null));
  }, []);

  // Fetch profile by id
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`${backendUrl}/admin/profile/${id}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to fetch admin profile");
        }
        return res.json();
      })
      .then((data: Admin) => {
        setAdmin(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  if (loading) {
    return (
      <>
        <Header onMenuClick={toggleSidebar} />
        <div className="p-20 text-white">Loading admin profile...</div>
      </>
    );
  }

  if (error || !admin) {
    return (
      <>
        <Header onMenuClick={toggleSidebar} />
        <div className="p-20 text-red-500">
          Error loading admin profile: {error || "Not found"}
        </div>
      </>
    );
  }

  return (
    <div
      className={`${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      } flex min-h-screen bg-gray-900 text-gray-400 pt-20`}
      style={{ fontFamily: "'Spline Sans', 'Noto Sans', sans-serif" }}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col bg-gray-900">
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 p-8 bg-gray-950">
          <div className="w-full max-w-5xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-white">Admin Profile</h2>
              <p className="text-neutral-400">
                View and manage administrator information.
              </p>
            </header>

            <div className="bg-blue-950 rounded-lg p-8">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-800">
                <img
                  src={
                    admin.profileImage
                      ? `${backendUrl}/${admin.profileImage}`
                      : default_image.src
                  }
                  alt="avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-2xl font-bold text-neutral-50">
                    {admin.fullName}
                  </h3>
                  <p className="text-neutral-400">{admin.role}</p>
                </div>
                {loggedInAdminId === admin.id && (
                  <button
                    onClick={() =>
                      router.push(`/admin/profile/update/${admin.id}`)
                    }
                    className="ml-auto  bg-blue-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-300 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">edit</span>
                    Edit Profile
                  </button>
                )}

                {loggedInAdminId === admin.id && (
                  <button
                    onClick={() => router.push(`/admin/enable-2fa`)}
                    className="ml-auto bg-blue-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-300 hover:text-blue-950 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined"></span>
                    Add 2FA
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <section>
                  <h4 className="text-lg font-bold mb-4 text-primary">
                    Personal Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <p className="text-neutral-400 font-medium col-span-1">
                        Full Name
                      </p>
                      <p className="col-span-2 text-neutral-50">
                        {admin.fullName}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <p className="text-neutral-400 font-medium col-span-1">
                        Email
                      </p>
                      <p className="col-span-2 text-neutral-50">
                        {admin.email}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <p className="text-neutral-400 font-medium col-span-1">
                        NID Number
                      </p>
                      <p className="col-span-2 text-neutral-50">
                        {admin.nidNumber}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <p className="text-neutral-400 font-medium col-span-1">
                        Phone Number
                      </p>
                      <p className="col-span-2 text-neutral-50">
                        {admin.phoneNo}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <p className="text-neutral-400 font-medium col-span-1">
                        Age
                      </p>
                      <p className="col-span-2 text-neutral-50">{admin.age}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <p className="text-neutral-400 font-medium col-span-1">
                        Role
                      </p>
                      <p className="col-span-2 text-neutral-50">{admin.role}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-bold mb-4 text-primary">
                    Documents
                  </h4>
                  <div className="space-y-6">
                    <div className="relative group cursor-pointer">
                      <img
                        src={
                          admin.nidImage
                            ? `${backendUrl}/${admin.nidImage}`
                            : default_image.src
                        }
                        alt="NID Image"
                        className="aspect-video rounded-md object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0"></div>
                      <p className="text-sm mt-2 text-center text-neutral-400">
                        NID Image
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
