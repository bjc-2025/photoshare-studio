'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { slugify } from '@/utils/slugify';

export default function NewProjectPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const projectName = e.target.value;
    setName(projectName);
    setSlug(slugify(projectName).trim());
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    const currentSlug = slugify(name.trim()); // ensure it's set and clean
    setSaving(true);
    setError('');

    const { data, error } = await supabase.from('projects').insert([
      { name: name.trim(), slug: currentSlug },
    ]);

    if (error) {
      if (error.code === '23505') {
        setError('A project with this name or slug already exists. Please choose a different name.');
      } else {
        setError(`Failed to create project: ${error.message}`);
      }
      setSaving(false);
    } else {
      router.push(`/admin/projects/${currentSlug}/upload`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📁 Create a New Project</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <label className="block mb-2 font-semibold">Project Name</label>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="e.g. John & Mary's Wedding"
        className="border w-full p-2 mb-4"
      />

      <p className="mb-4 text-gray-600">
        <strong>Slug:</strong> {slug || '(auto-generated)'}
      </p>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {saving ? 'Creating...' : 'Create Project'}
      </button>
    </div>
  );
}
