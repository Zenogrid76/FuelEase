'use client' ;
import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert('Login successful');
      //take me to home page
      window.location.href = '/';
      
    }
  };

  const errorMessage = Object.values(errors)[0] || '';

  return (
    <div className='max-w-md mx-auto p-6 flex flex-col items-center'>
      <h1 className='text-4xl text-cyan-700 mb-6'>Login</h1>
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
