// The user explicitly approved this storage destination and link-based access.
const configuredOrigin = import.meta.env?.VITE_GIFT_API_URL;
export const GIFT_API_URL = (configuredOrigin === undefined ? 'https://amor-eterno-recuerdos.airylarch2048.chatgpt.site' : configuredOrigin).replace(/\/$/,'');
const ID = /^[A-Za-z0-9_-]{22}$/;

export function giftURL(id, location = window.location) {
  if(!ID.test(id)) throw new Error('El identificador del regalo no es válido.');
  return `${location.origin}${location.pathname}?g=${id}`;
}

function requireDestination(apiURL) {
  if(!apiURL) throw new Error('El guardado en línea todavía no está conectado. No se han subido tus archivos.');
}

async function responseJSON(response) {
  let body;
  try {body=await response.json();} catch {throw new Error('No se pudo conectar con el guardado en línea. Inténtalo de nuevo.');}
  if(!response.ok) throw new Error(body.error || 'No se pudo guardar el regalo.');
  return body;
}

function dataBlob(value) {
  const match=value.match(/^data:([^;,]+)(?:;codecs=[^;,]+)?;base64,([A-Za-z0-9+/=\s]+)$/);
  if(!match) throw new Error('Uno de los archivos no se puede leer. Vuelve a seleccionarlo.');
  const binary=atob(match[2]); const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  return new Blob([bytes],{type:match[1]});
}

export async function publishGift(templateId, data, {signal,onProgress=()=>{},fetchImpl=fetch,apiURL=GIFT_API_URL,location=window.location} = {}) {
  requireDestination(apiURL);
  if(!templateId||!data) throw new Error('Selecciona y personaliza una plantilla antes de compartir.');
  onProgress('Preparando el guardado…');
  const created=await responseJSON(await fetchImpl(`${apiURL}/api/gifts`,{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({templateId}),signal
  }));
  if(!ID.test(created.id)||!created.uploadToken) throw new Error('El servidor no pudo preparar el regalo.');
  const headers={Authorization:`Bearer ${created.uploadToken}`};
  const mediaFields=['photo','photos','customAudio','customAudioDataUrl','voiceNote'];
  const hosted=Object.fromEntries(Object.entries(data).filter(([key])=>!mediaFields.includes(key)));
  const upload=async(value,slot,label)=>{
    if(!value) return null;
    if(typeof value!=='string') throw new Error(`No se pudo leer ${label}.`);
    if(/^https:\/\//.test(value)) return value;
    if(!value.startsWith('data:')) throw new Error(`Vuelve a seleccionar ${label}; el archivo ya no está disponible.`);
    const blob=dataBlob(value); const limit=slot.startsWith('photo')?3*1024*1024:25*1024*1024;
    if(blob.size>limit) throw new Error(`${label} supera ${slot.startsWith('photo')?'3':'25'} MB.`);
    onProgress(`Subiendo ${label}…`);
    const result=await responseJSON(await fetchImpl(`${apiURL}/api/gifts/${created.id}/media/${slot}`,{
      method:'PUT',headers:{...headers,'Content-Type':blob.type},body:blob,signal
    }));
    return result.url;
  };
  hosted.photo=await upload(data.photo,'photo','la foto principal');
  hosted.photos=[];
  for(const [i,photo] of (data.photos||[]).entries()) hosted.photos.push(await upload(photo,`photo-${i}`,`la foto ${i+1} de la galería`));
  hosted.customAudio=await upload(data.customAudio || data.customAudioDataUrl,'audio','tu canción');
  hosted.voiceNote=await upload(data.voiceNote,'voice','tu nota de voz');
  onProgress('Confirmando que el regalo quedó guardado…');
  const result=await responseJSON(await fetchImpl(`${apiURL}/api/gifts/${created.id}/publish`,{
    method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({data:hosted}),signal
  }));
  if(result.templateId!==templateId||result.id!==created.id) throw new Error('No se pudo verificar la plantilla guardada. Inténtalo de nuevo.');
  return {id:result.id,url:giftURL(result.id,location),data:hosted,templateId};
}

export async function fetchGift(id,{signal,fetchImpl=fetch,apiURL=GIFT_API_URL}={}) {
  requireDestination(apiURL);
  if(!ID.test(id)) throw new Error('El enlace del regalo no es válido.');
  const gift=await responseJSON(await fetchImpl(`${apiURL}/api/gifts/${id}`,{signal}));
  if(gift.id!==id||typeof gift.templateId!=='string'||!gift.data||typeof gift.data!=='object') throw new Error('No se pudo leer la dedicatoria guardada.');
  return gift;
}
