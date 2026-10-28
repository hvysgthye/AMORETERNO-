// Share and Serialization Helper for Dedicapag NextGen
// Compresses dedication data into shareable permanent URLs and manages saved creations.

const STORAGE_KEY = 'dedicapag_saved_creations';

/**
 * Encodes dedication data into a clean, safe URL query string.
 */
export function encodeDedicationToURL(templateId, data) {
  try {
    // Version 2 stores editable fields once. Legacy aliases are only needed
    // when decoding older links; duplicating them makes long letters exceed QR capacity.
    const compactPayload = { t: templateId };

    // If photo is an external URL, include it in URL. If it's a small data URL (<2KB), also include.
    if (data.photo && (data.photo.startsWith('http') || data.photo.length < 2048)) {
      compactPayload.ph = data.photo;
    }

    // Keep every editable text/visibility field, including intentionally empty values.
    compactPayload.v = 2;
    compactPayload.fields = Object.fromEntries(Object.entries(data || {}).filter(([key, value]) =>
      !['photo', 'photos', 'customAudio', 'customAudioDataUrl', 'voiceNote'].includes(key) &&
      (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' ||
       (Array.isArray(value) && value.every(item => typeof item === 'number')))
    ));
    compactPayload.photos = (data.photos || []).filter(photo => typeof photo === 'string' && /^https?:\/\//.test(photo));
    if (typeof data.customAudio === 'string' && /^https?:\/\//.test(data.customAudio)) compactPayload.audio = data.customAudio;
    const json = JSON.stringify(compactPayload);
    const base64 = btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?mode=view&d=${base64}`;
  } catch (e) {
    console.error('Error encoding dedication to URL:', e);
    throw new Error('No se pudo generar el enlace. Vuelve a guardar la dedicatoria.');
  }
}

/**
 * Decodes dedication data from the URL query parameters.
 */
export function decodeDedicationFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode'); // 'view' for recipient presentation mode
    const encoded = params.get('d');
    const templateParam = params.get('t');
    const giftId = params.get('g');
    if(giftId) return {giftId,isRecipientMode:true,templateId:null,data:null};

    if (encoded) {
      let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const json = decodeURIComponent(escape(atob(base64)));
      const p = JSON.parse(json);

      return {
        isRecipientMode: mode === 'view',
        templateId: p.t || 'candado',
        data: {
          title: p.ti || '',
          lockTitle: p.lt || '',
          unlockMsg: p.um || '',
          letterTitle: p.le || '',
          letterBody: p.lb || '',
          combo: p.c || [14, 2, 24],
          starName: p.st || '',
          musicTitle: p.m || '',
          photo: p.ph || null,
          ...(p.v === 2 && p.fields && typeof p.fields === 'object' && !Array.isArray(p.fields) ? p.fields : {}),
          ...(p.v === 2 ? { photos: Array.isArray(p.photos) ? p.photos : [], customAudio: p.audio || null } : {})
        }
      };
    }

    if (templateParam) {
      return {
        isRecipientMode: mode === 'view',
        templateId: templateParam,
        data: null
      };
    }

    if(mode === 'view') return {isRecipientMode:false,templateId:null,data:null,error:'Este enlace está incompleto. Pide a quien lo creó que vuelva a guardar y compartir el regalo.'};
    return {
      isRecipientMode: mode === 'view',
      templateId: null,
      data: null
    };
  } catch (e) {
    console.error('Error decoding dedication from URL:', e);
    return { isRecipientMode: false, templateId: null, data: null, error: 'Este enlace está incompleto o dañado. Pide a quien lo creó que lo vuelva a compartir.' };
  }
}

/**
 * Generates direct WhatsApp share URL with romantic text.
 */
export function getWhatsAppShareURL(shareUrl, title = 'Mi Amor Por Ti') {
  const text = `❤️ *${title}*\n\nTe preparé una sorpresa especial hecha con todo mi corazón... Toca el enlace para abrirla:\n\n👉 ${shareUrl}\n\n(Sube el volumen para escuchar la música 🎵)`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

/**
 * Generates direct Telegram share URL.
 */
export function getTelegramShareURL(shareUrl, title = 'Una dedicatoria especial') {
  return `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('❤️ ' + title + ' — Una dedicatoria inolvidable para ti')}`;
}

/**
 * Saves a creation to local history.
 */
export function saveCreationLocally(templateId, data, metadata = {}) {
  try {
    const list = getSavedCreations();
    const newEntry = {
      id: 'd_' + crypto.randomUUID(),
      templateId,
      ...(metadata.shareId ? {shareId:metadata.shareId} : {}),
      title: data.title || 'Dedicatoria sin título',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      data
    };
    // Reopening Share for the same content must not create duplicates, but a
    // shared title never identifies a creation. Preserve different versions.
    const duplicate = list.find(item => item.templateId === templateId && JSON.stringify(item.data) === JSON.stringify(data));
    if (duplicate) return duplicate;
    const updated = [newEntry, ...list].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  } catch (e) {
    console.error('Error saving creation locally:', e);
    return null;
  }
}

/**
 * Gets the list of saved creations from local storage.
 */
export function getSavedCreations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(item => item && typeof item.id === 'string' && item.data && typeof item.data === 'object') : [];
  } catch (e) {
    return [];
  }
}

/**
 * Removes a creation from local history.
 */
export function removeCreationLocally(id) {
  try {
    const list = getSavedCreations();
    const updated = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Error removing creation locally:', e);
    return false;
  }
}

