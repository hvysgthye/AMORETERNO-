// Durable, capability-addressed gifts. There is deliberately no list/search API.
const TEMPLATES = new Set('candado puertas-del-corazon carta propose libro-amor chocolate galaxy galaxia-infinita universe galaxy-gallery galaxy-gallery-flores-amarillas flores-moradas flor-amarilla flor-amarilla-dia flor-galaxy arbol lector-huellas latidos-de-luz spotify-amor net memorama memori-corazon laberinto carrera-de-corazones heart-shooter corazon-revienta bubbles hotwheels regalos-cumple el-camino-juntos tres-corazones heart dedicate little-girl halloween cassette-retro star-map polaroid-album mensaje-botella girasoles-sunset boarding-pass scratch-card gameboy-8bit origami-grulla reloj-arena'.split(' '));
const APP_URL = 'https://hvysgthye.github.io/AMORETERNO-/';
const ID = /^[A-Za-z0-9_-]{22}$/;
const SLOT = /^(photo|photo-[0-5]|audio|voice)$/;
const MAX_AUDIO = 25 * 1024 * 1024;
const MAX_IMAGE = 3 * 1024 * 1024;
const DRAFT_MS = 24 * 60 * 60 * 1000;

class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const fail = (status, message) => { throw new HttpError(status, message); };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' } });
const randomKey = bytes => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(bytes)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const digest = async value => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(v => v.toString(16).padStart(2,'0')).join('');
const metaKey = id => `gifts/${id}/metadata.json`;
const mediaKey = (id, slot) => `gifts/${id}/media/${slot}`;

function originAllowed(origin) {
  if (!origin) return true;
  try { const url = new URL(origin); return origin === 'https://hvysgthye.github.io' || ['localhost','127.0.0.1'].includes(url.hostname); } catch { return false; }
}

async function readBytes(request, limit) {
  const declared = Number(request.headers.get('Content-Length') || 0);
  if (declared > limit) fail(413, 'El archivo supera el tamaño permitido.');
  if (!request.body) fail(400, 'No se recibió el archivo.');
  const reader = request.body.getReader(); const chunks=[]; let size=0;
  while (true) {
    const {value,done} = await reader.read(); if (done) break;
    size += value.length;
    if (size > limit) { await reader.cancel(); fail(413, 'El archivo supera el tamaño permitido.'); }
    chunks.push(value);
  }
  const bytes=new Uint8Array(size); let offset=0;
  for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  return bytes;
}

async function readJSON(request) {
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) fail(415,'Se requiere JSON.');
  try { return JSON.parse(new TextDecoder().decode(await readBytes(request, 96 * 1024))); }
  catch(error) { if(error instanceof HttpError) throw error; fail(400,'Los datos no son válidos.'); }
}

function actualType(bytes, image) {
  const ascii = (start,n) => String.fromCharCode(...bytes.slice(start,start+n));
  if(image){
    if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff) return 'image/jpeg';
    if(ascii(1,3)==='PNG'&&bytes[0]===137) return 'image/png';
    if(ascii(0,4)==='GIF8') return 'image/gif';
    if(ascii(0,4)==='RIFF'&&ascii(8,4)==='WEBP') return 'image/webp';
  }else{
    if(bytes[0]===255&&(bytes[1]&246)===240) return 'audio/aac';
    if(ascii(0,3)==='ID3'||(bytes[0]===255&&(bytes[1]&224)===224)) return 'audio/mpeg';
    if(ascii(0,4)==='RIFF'&&ascii(8,4)==='WAVE') return 'audio/wav';
    if(ascii(0,4)==='OggS') return 'audio/ogg';
    if(bytes[0]===26&&bytes[1]===69&&bytes[2]===223&&bytes[3]===163) return 'audio/webm';
    if(ascii(4,4)==='ftyp') return 'audio/mp4';
  }
  fail(415,image?'Usa una imagen JPG, PNG, GIF o WEBP.':'Usa una canción MP3, M4A, WAV, OGG o WEBM.');
}

