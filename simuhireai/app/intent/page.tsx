'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IntentPage() {
  const router = useRouter();
  const [intent, setIntent] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!intent.trim()) {
      setError('Please describe your intent.');
      return;
    }

    localStorage.setItem('user_intent', intent); // Save to local storage
    router.push('/interview');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold mb-4">🎯 What do you want today?</h1>
      <p className="mb-6 text-gray-600">
        Example: <i>“Interview me for Junior Software Developer”</i>
      </p>
      <textarea
        className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        placeholder="Your intent here..."
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleContinue}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
}
