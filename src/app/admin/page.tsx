import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  adminGetAllRestaurants,
  adminGetSuggestions,
  adminGetChangelog,
} from '@/lib/actions';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const [restaurants, suggestions, changelog] = await Promise.all([
    adminGetAllRestaurants(),
    adminGetSuggestions(),
    adminGetChangelog(),
  ]);

  return (
    <AdminDashboard
      restaurants={restaurants}
      suggestions={suggestions}
      changelog={changelog}
    />
  );
}
