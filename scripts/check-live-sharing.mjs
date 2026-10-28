// Explicit manual integration check. Uses only the bundled synthetic fixtures.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {publishGift,fetchGift,GIFT_API_URL} from '../src/utils/cloudGifts.js';
const photo=await readFile(new URL('../tests/fixtures/sharing-test.png',import.meta.url));
const audio=await readFile(new URL('../tests/fixtures/sharing-test.wav',import.meta.url));
const published=await publishGift('arbol',{
  title:'Prueba de guardado · Árbol',letterText:'Prueba técnica con imagen y audio sintéticos. No contiene datos personales.',
  photo:'data:image/png;base64,'+photo.toString('base64'),
  customAudio:'data:audio/wav;base64,'+audio.toString('base64'),customAudioName:'sharing-test.wav',hidePhoto:false
},{apiURL:GIFT_API_URL,location:{origin:'https://hvysgthye.github.io',pathname:'/AMORETERNO-/'}});
const received=await fetchGift(published.id);
assert.equal(received.templateId,'arbol');
assert.deepEqual(Buffer.from(await (await fetch(received.data.photo)).arrayBuffer()),photo);
assert.deepEqual(Buffer.from(await (await fetch(received.data.customAudio)).arrayBuffer()),audio);
const partial=await fetch(received.data.customAudio,{headers:{Range:'bytes=0-3'}});
assert.equal(partial.status,206);assert.equal(await partial.text(),'RIFF');
assert.ok(published.url.length<100);
await mkdir(new URL('../evidence/',import.meta.url),{recursive:true});
await writeFile(new URL('../evidence/sharing-live-result.json',import.meta.url),JSON.stringify({id:published.id,url:published.url,templateId:received.templateId,photoBytes:photo.length,audioBytes:audio.length,rangeStatus:partial.status,checkedAt:new Date().toISOString()},null,2));
console.log('PASS: production storage, exact photo/audio bytes, audio range and arbol template.');
console.log(published.url);
