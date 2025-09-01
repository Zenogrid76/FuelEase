'use client';
import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    email: '',
    nidNumber: '',
    phoneNo: '',
    age: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

 const validate = () => {
  const newErrors: { [key: string]: string } = {};
  if (!formData.fullName) newErrors.fullName = 'Full name is required';
  if (!formData.password) newErrors.password = 'Password is required';
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.nidNumber) newErrors.nidNumber = 'NID is required';
  if (!formData.phoneNo) newErrors.phoneNo = 'Phone number is required';
  if (!formData.age) newErrors.age = 'Age is required';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert('Form submitted successfully');
      //take me to login page
        window.location.href = '/login';
    }
  };

  const errorMessages = Object.values(errors).join('. ');

 return (
  <div className='max-w-md mx-auto p-6 flex flex-col items-center'>
    <h1 className='text-4xl text-cyan-700 mb-6'>Register</h1>
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Full Name:</label>
        <input
          name="fullName"
          value={formData.fullName}
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
          className="w-full border border-gray-300 rounded px-3 py-2 "
        />
      </div>
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
        <label className="block mb-1 font-semibold">NID Number:</label>
        <input
          name="nidNumber"
          value={formData.nidNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Phone Number:</label>
        <input
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {errorMessages && <p style={{ color: 'red', marginTop: 10 }}>{errorMessages}</p>}

      <button
        type="submit"
        className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded transition"
      >
        Register
      </button>
    </form>
  </div>
);

}
