'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white px-4 py-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-semibold">
          📸 PhotoShare Studio
        </Link>

        <div className="space-x-4">
          <Link href="/admin/projects/new" className={pathname === '/admin/projects/new' ? 'underline' : ''}>
            Create Project
          </Link>
          <Link href="/admin/login" className={pathname === '/admin/login' ? 'underline' : ''}>
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
