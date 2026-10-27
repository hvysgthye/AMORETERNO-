import assert from 'node:assert/strict';
import { test } from 'node:test';
import vm from 'node:vm';
import { generateStandaloneHTML } from '../src/utils/htmlExporter.js';
import { encodeDedicationToURL, decodeDedicationFromURL, saveCreationLocally, getSavedCreations, removeCreationLocally } from '../src/utils/shareHelper.js';
import { generateQRCodeSVG } from '../src/utils/qrCodeGenerator.js';

globalThis.window = { location: { origin: 'https://example.com', pathname: '/gift/', search: '' } };

test('export escapes title, script context, revealed text and media attributes', () => {
  const attack = '</title><script>window.pwned=true</script><img src=x onerror="alert(1)"> & \'hola\'';
  const html = generateStandaloneHTML('carta', {
    title: attack, letterText: attack, letterTitle: attack, customSign: attack,
    lockTitle: attack, unlockMsg: attack, photoCaption: attack,
    photo: 'https://example.com/" onerror="alert(1)',
    customAudio: 'https://example.com/" onplay="alert(1)',
    voiceNote: 'javascript:alert(1)'
  });
  assert.ok(!html.includes(attack));
  assert.ok(!html.includes('src="https://example.com/" onplay='));
  assert.ok(html.includes('&lt;/title&gt;'));
  assert.ok(!html.includes('javascript:alert(1)'));
  const root = { innerHTML: '', style: {} };
  const context = vm.createContext({
    document: { getElementById: id => id === 'standalone-root' ? root : null, body: { style: {} } },
    window: {}, setTimeout: () => 0, console
  });
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
  vm.runInContext(script, context);
  assert.ok(!root.innerHTML.includes('<img src=x'));
  context.window.handleDirectUnlock();
  assert.ok(root.innerHTML.includes('&lt;img src=x'));
  assert.ok(!root.innerHTML.includes('<img src=x'));
  assert.ok(!root.innerHTML.includes('src="https://example.com/" onerror='));
  assert.equal(context.window.pwned, undefined);
  const templateAttack = generateStandaloneHTML('";window.pwned=true;//</script>', {});
  assert.ok(!templateAttack.includes('//</script>'));
  new vm.Script([...templateAttack.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1]);
});

test('export retains embedded photo, voice and music', () => {
  const html = generateStandaloneHTML('carta', {
    photo: 'data:image/png;base64,AAAA', voiceNote: 'data:audio/webm;codecs=opus;base64,AAAA',
    customAudio: 'data:audio/mp3;base64,AAAA'
  });
  for (const media of ['data:image/png;base64,AAAA', 'data:audio/webm;codecs=opus;base64,AAAA', 'data:audio/mp3;base64,AAAA']) assert.ok(html.includes(media));
});

test('long letters fit a QR without losing content; oversized gifts return an explicit failure', () => {
  for (const letter of ['a'.repeat(1800), 'Te quiero. '.repeat(163)]) {
    const url = encodeDedicationToURL('carta', { title: 'Para ti', letterText: letter });
    window.location.search = new URL(url).search;
    assert.equal(decodeDedicationFromURL().data.letterText, letter);
    const svg = generateQRCodeSVG(url);
    assert.ok(svg);
    assert.ok(!svg.includes('<circle')); // Never cover data modules with a logo.
    assert.ok(!svg.includes('x="0" y="0"')); // Keep the quiet zone clear.
  }
  // Text duplicated in old aliases now appears only once in new links.
  const text = 'Una carta con recuerdos';
  const url = encodeDedicationToURL('carta', { letterBody: text });
  const payload = JSON.parse(Buffer.from(new URL(url).searchParams.get('d'), 'base64url').toString());
  assert.equal(payload.fields.letterBody, text);
  assert.equal(payload.lb, undefined);
  assert.equal(generateQRCodeSVG('x'.repeat(10000)), null);
});

test('old shared links still decode', () => {
  const oldPayload = { t: 'carta', ti: 'Antes', lb: 'Carta original', c: [1, 2, 3] };
  window.location.search = '?mode=view&d=' + Buffer.from(JSON.stringify(oldPayload)).toString('base64url');
  const decoded = decodeDedicationFromURL();
  assert.equal(decoded.data.title, 'Antes');
  assert.equal(decoded.data.letterBody, 'Carta original');
  assert.deepEqual(decoded.data.combo, [1, 2, 3]);
});

test('same-title gifts and edited versions survive; repeated identical saves do not duplicate', () => {
  let stored = '[]';
  globalThis.localStorage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };
  const first = saveCreationLocally('carta', { title: 'Para ti', letterText: 'Primera' });
  const second = saveCreationLocally('candado', { title: 'Para ti', letterText: 'Segunda' });
  const third = saveCreationLocally('carta', { title: 'Para ti', letterText: 'Editada' });
  assert.ok(first && second && third);
  assert.equal(new Set([first.id, second.id, third.id]).size, 3);
  assert.equal(getSavedCreations().length, 3);
  assert.equal(saveCreationLocally('carta', third.data).id, third.id);
  assert.equal(getSavedCreations().length, 3);
  assert.equal(removeCreationLocally(second.id), true);
  assert.deepEqual(getSavedCreations().map(item => item.id), [third.id, first.id]);
  stored = '{}';
  assert.deepEqual(getSavedCreations(), []);
  stored = '[null,{}]';
  assert.deepEqual(getSavedCreations(), []);
});
