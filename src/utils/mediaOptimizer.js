// Media Optimizer for Dedicapag NextGen
// Compresses photos via client-side canvas so base64 exports stay lightweight (<200KB vs 10MB)
// Validates and handles audio files safely.

export async function compressImageFile(file, maxDimension = 1200, quality = 0.82) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('El archivo seleccionado no es una imagen válida.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo decodificar la imagen.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with optimal compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl: compressedBase64,
          originalSize: file.size,
          compressedSize: Math.round((compressedBase64.length * 3) / 4),
          width,
          height
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function validateAudioFile(file, maxMB = 20) {
  if (!file) return { valid: false, error: 'No se seleccionó archivo.' };
  
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a', 'audio/mp4', 'audio/aac', 'audio/webm'];
  const isAudioType = validTypes.includes(file.type) || /\.(mp3|wav|ogg|m4a|aac|webm)$/i.test(file.name);
  
  if (!isAudioType) {
    return { valid: false, error: 'Formato no soportado. Por favor sube un archivo MP3, WAV o M4A.' };
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxMB) {
    return { valid: false, error: `El archivo pesa ${sizeMB.toFixed(1)}MB. Te recomendamos una canción menor a ${maxMB}MB para que tu dedicatoria cargue rápido.` };
  }

  return { valid: true, sizeFormatted: sizeMB.toFixed(2) + ' MB' };
}
