'use client';

import { useEffect, useRef, useState } from 'react';
import { evaluateAnswer } from '@/lib/evaluateAnswer';
import { supabase } from '@/lib/supabase';

export default function InterviewRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    // Check if we're in a secure context
    if (!window.isSecureContext) {
      setError('Camera access requires a secure context (HTTPS or localhost)');
      return;
    }

    // Check if mediaDevices is supported
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Your browser does not support camera access');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Webcam error:', err);
        setError('Failed to access camera: ' + err.message);
      });

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        setTranscript((prev) => prev + finalTranscript);
      };

      recognitionRef.current = recognition;
    } else {
      setError("Your browser doesn't support speech recognition.");
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleEvaluate = async () => {
    const result = await evaluateAnswer(transcript);
    setFeedback(result);

    // Optional: get user info from auth
    const {
      data: { user }
    } = await supabase.auth.getUser();

    // Insert into Supabase
    const { error } = await supabase.from('interview_responses').insert({
      user_id: user?.id || 'anonymous',
      transcript,
      feedback: result
    });

    if (error) {
      console.error('Error saving to Supabase:', error.message);
    } else {
      console.log('Interview response saved.');
    }
  };

  return (
    <div className="p-6">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <>
          <div className="w-full h-64 bg-black rounded overflow-hidden mb-4">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={startListening}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={isListening}
            >
              Start Speaking
            </button>
            <button
              onClick={stopListening}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              disabled={!isListening}
            >
              Stop
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Transcript:</label>
            <textarea
              value={transcript}
              readOnly
              className="w-full border border-gray-300 p-3 rounded"
              rows={6}
              placeholder="Transcript will appear here..."
            />
          </div>

          <button
            onClick={handleEvaluate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Evaluate Answer
          </button>

          {feedback && (
            <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
              <h3 className="font-semibold mb-2">AI Feedback:</h3>
              <p>{feedback}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
