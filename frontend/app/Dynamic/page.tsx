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
    phone: '',
    address: '',
    doj: '',
    profile: null as File | null,
    gender: '', // New field
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = 'Name is required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.name))
      newErrors.name = 'Name must contain only letters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[\w.-]+@gmail\.com$/.test(formData.email))
      newErrors.email = 'Email must end with @gmail.com';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/.test(formData.password))
      newErrors.password =
        'Password must be 6 characters including 1 uppercase, 1 special character';

    if (!formData.dob) newErrors.dob = 'Date of Birth is required';

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{11}$/.test(formData.phone))
      newErrors.phone = 'Phone number must be 11 digits';

    if (!formData.age) newErrors.age = 'Age is required';
    else if (!/^\d+$/.test(formData.age)) newErrors.age = 'Age must be a number';

    if (!formData.address) newErrors.address = 'Address is required';

    if (!formData.doj) newErrors.doj = 'Date of Join is required';

    if (!formData.gender) newErrors.gender = 'Gender is required';
    else if (!['male', 'female'].includes(formData.gender.toLowerCase()))
      newErrors.gender = 'Gender must be either Male or Female';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'profile' && files) {
      setFormData({ ...formData, profile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null) {
            formDataToSend.append(key, value as string | Blob);
          }
        });

        const response = await axios.post(
         'http://localhost:3000/operator/create',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('Registration successful:', response.data);
        alert('Registration successful!');
        window.location.href = '/login';
      } catch (error: any) {
        console.error('Registration failed:', error);
        alert(error.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        padding: '40px 0',
        backgroundColor: '#f9fafb',
        fontFamily: 'Arial, sans-serif',
        color: 'black',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 0 15px rgba(0,0,0,0.05)',
          width: '500px',
          textAlign: 'left',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            marginBottom: '5px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Create your account
        </h2>
        <p
          style={{
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '25px',
            textAlign: 'center',
          }}
        >
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>
            Log in
          </Link>
        </p>

        {/* Name */}
        <div style={{ marginBottom: '15px' }}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            style={inputStyle}
          />
          {errors.name && <p style={errorStyle}>{errors.name}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={inputStyle}
          />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '15px' }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create password"
            style={inputStyle}
          />
          {errors.password && <p style={errorStyle}>{errors.password}</p>}
        </div>

        {/* DOB */}
        <div style={{ marginBottom: '15px' }}>
          <label>Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} />
          {errors.dob && <p style={errorStyle}>{errors.dob}</p>}
        </div>

        {/* Age */}
        <div style={{ marginBottom: '15px' }}>
          <label>Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} style={inputStyle} />
          {errors.age && <p style={errorStyle}>{errors.age}</p>}
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '15px' }}>
          <label>Phone Number</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
          {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
        </div>

        {/* Address */}
        <div style={{ marginBottom: '15px' }}>
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{ ...inputStyle, height: '60px', resize: 'none' }}
          />
          {errors.address && <p style={errorStyle}>{errors.address}</p>}
        </div>

        {/* Date of Join */}
        <div style={{ marginBottom: '15px' }}>
          <label>Date of Join</label>
          <input type="date" name="doj" value={formData.doj} onChange={handleChange} style={inputStyle} />
          {errors.doj && <p style={errorStyle}>{errors.doj}</p>}
        </div>

        {/* Gender */}
        <div style={{ marginBottom: '15px' }}>
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p style={errorStyle}>{errors.gender}</p>}
        </div>

        {/* Profile Image Upload */}
        <div style={{ marginBottom: '20px' }}>
          <label>Profile Image</label>
          <div
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '30px',
              textAlign: 'center',
              marginTop: '5px',
              fontSize: '14px',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            <input type="file" accept="image/*" style={{ display: 'none' }} id="fileUpload" onChange={handleChange} name="profile" />
            <label htmlFor="fileUpload" style={{ cursor: 'pointer', color: '#2563eb' }}>
              Upload a file
            </label>{' '}
            or drag and drop
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>

        <button type="submit" style={submitStyle} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
  outline: 'none',
};

const submitStyle = {
  backgroundColor: '#2563eb',
  color: 'white',
  padding: '12px',
  width: '100%',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const errorStyle = {
  color: 'red',
  fontSize: '12px',
  marginTop: '3px',
};
