'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
      if (!session) {
        redirect('/login');
      }
    }
  }, [status, session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">
            Welcome, {session?.user?.name || 'User'}!
          </h2>

          {session?.user?.email && (
            <p className="text-gray-600">Signed in as {session.user.email}</p>
          )}

          {session?.user?.image && (
            <div className="mt-4 flex justify-center">
              <Image
                src={session.user.image}
                alt="Profile picture"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-gray-700 mb-4">
            DASHBOARD
          </p>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
