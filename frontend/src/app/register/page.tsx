"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "@/components/header";

// URL from environment
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// Validation helpers
const isAlphaSpace = (str: string) => /^[A-Za-z\s]+$/.test(str);
const isEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
const isExactDigits = (str: string, digits: number) =>
  new RegExp(`^\\d{${digits}}$`).test(str);
const isMinLength = (str: string, len: number) => str.length >= len;
const isPositiveNumber = (val: any) => !isNaN(val) && Number(val) > 0;

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    email: "",
    nidNumber: "",
    phoneNo: "",
    age: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName) newErrors.fullName = "Full name is required";
    else if (!isAlphaSpace(formData.fullName))
      newErrors.fullName = "Name must contain only alphabets and spaces";

    if (!formData.password) newErrors.password = "Password is required";
    else if (!isMinLength(formData.password, 6))
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!isEmail(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.nidNumber) newErrors.nidNumber = "NID is required";
    else if (!isExactDigits(formData.nidNumber, 10))
      newErrors.nidNumber = "NID must be exactly 10 digits";

    if (!formData.phoneNo) newErrors.phoneNo = "Phone number is required";
    else if (!isExactDigits(formData.phoneNo, 11))
      newErrors.phoneNo = "Phone number must be exactly 11 digits";

    if (formData.age !== "" && !isPositiveNumber(formData.age))
      newErrors.age = "Age must be a positive number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    try {
      const response = await axios.post(`${backendUrl}/admin/create`, {
        fullName: formData.fullName,
        password: formData.password,
        email: formData.email,
        nidNumber: formData.nidNumber,
        phoneNo: formData.phoneNo,
        age: Number(formData.age),
      });

      if ([200, 201].includes(response.status)) {
        alert("Registration successful! Please log in.");
        router.push("/login");
      } else {
        setSubmitError("Registration failed. Please try again.");
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-[#111827] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Spline Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header/>
        <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                Create your Admin Account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Join the FuelEase team and manage our operations.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
              <div className="rounded-md shadow-sm -space-y-px">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`form-input relative block w-full appearance-none rounded-t-md border border-gray-700 bg-gray-900 px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:outline-none sm:text-sm ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                    aria-invalid={!!errors.fullName}
                    aria-describedby="fullName-error"
                    required
                  />
                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      className="text-red-500 text-sm mt-1 px-1"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input relative block w-full appearance-none border border-gray-700 bg-gray-900 px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:outline-none sm:text-sm ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    aria-invalid={!!errors.email}
                    aria-describedby="email-error"
                    required
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-red-500 text-sm mt-1 px-1"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password with show/hide icon */}
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input relative block w-full appearance-none border border-gray-700 bg-gray-900 px-3 py-4 pr-12 text-white placeholder-gray-400 focus:z-10 focus:outline-none sm:text-sm ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none text-gray-400 hover:text-white material-symbols-outlined"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                      }
                    }}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-red-500 text-sm mt-1 px-1"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* NID Number */}
                <div>
                  <label htmlFor="nidNumber" className="sr-only">
                    National ID Number
                  </label>
                  <input
                    id="nidNumber"
                    name="nidNumber"
                    type="text"
                    placeholder="National ID Number"
                    value={formData.nidNumber}
                    onChange={handleChange}
                    className={`form-input relative block w-full appearance-none border border-gray-700 bg-gray-900 px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:outline-none sm:text-sm ${
                      errors.nidNumber ? "border-red-500" : ""
                    }`}
                    aria-invalid={!!errors.nidNumber}
                    aria-describedby="nidNumber-error"
                    required
                  />
                  {errors.nidNumber && (
                    <p
                      id="nidNumber-error"
                      className="text-red-500 text-sm mt-1 px-1"
                    >
                      {errors.nidNumber}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNo" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    id="phoneNo"
                    name="phoneNo"
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className={`form-input relative block w-full appearance-none border border-gray-700 bg-gray-900 px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:outline-none sm:text-sm ${
                      errors.phoneNo ? "border-red-500" : ""
                    }`}
                    aria-invalid={!!errors.phoneNo}
                    aria-describedby="phoneNo-error"
                    required
                  />
                  {errors.phoneNo && (
                    <p
                      id="phoneNo-error"
                      className="text-red-500 text-sm mt-1 px-1"
                    >
                      {errors.phoneNo}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="sr-only">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`form-input relative block w-full appearance-none rounded-b-md border border-gray-700 bg-gray-900 px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:outline-none sm:text-sm ${
                      errors.age ? "border-red-500" : ""
                    }`}
                    aria-invalid={!!errors.age}
                    aria-describedby="age-error"
                    required
                    min="1"
                  />
                  {errors.age && (
                    <p
                      id="age-error"
                      className="text-red-500 text-sm mt-1 px-1"
                    >
                      {errors.age}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit error message */}
              {submitError && (
                <p className="text-red-500 text-center mt-2">{submitError}</p>
              )}

              <div>
<button
  type="submit"
  className="w-full py-3 px-4 border border-gray-500 rounded text-white bg-gray-700 hover:bg-gray-600 transition"
>
  Register
</button>

              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
