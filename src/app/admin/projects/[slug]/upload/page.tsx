'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function UploadPhotosPage() {
  const { slug } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<string[]>([]); // list of secure URLs
  const [uploading, setUploading] = useState(false);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const handleUpload = async () => {
    if (!files.length || !slug) return;
    setUploading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = 'photoshare';

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);
      formData.append('folder', `photoshare/${slug}`);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return data.secure_url;
    });

    const results = await Promise.all(uploadPromises);
    setUploaded(results);
    setUploading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl mb-4 font-bold">Upload Photos to: <span className="text-blue-600">{slug}</span></h2>

      <input type="file" multiple onChange={handleSelect} className="mb-4" />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-600 text-white px-4 py-2"
      >
        {uploading ? 'Uploading...' : 'Upload Photos'}
      </button>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {uploaded.map((url, idx) => (
          <img key={idx} src={`${url.replace('/upload/', '/upload/w_300,q_auto,f_auto/')}`} alt="Uploaded" className="rounded shadow" />
        ))}
      </div>
    </div>
  );
}
