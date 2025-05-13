'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from "react-hook-form"

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const allFields = watch();
  const areAllFieldsEmpty = Object.values(allFields).every((value) => !value);

  useEffect(() => {
    console.log('Session:', session);
    if (status !== 'loading') {
      setIsLoading(false);
      if (!session) {
        redirect('/login');
      }
    }
  }, [status, session]);

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    alert('Form submitted!');
  };

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

        <h2 className="text-xl font-semibold text-center mb-2">
          Go High Level Form
        </h2>
         <p className="font-bold text-center">
          React Hook Form
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            {...register('firstName')}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            {...register('lastName')}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="w-full px-4 py-2 border rounded"
          />
          <select
            {...register('gender')}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="tel"
            placeholder="Phone Number"
            {...register('phone')}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Address"
            {...register('address')}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={areAllFieldsEmpty || isSubmitting}
            className={`w-full px-4 py-2 text-white rounded transition ${
              areAllFieldsEmpty || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 cursor-pointer'
            }`}
          >
            Submit
          </button>
        </form>

        <div className="text-center mt-4">
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
