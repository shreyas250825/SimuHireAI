'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InterviewRecorder from '@/components/InterviewRecorder';

export default function InterviewPage() {
  const router = useRouter();
  const [intent, setIntent] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState('');
  const [aboutDone, setAboutDone] = useState(false);

  useEffect(() => {
    const userIntent = localStorage.getItem('user_intent');
    if (!userIntent) {
      router.push('/intent');
    } else {
      setIntent(userIntent);
      generateQuestions(userIntent);
    }
  }, []);

  const generateQuestions = async (intent: string) => {
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent })
      });

      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-4 gap-4 p-4 bg-gray-100">
      {/* Left Panel */}
      <div className="col-span-1 bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">🧠 Questions</h2>
        {loading ? (
          <p>Loading questions...</p>
        ) : !aboutDone ? (
          <p className="italic text-gray-500">Please complete the 'Tell me about yourself' section first.</p>
        ) : (
          <ul className="space-y-2">
            {questions.map((q, i) => (
              <li key={i} className="text-gray-800">{i + 1}. {q}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Center Panel */}
      <div className="col-span-2 bg-white shadow rounded-lg p-4">
        {!aboutDone ? (
          <>
            <h2 className="text-lg font-bold mb-3">👤 Tell me about yourself</h2>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-3"
              rows={5}
              placeholder="Briefly introduce yourself..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
            <div className="flex space-x-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={!about.trim()}
                onClick={() => setAboutDone(true)}
              >
                Submit
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setAbout('');
                  setAboutDone(true); // Skip
                }}
              >
                Skip
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-3">🎤 Your Response</h2>
            {/* Webcam & transcript placeholder */}
            <InterviewRecorder />

            <textarea
              className="w-full border border-gray-300 rounded-lg p-3"
              rows={6}
              placeholder="Your response will appear here (or type it)..."
              // TODO: Connect with actual mic input or text input
            />
          </>
        )}
      </div>

      {/* Right Panel */}
      <div className="col-span-1 bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">📊 Feedback</h2>
        <p className="text-sm text-gray-600">Live metrics coming soon...</p>
        <ul className="mt-4 space-y-2">
          <li>✅ Confidence Score: 85%</li>
          <li>💬 Filler Words: 3</li>
          <li>🎯 Tone: Professional</li>
        </ul>
      </div>
    </div>
  );
}
