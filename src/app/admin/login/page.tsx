'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmail } from '@/lib/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      router.push('/admin/projects');
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Admin Login</h2>
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      <input
        className="border p-2 w-full mb-2"
        type="email"
        placeholder="admin@example.com"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-4"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2"
        onClick={handleLogin}
      >
        Log In
      </button>
    </div>
  );
}
