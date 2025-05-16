'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SetupPage() {
  const router = useRouter();
  const [linkedIn, setLinkedIn] = useState('');
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      linkedIn,
      domain,
      level,
    });

    if (error) {
      console.error(error);
    } else {
      router.push('/precheck');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">Setup Your Interview Preferences</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="LinkedIn Profile URL"
          value={linkedIn}
          onChange={(e) => setLinkedIn(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Domain</option>
          <option value="frontend">Frontend Development</option>
          <option value="backend">Backend Development</option>
          <option value="ai_ml">AI/ML</option>
          <option value="data">Data Science</option>
          <option value="embedded">Embedded Systems</option>
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Experience Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
