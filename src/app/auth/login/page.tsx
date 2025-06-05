'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ClientLogin() {
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert('Login failed');
    else alert('Check your email for a magic link');
  };

  return (
    <div>
      <h2>Client Login</h2>
      <input type="email" onChange={e => setEmail(e.target.value)} />
      <button onClick={handleLogin}>Send Magic Link</button>
    </div>
  );
}
