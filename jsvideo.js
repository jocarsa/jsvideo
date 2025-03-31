<script>
(function() {
  // Wait for DOM content to load, so we can reliably find the canvas
  document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.warn('No <canvas> element found on this page. Recording aborted.');
      return;
    }

    // Check if browser supports canvas capture
    if (typeof canvas.captureStream !== 'function') {
      console.error('Canvas captureStream() is not supported in this browser.');
      return;
    }

    // Desired capture frame rate (adjust as needed)
    const fps = 30;
    // Time in milliseconds for how long to record (1 minute)
    const recordDuration = 60 * 1000;

    // Capture the stream from the canvas
    const stream = canvas.captureStream(fps);

    // Configure the MediaRecorder with video/webm
    const options = { mimeType: 'video/webm; codecs=vp9' };
    let mediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      console.error('MediaRecorder error:', e);
      return;
    }

    let chunks = [];

    // Gather data when available
    mediaRecorder.ondataavailable = function(event) {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    // When recording stops, create a Blob and download it
    mediaRecorder.onstop = function() {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recorded_canvas.webm';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      chunks = [];
    };

    // Start recording
    mediaRecorder.start();
    console.log('Canvas recording started for 1 minute.');

    // Automatically stop after the specified duration
    setTimeout(function() {
      mediaRecorder.stop();
      console.log('Canvas recording stopped. Downloading video...');
    }, recordDuration);
  });
})();
</script>

