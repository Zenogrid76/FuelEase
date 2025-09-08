'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const isAlphaSpace = (str: string) => /^[A-Za-z\s]+$/.test(str);
const isEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
const isExactDigits = (str: string, digits: number) => new RegExp(`^\\d{${digits}}$`).test(str);
const isMinLength = (str: string, len: number) => str.length >= len;
const isPositiveNumber = (val: any) => !isNaN(val) && Number(val) > 0;

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    email: '',
    nidNumber: '',
    phoneNo: '',
    age: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    else if (!isAlphaSpace(formData.fullName)) newErrors.fullName = 'Name must contain only alphabets and spaces';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!isMinLength(formData.password, 6)) newErrors.password = 'Password must be at least 6 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!isEmail(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.nidNumber) newErrors.nidNumber = 'NID is required';
    else if (!isExactDigits(formData.nidNumber, 10)) newErrors.nidNumber = 'NID must be exactly 10 digits';

    if (!formData.phoneNo) newErrors.phoneNo = 'Phone number is required';
    else if (!isExactDigits(formData.phoneNo, 11)) newErrors.phoneNo = 'Phone number must be exactly 11 digits';

    if (formData.age !== '' && !isPositiveNumber(formData.age)) newErrors.age = 'Age must be a positive number';

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
        router.push('/admin-dashboard');
      } else {
        setSubmitError('Registration failed. Please try again.');
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'An error occurred.');
    }
  };

  const errorMessages = Object.values(errors).join('. ');

  return (
    <div className='max-w-md mx-auto p-6 flex flex-col items-center'>
      <h1 className='text-4xl text-cyan-700 mb-6'>Register</h1>
      <form onSubmit={handleSubmit} noValidate className='w-full'>
        <div className='mb-4'>
          <label className='block mb-1 font-semibold'>Full Name:</label>
          <input
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded px-3 py-2'
          />
        </div>
        <div className='mb-4 relative'>
          <label className='block mb-1 font-semibold'>Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            value={formData.password}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded px-3 py-2 pr-12'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-9 text-gray-600'
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className='mb-4'>
          <label className='block mb-1 font-semibold'>Email:</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded px-3 py-2'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1 font-semibold'>NID Number:</label>
          <input
            name='nidNumber'
            value={formData.nidNumber}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded px-3 py-2'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1 font-semibold'>Phone Number:</label>
          <input
            name='phoneNo'
            value={formData.phoneNo}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded px-3 py-2'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1 font-semibold'>Age:</label>
          <input
            type='number'
            name='age'
            value={formData.age}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded px-3 py-2'
          />
        </div>
        {errorMessages && <p style={{ color: 'red', marginTop: 10 }}>{errorMessages}</p>}
        {submitError && <p style={{ color: 'red', marginTop: 10 }}>{submitError}</p>}
        <button
          type='submit'
          className='mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded transition'
        >
          Register
        </button>
      </form>
    </div>
  );
}
