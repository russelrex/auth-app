'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../utils/config';

export default function LoginPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSignInEmailPassword, setIsSignInEmailPassword] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  const handleRegister = async () => {
    setRegisterError('');
    setRegisterSuccess('');
    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }

      setRegisterSuccess('Registration successful! You can now sign in.');
      setIsRegister(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setRegisterError('Registration failed');
    }
  };

  const handleCredentialsLogin = async () => {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/dashboard',
    });

    if (res?.ok) router.push(res.url || '/dashboard');
    else alert('Login failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Login</h1>
        <p className="text-gray-600 text-center mb-6">
          Sign in to continue to your dashboard
        </p>

        {!isSignInEmailPassword  && !isRegister && (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              <Image
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
                width={20}
                height={20}
              />
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={() => setIsSignInEmailPassword(true)}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Sign in with Email and Password
            </button>

            <button
                onClick={() => setIsRegister(true)}
                className="cursor-pointer w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            >
              Register
            </button>
          </div>
        )}

         {isSignInEmailPassword && !isRegister && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <button
              onClick={handleCredentialsLogin}
              className="cursor-pointer w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Sign in
            </button>

            <button
              onClick={() => setIsSignInEmailPassword(false)}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              Back to Google sign in
            </button>
          </div>
        )}

        {isRegister && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-2 border rounded"
              value={registerData.firstName}
              onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-2 border rounded"
              value={registerData.lastName}
              onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />

            {registerError && <p className="text-red-500 text-sm">{registerError}</p>}
            {registerSuccess && <p className="text-green-600 text-sm">{registerSuccess}</p>}

            <button
              onClick={handleRegister}
              className="cursor-pointer w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Register
            </button>

            <button
              onClick={() => setIsRegister(false)}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              Back to Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