async function loadMeta(bucket,id) {
  const object=await bucket.get(metaKey(id)); if(!object) fail(404,'No encontramos esta dedicatoria.');
  return object.json();
}

async function authorizeDraft(request, meta) {
  const token=(request.headers.get('Authorization')||'').replace(/^Bearer /,'');
  if(!/^[A-Za-z0-9_-]{43}$/.test(token)||await digest(token)!==meta.tokenHash) fail(403,'No puedes modificar esta dedicatoria.');
  if(meta.published) fail(409,'Esta dedicatoria ya está publicada. Crea una nueva versión.');
  if(Date.now()-meta.createdAt>DRAFT_MS) fail(410,'La subida caducó. Vuelve a guardar el regalo.');
}

async function rateLimit(request,bucket) {
  const ip=request.headers.get('CF-Connecting-IP'); if(!ip) return;
  const key=`limits/${await digest(ip+'|'+Math.floor(Date.now()/3600000))}`;
  for(let retry=0;retry<4;retry++){
    const previous=await bucket.get(key); const count=previous?Number(await previous.text()):0;
    if(count>=10) fail(429,'Has creado varias dedicatorias. Espera un poco antes de intentar otra.');
    const stored=await bucket.put(key,String(count+1),{onlyIf:previous?{etagMatches:previous.etag}:{etagDoesNotMatch:'*'}});
    if(stored) return;
  }
  fail(429,'Espera un momento y vuelve a intentarlo.');
}

function cleanFields(input) {
  if(!input||typeof input!=='object'||Array.isArray(input)) fail(400,'Faltan los datos de la dedicatoria.');
  const output={};
  for(const [key,value] of Object.entries(input)){
    if(!/^[A-Za-z][A-Za-z0-9_]{0,49}$/.test(key)||['__proto__','constructor','prototype','photo','photos','customAudio','customAudioDataUrl','voiceNote'].includes(key)) continue;
    if(typeof value==='string') {if(value.length>12000||/^(data|blob):/i.test(value)) fail(400,'Hay un campo de texto inválido.');output[key]=value;}
    else if(typeof value==='boolean'||(typeof value==='number'&&Number.isFinite(value))) output[key]=value;
    else if(Array.isArray(value)&&value.length<=32&&value.every(v=>typeof v==='number'&&Number.isFinite(v))) output[key]=value;
  }
  return output;
}

async function mediaReference(bucket,id,slot,value,origin) {
  if(!value) return null;
  const expected=`${origin}/api/gifts/${id}/media/${slot}`;
  if(value===expected) {if(!await bucket.head(mediaKey(id,slot))) fail(409,'Falta terminar la subida de un archivo.');return expected;}
  // External URLs were already hosted by the user; no server-side fetching.
  if(typeof value==='string'&&value.length<=4096){try{if(new URL(value).protocol==='https:')return value;}catch{}}
  fail(400,'Uno de los archivos todavía no se ha subido.');
}

