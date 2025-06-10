'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function UploadPhotosPage() {
  const { slug } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(''); // ✅ moved inside the component

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const handleUpload = async () => {
    if (!files.length || !slug) return;
    setUploading(true);
    setError('');
    setUploaded([]);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = 'photoshare';
console.log(`Uploading to: https://api.cloudinary.com/v1_1/damb7e1po/upload`);
    const uploadPromises = files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', preset);
        formData.append('folder', `photoshare/${slug}`);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (data.secure_url) {
          return { fileName: file.name, url: data.secure_url };
        } else {
          throw new Error(data.error?.message || 'Upload failed');
        }
      } catch (err: any) {
        return { fileName: file.name, error: err.message || 'Unknown error' };
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

      {/* ✅ Upload status messages */}
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

      {/* ✅ Thumbnails */}
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
    </div>
  );
}
