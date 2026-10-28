import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker from '../backend/sharing-worker.js';
import { publishGift, fetchGift, giftURL } from '../src/utils/cloudGifts.js';
import { TEMPLATES } from '../src/data/templates.js';
import { decodeDedicationFromURL, encodeDedicationToURL } from '../src/utils/shareHelper.js';
import jsQR from 'jsqr';
import {generateQRCodeSVG} from '../src/utils/qrCodeGenerator.js';

// Local synthetic storage only. No test sends files to an external service.
import { MemoryBucket } from './helpers/memory-bucket.mjs';

const apiURL='https://storage.test';
const location={origin:'https://gift.test',pathname:'/'};
globalThis.window={location:{...location,search:''}};
function localAPI(bucket=new MemoryBucket()){
  const calls=[];
  const fetchImpl=async(url,options={})=>{calls.push({url,method:options.method||'GET'});return worker.fetch(new Request(url,options),{BUCKET:bucket});};
  return {bucket,calls,fetchImpl,apiURL,location};
}
const image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';
const song='data:audio/wav;base64,'+Buffer.from('RIFF0000WAVEfmt synthetic-test-audio').toString('base64');

test('uploaded images, song and voice persist and a separate recipient gets the chosen template',async()=>{
  const first=localAPI();
  const data={title:'Para ti',photo:image,photos:[image],customAudioDataUrl:song,voiceNote:song,letterText:'Una carta completa'};
  const saved=await publishGift('carta',data,first);
  assert.ok(saved.url.length<90);
  assert.ok(!saved.url.includes('data:'));
  assert.equal(new URL(saved.url).searchParams.get('g'),saved.id);
  const second=localAPI(first.bucket); // No editor state or browser storage.
  const opened=await fetchGift(saved.id,second);
  assert.equal(opened.templateId,'carta');assert.equal(opened.data.letterText,data.letterText);
  for(const url of [opened.data.photo,...opened.data.photos,opened.data.customAudio,opened.data.voiceNote]){
    const result=await second.fetchImpl(url);assert.equal(result.status,200);assert.ok((await result.arrayBuffer()).byteLength>0);
  }
  const partial=await second.fetchImpl(opened.data.customAudio,{headers:{Range:'bytes=0-3'}});
  assert.equal(partial.status,206);assert.equal(partial.headers.get('Content-Range').split('/')[0],'bytes 0-3');
  assert.equal(await partial.text(),'RIFF');
  assert.equal(opened.data.customAudioDataUrl,undefined);
});

test('all 45 selections survive cloud publication and independent loading',async()=>{
  const api=localAPI();
  for(const template of TEMPLATES){
    const saved=await publishGift(template.id,{title:template.name,letterText:'Texto personal'},api);
    const opened=await fetchGift(saved.id,api);
    assert.equal(opened.templateId,template.id);
    assert.equal(opened.data.title,template.name);
  }
});

test('an interrupted upload never produces a share link',async()=>{
  const api=localAPI();const realFetch=api.fetchImpl;
  api.fetchImpl=async(url,options)=>url.endsWith('/media/audio')?Response.json({error:'Subida interrumpida'},{status:503}):realFetch(url,options);
  await assert.rejects(publishGift('arbol',{title:'Recuerdo',customAudio:song},api),/Subida interrumpida/);
  assert.equal(api.calls.filter(call=>call.url.endsWith('/publish')).length,0);
});

test('unconfigured destination sends no requests or files',async()=>{
  let calls=0;
  await assert.rejects(publishGift('carta',{photo:image},{apiURL:'',location,fetchImpl:async()=>{calls++;}}),/todavía no está conectado/);
  assert.equal(calls,0);
});

test('drafts are unreadable, tokens cannot modify other gifts and published gifts are immutable',async()=>{
  const api=localAPI();
  const create=async()=> (await api.fetchImpl(apiURL+'/api/gifts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({templateId:'arbol'})})).json();
  const a=await create(),b=await create();
  assert.equal((await api.fetchImpl(`${apiURL}/api/gifts/${a.id}`)).status,404);
  const upload=`${apiURL}/api/gifts/${a.id}/media/photo`;
  assert.equal((await api.fetchImpl(upload,{method:'PUT',headers:{Authorization:`Bearer ${b.uploadToken}`},body:Buffer.from('image')})).status,403);
  assert.equal((await api.fetchImpl(upload,{method:'PUT',headers:{Authorization:`Bearer ${a.uploadToken}`},body:'<svg onload=alert(1)>'})).status,415);
  const publish=`${apiURL}/api/gifts/${a.id}/publish`;
  const options={method:'POST',headers:{Authorization:`Bearer ${a.uploadToken}`,'Content-Type':'application/json'},body:JSON.stringify({data:{title:'Mi árbol'}})};
  assert.equal((await api.fetchImpl(publish,options)).status,200);
  assert.equal((await api.fetchImpl(publish,options)).status,409);
  assert.equal((await api.fetchImpl(apiURL+'/api/gifts')).status,404);
  assert.equal((await api.fetchImpl(apiURL+'/gifts')).status,404);
});

test('invalid templates are rejected; broken links show an error instead of a lock',async()=>{
  const api=localAPI();
  const result=await api.fetchImpl(apiURL+'/api/gifts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({templateId:'invalid'})});
  assert.equal(result.status,400);
  window.location.search='?mode=view';assert.ok(decodeDedicationFromURL().error);
  const id='AbCdEfGhIjKlMnOpQrStUv';
  window.location.search=new URL(giftURL(id,location)).search;
  assert.equal(decodeDedicationFromURL().giftId,id);
  assert.throws(()=>giftURL('invalid',location));
  const url=encodeDedicationToURL('arbol',{title:'Árbol',customAudioDataUrl:'data:audio/wav;base64,'+'A'.repeat(100000)});
  assert.ok(url.length<500);
});

test('an independent QR reader recovers exactly the same short gift URL',()=>{
  const url=giftURL('AbCdEfGhIjKlMnOpQrStUv',{origin:'https://hvysgthye.github.io',pathname:'/AMORETERNO-/'});
  const size=520,svg=generateQRCodeSVG(url,size,'#111827','#ffffff');
  const pixels=new Uint8ClampedArray(size*size*4).fill(255);
  // Rasterize the actual SVG rectangles; jsQR does the independent decoding.
  for(const match of svg.matchAll(/<rect\s+([^>]+)>/g)){
    const attributes=Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]+)"/g)].map(pair=>[pair[1],pair[2]]));
    if(attributes.x===undefined||attributes.fill!=='#111827')continue;
    const x0=Math.round(Number(attributes.x)),y0=Math.round(Number(attributes.y));
    const x1=Math.round(Number(attributes.x)+Number(attributes.width)),y1=Math.round(Number(attributes.y)+Number(attributes.height));
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const offset=(y*size+x)*4;pixels[offset]=17;pixels[offset+1]=24;pixels[offset+2]=39;}
  }
  assert.equal(jsQR(pixels,size,size)?.data,url);
});