async function handle(request,env) {
  const url=new URL(request.url); const bucket=env.BUCKET;
  if(request.method==='OPTIONS') return new Response(null,{status:204});
  if(url.pathname==='/health') return json({ok:!!bucket,service:'Amor Eterno · Recuerdos'});
  if(!bucket) fail(503,'El almacenamiento no está disponible. Inténtalo más tarde.');
  if(request.method==='POST'&&url.pathname==='/api/gifts'){
    if(!originAllowed(request.headers.get('Origin'))) fail(403,'Este origen no está permitido.');
    const {templateId}=await readJSON(request);
    if(!TEMPLATES.has(templateId)) fail(400,'Selecciona una plantilla válida.');
    await rateLimit(request,bucket);
    const id=randomKey(16),token=randomKey(32);
    await bucket.put(metaKey(id),JSON.stringify({templateId,id,tokenHash:await digest(token),createdAt:Date.now(),published:false}));
    return json({id,uploadToken:token},201);
  }
  const match=url.pathname.match(/^\/api\/gifts\/([A-Za-z0-9_-]+)(?:\/(publish|media)(?:\/([A-Za-z0-9-]+))?)?$/);
  if(!match||!ID.test(match[1])) fail(404,'No encontramos esta dedicatoria.');
  const [,id,action,slot]=match;
  const meta=await loadMeta(bucket,id);
  if(!action&&request.method==='GET'){
    if(!meta.published) fail(404,'Esta dedicatoria todavía no está lista.');
    return json({id,templateId:meta.templateId,data:meta.data});
  }
  if(action==='media'&&SLOT.test(slot||'')){
    if(request.method==='PUT'){
      if(!originAllowed(request.headers.get('Origin'))) fail(403,'Este origen no está permitido.');
      await authorizeDraft(request,meta);
      const image=slot.startsWith('photo');
      const bytes=await readBytes(request,image?MAX_IMAGE:MAX_AUDIO);
      const contentType=actualType(bytes,image);
      const existing=await bucket.head(mediaKey(id,slot));
      if(existing) fail(409,'El archivo ya se subió.');
      await bucket.put(mediaKey(id,slot),bytes,{httpMetadata:{contentType},onlyIf:{etagDoesNotMatch:'*'}});
      return json({url:`${url.origin}/api/gifts/${id}/media/${slot}`},201);
    }
    if(request.method==='GET'||request.method==='HEAD'){
      if(!meta.published) fail(404,'Esta dedicatoria todavía no está lista.');
      const object=await bucket.get(mediaKey(id,slot),{range:request.headers});
      if(!object) fail(404,'No encontramos este archivo.');
      const headers=new Headers({'Cache-Control':'public, max-age=31536000, immutable','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff'});
      object.writeHttpMetadata(headers); headers.set('ETag',object.httpEtag);
      let status=200;
      if(object.range&&object.range.length!==undefined){status=206;headers.set('Content-Range',`bytes ${object.range.offset}-${object.range.offset+object.range.length-1}/${object.size}`);headers.set('Content-Length',String(object.range.length));}
      else headers.set('Content-Length',String(object.size));
      return new Response(request.method==='HEAD'?null:object.body,{status,headers});
    }
  }
  if(action==='publish'&&request.method==='POST'){
    if(!originAllowed(request.headers.get('Origin'))) fail(403,'Este origen no está permitido.');
    await authorizeDraft(request,meta);
    const {data}=await readJSON(request); const cleaned=cleanFields(data);
    cleaned.photo=await mediaReference(bucket,id,'photo',data.photo,url.origin);
    if(data.photos!==undefined&&!Array.isArray(data.photos)) fail(400,'La galería no es válida.');
    if((data.photos||[]).length>6) fail(400,'Puedes guardar hasta seis fotos en la galería.');
    cleaned.photos=await Promise.all((data.photos||[]).map((value,i)=>mediaReference(bucket,id,`photo-${i}`,value,url.origin)));
    cleaned.customAudio=await mediaReference(bucket,id,'audio',data.customAudio,url.origin);
    cleaned.voiceNote=await mediaReference(bucket,id,'voice',data.voiceNote,url.origin);
    meta.data=cleaned;meta.published=true;meta.publishedAt=Date.now();
    await bucket.put(metaKey(id),JSON.stringify(meta));
    return json({id,templateId:meta.templateId,url:`${APP_URL}?g=${id}`});
  }
  fail(405,'Esta operación no está permitida.');
}

export default {
  async fetch(request,env) {
    let response;
    try {response=await handle(request,env);}catch(error){response=json({error:error instanceof HttpError?error.message:'No se pudo guardar el regalo. Inténtalo de nuevo.'},error instanceof HttpError?error.status:500);}
    const headers=new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin','*');
    headers.set('Access-Control-Allow-Methods','GET, HEAD, POST, PUT, OPTIONS');
    headers.set('Access-Control-Allow-Headers','Content-Type, Authorization, Range');
    headers.set('Access-Control-Expose-Headers','Content-Length, Content-Range, Accept-Ranges');
    headers.set('Referrer-Policy','no-referrer');
    headers.set('X-Content-Type-Options','nosniff');
    return new Response(response.body,{status:response.status,headers});
  }
};
