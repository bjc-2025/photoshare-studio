'use client';
import { useEffect, useState } from 'react';
import { listProjectImages } from '@/lib/cloudinary';

interface ProjectGalleryProps {
  slug: string;
  refreshTrigger: number; // Used to force refresh when upload is done
}

export default function ProjectGallery({ slug, refreshTrigger }: ProjectGalleryProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      console.log('📡 Fetching images for:', slug);
      const result = await listProjectImages(slug);
      console.log('📷 Received:', result);
      setImages(result);
      setLoading(false);
    };

    fetchImages();
  }, [slug, refreshTrigger]);

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Current Project Images</h3>
      {loading ? (
        <p>Loading images...</p>
      ) : images.length === 0 ? (
        <p>No images found for this project.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img.secure_url.replace('/upload/', '/upload/w_300,q_auto,f_auto/')}
              alt={`Uploaded image ${idx + 1}`}
              className="rounded shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
}
