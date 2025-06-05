// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">📸 Welcome to PhotoShare Studio</h1>
      <p className="mb-4">Use the Admin Login to manage your projects</p>
      <a href="/admin/login" className="text-blue-600 underline">
        Go to Admin Login
      </a>
    </div>
  );
}
