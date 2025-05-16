'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MyReport() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('interview_responses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error) setReports(data);
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your AI Interview Reports</h2>
      {reports.map((r) => (
        <div key={r.id} className="border p-4 rounded mb-4 bg-white">
          <p><strong>Transcript:</strong> {r.transcript}</p>
          <p className="mt-2"><strong>AI Feedback:</strong> {r.feedback}</p>
          <p className="text-sm text-gray-500 mt-1">Date: {new Date(r.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
