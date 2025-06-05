import AuthGuard from '@/components/AuthGuard';

export default function AdminProjectsPage() {
  return (
    <AuthGuard>
      <div className="p-4">
        <h2 className="text-xl">Admin Dashboard</h2>
        {/* Content goes here */}
      </div>
    </AuthGuard>
  );
}
