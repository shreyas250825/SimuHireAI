export async function evaluateAnswer(transcript: string) {
    try {
      console.log('Sending evaluation request with transcript:', transcript.substring(0, 100) + '...');
      
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
    
      // Log the response status and headers
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
      // Try to parse the response as JSON
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response from server');
      }
    
      if (!response.ok) {
        console.error('Server error:', data);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
    
      if (!data.feedback) {
        console.error('No feedback in response:', data);
        throw new Error('No feedback received from server');
      }
    
      return data.feedback;
    } catch (error: any) {
      console.error('Evaluation error details:', {
        message: error.message,
        stack: error.stack
      });
      throw new Error(error.message || 'Failed to get evaluation');
    }
  }
  