// Pure Web MediaRecorder Utility for Voice Notes
// Allows users to record a personal love voice note (up to 60s) directly in the browser
// Zero backend or paid servers required!

export class VoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
  }

  async start() {
    this.audioChunks = [];
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('La grabación de audio no está soportada en este navegador.');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Choose optimal audio mime type
    const mimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
    let chosenMime = '';
    for (const m of mimeTypes) {
      if (MediaRecorder.isTypeSupported(m)) {
        chosenMime = m;
        break;
      }
    }

    this.mediaRecorder = new MediaRecorder(this.stream, chosenMime ? { mimeType: chosenMime } : undefined);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(250);
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('No hay grabación activa.'));
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType || 'audio/webm' });
        
        // Stop all audio tracks to turn off microphone light
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            audioDataUrl: reader.result,
            mimeType: audioBlob.type,
            sizeBytes: audioBlob.size
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  cancel() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    this.audioChunks = [];
  }
}
