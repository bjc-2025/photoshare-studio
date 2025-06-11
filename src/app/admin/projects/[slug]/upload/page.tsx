'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import ProjectGallery from '@/components/ProjectGallery';

export default function UploadPhotosPage() {
  const { slug } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const handleUpload = async () => {
    if (!files.length || !slug) return;

    setUploading(true);
    setError('');
    setUploaded([]);

    const uploadPromises = files.map(async (file) => {
      const timestamp = Math.floor(Date.now() / 1000);
      const fileName = file.name.replace(/\s+/g, '_');
      const publicId = `photoshare/${slug}/${fileName}`;

      // 🔐 Request signed upload parameters
      const sigRes = await fetch('/api/cloudinary-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId, timestamp }),
      });

      const { signature, api_key, cloud_name } = await sigRes.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('public_id', publicId);
      formData.append('timestamp', `${timestamp}`);
      formData.append('api_key', api_key);
      formData.append('signature', signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        return { fileName: file.name, url: data.secure_url };
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    });

    const results = await Promise.all(uploadPromises);

    const successful = results.filter(r => 'url' in r) as { url: string; fileName: string }[];
    const failed = results.filter(r => 'error' in r) as { error: string; fileName: string }[];

    setUploaded(successful.map(r => r.url));
    setError(
      failed.length
        ? `Failed to upload ${failed.length} file(s):\n${failed.map(f => f.fileName + ': ' + f.error).join('\n')}`
        : ''
    );
    setUploading(false);
    setRefreshCount(prev => prev + 1);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl mb-4 font-bold">
        Upload Photos to: <span className="text-blue-600">{slug}</span>
      </h2>

      <input type="file" multiple onChange={handleSelect} className="mb-4" />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-600 text-white px-4 py-2"
      >
        {uploading ? 'Uploading...' : 'Upload Photos'}
      </button>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mt-4 rounded whitespace-pre-wrap">
          {error}
        </div>
      )}

      {uploaded.length > 0 && !uploading && (
        <div className="bg-green-100 text-green-800 p-3 mt-4 rounded">
          ✅ Uploaded {uploaded.length} photo(s) successfully.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        {uploaded.map((url, idx) => (
          <img
            key={idx}
            src={url.replace('/upload/', '/upload/w_300,q_auto,f_auto/')}
            alt="Uploaded"
            className="rounded shadow"
          />
        ))}
      </div>

      <ProjectGallery slug={slug as string} refreshTrigger={refreshCount} />
    </div>
  );
}
