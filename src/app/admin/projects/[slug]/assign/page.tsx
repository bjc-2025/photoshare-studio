'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AssignClientsPage() {
  const { slug } = useParams();
  const [emails, setEmails] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('');

  // Fetch project ID from slug
  useEffect(() => {
    const fetchProjectId = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .single();

      if (data) setProjectId(data.id);
    };

    fetchProjectId();
  }, [slug]);

  const handleSubmit = async () => {
    setStatus('Sending invites...');
    const emailList = emails.split(',').map((e) => e.trim()).filter(Boolean);

    for (const email of emailList) {
      // 1. Add to project_clients table
      await supabase.from('project_clients').insert({ project_id: projectId, email });

      // 2. Send magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/projects/${slug}`,
        },
      });

      if (error) {
        setStatus(`Error sending to ${email}: ${error.message}`);
        return;
      }
    }

    setStatus('Invites sent!');
    setEmails('');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Assign Clients to: <span className="text-blue-600">{slug}</span></h2>

      <textarea
        className="border w-full p-2 mb-4"
        rows={4}
        placeholder="Enter client emails (comma separated)"
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Send Magic Links
      </button>

      {status && <p className="mt-4 text-green-600">{status}</p>}
    </div>
  );
}
