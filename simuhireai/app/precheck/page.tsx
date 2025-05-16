'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PrecheckPage() {
  const router = useRouter();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setPermissionGranted(true);
        stream.getTracks().forEach(track => track.stop()); // stop stream after check
        setTimeout(() => router.push('/intent'), 1500); // proceed after short delay
      } catch (err) {
        setError('Please allow camera and microphone access to proceed.');
      }
    };

    checkPermissions();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">Checking Permissions...</h2>
      {permissionGranted ? (
        <p className="text-green-600 font-medium">All permissions granted. Redirecting...</p>
      ) : error ? (
        <p className="text-red-600 font-medium">{error}</p>
      ) : (
        <p className="text-gray-500">Requesting camera and mic access...</p>
      )}
    </div>
  );
}
