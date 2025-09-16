'use client';
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    age: '',
    phoneNo: '', 
    address: '',
    joiningDate: '', 
    gender: '',
    status: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = 'Name is required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.name))
      newErrors.name = 'Name must contain only letters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[\w.-]+@gmail\.com$/.test(formData.email))
      newErrors.email = 'Email must end with @gmail.com';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(formData.password))
      newErrors.password =
        'Password must be 8 characters including 1 uppercase, 1 special character';

    if (!formData.dob) newErrors.dob = 'Date of Birth is required';

    if (!formData.phoneNo) newErrors.phoneNo = 'Phone number is required';
    else if (!/^\d{11}$/.test(formData.phoneNo))
      newErrors.phoneNo = 'Phone number must be 11 digits';

    if (!formData.age) newErrors.age = 'Age is required';
    else if (!/^\d+$/.test(formData.age)) newErrors.age = 'Age must be a number';

    if (!formData.address) newErrors.address = 'Address is required';

    if (!formData.joiningDate) newErrors.joiningDate = 'Date of Join is required';

    if (!formData.gender) newErrors.gender = 'Gender is required';
    else if (!['male', 'female'].includes(formData.gender.toLowerCase()))
      newErrors.gender = 'Gender must be either Male or Female';

    if (!formData.status) newErrors.status = 'Status is required';
    else if (!['active', 'inactive', 'on_leave'].includes(formData.status.toLowerCase()))
      newErrors.status = 'Status must be Active, Inactive, or On Leave';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);

        const dataToSend = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNo: formData.phoneNo,
          joiningDate: formData.joiningDate,
          age: Number(formData.age),
          gender: formData.gender.toLowerCase(),
          address: formData.address,
          status: formData.status.toLowerCase(),
        };

        const response = await axios.post(
          'http://localhost:3000/operator/create',
          dataToSend,
          { headers: { 'Content-Type': 'application/json' } }
        );

        alert('Registration successful!');
        window.location.href = '/login';
      } catch (error: any) {
        alert(error.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-10 bg-gray-100 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Create your account</h2>
        <p className="text-sm text-center mb-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-16 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-blue-600 text-xs font-bold"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* DOB */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.phoneNo && <p className="text-red-500 text-xs mt-1">{errors.phoneNo}</p>}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black h-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* Joining Date */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Date of Join</label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.joiningDate && <p className="text-red-500 text-xs mt-1">{errors.joiningDate}</p>}
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
