'use client';

import { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type FormData = {
  name?: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
};

export default function LoginRegisterModal({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const endpoint = `/api/auth/${mode}`;
    const payload = { ...form };
  
    if (mode === 'login') {
      delete payload.name;
      delete payload.role;
    }
  
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
  
      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: 'Invalid response from server' };
      }
  
      if (res.ok) {
        alert(`${mode === 'login' ? 'Login' : 'Registration'} successful!`);
        onClose();
        window.location.href = '/dashboard';
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Client error:', err);
      alert('Something went wrong. Please try again later.');
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl font-bold">
          &times;
        </button>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setMode('login')}
            className={`px-4 py-2 w-full ${mode === 'login' ? 'font-bold border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`px-4 py-2 w-full ${mode === 'register' ? 'font-bold border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </>
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
