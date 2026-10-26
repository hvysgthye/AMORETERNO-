import QRCode from 'qrcode';

/**
 * Generates an SVG string representation of a QR Code with styling and center heart badge.
 */
export function generateQRCodeSVG(text, size = 260, color = '#f43f5e', bg = '#ffffff') {
  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
    const count = qr.modules.size;
    const cellSize = size / count;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges">`;
    svg += `<rect width="${size}" height="${size}" fill="${bg}" rx="16"/>`;

    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.modules.get(r, c)) {
          const x = c * cellSize;
          const y = r * cellSize;
          svg += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="${color}" rx="${(cellSize * 0.25).toFixed(2)}" />`;
        }
      }
    }

    // Heart Emblem in the center
    const center = size / 2;
    const heartBadgeRadius = size * 0.12;
    svg += `<circle cx="${center}" cy="${center}" r="${heartBadgeRadius}" fill="${bg}" stroke="${color}" stroke-width="2"/>`;
    const heartScale = (heartBadgeRadius * 1.2) / 24;
    svg += `<g transform="translate(${center} ${center}) scale(${heartScale}) translate(-12 -12)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="${color}"/></g>`;

    svg += '</svg>';
    return svg;
  } catch (e) {
    console.error('QR Generator Error:', e);
    return null;
  }
}

/**
 * Downloads a high resolution printable PNG card with the QR code.
 */
export function downloadQRCodeCard({ url, title, partnerName = 'Para Ti' }) {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 1050;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0c0f20');
  bgGrad.addColorStop(0.5, '#1b112c');
  bgGrad.addColorStop(1, '#2c0d1e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Border frame
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Romantic Header
  ctx.fillStyle = '#fda4af';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('UNA SORPRESA DIGITAL ESPECIAL', width / 2, 95);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px "Playfair Display", serif';
  ctx.fillText(title || 'Mi Amor Por Ti', width / 2, 150);

  ctx.fillStyle = '#fbcfe8';
  ctx.font = '20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Escanea este código con la cámara de tu celular:', width / 2, 200);

  // Render QR Code onto image
  const svgString = generateQRCodeSVG(url, 460, '#e11d48', '#ffffff');
  if (!svgString) {
    alert('No se pudo generar el código QR.');
    return;
  }
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // White Card Backdrop for QR
    ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(width / 2 - 250, 240, 500, 500, 30);
    } else {
      ctx.rect(width / 2 - 250, 240, 500, 500);
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.drawImage(img, width / 2 - 230, 260, 460, 460);

    // Instructions below QR
    ctx.fillStyle = '#fde68a';
    ctx.font = 'italic 28px "Dancing Script", cursive';
    ctx.fillText('❤️ ' + partnerName + ' ❤️', width / 2, 790);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('1. Abre la cámara de tu celular o WhatsApp', width / 2, 850);
    ctx.fillText('2. Apunta hacia el código para abrir la dedicatoria', width / 2, 880);
    ctx.fillText('3. Toca la pantalla y disfruta la música y sorpresas', width / 2, 910);

    // Footer
    ctx.fillStyle = '#fda4af';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Creado con Dedicapag NextGen • Sin límites ni vencimientos', width / 2, 970);

    // Trigger download
    const link = document.createElement('a');
    link.download = 'tarjeta-regalo-qr-dedicatoria.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    URL.revokeObjectURL(blobUrl);
  };
  img.src = blobUrl;
}
