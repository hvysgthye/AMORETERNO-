import assert from 'node:assert/strict';
import { test } from 'node:test';
import vm from 'node:vm';
import { TEMPLATES } from '../src/data/templates.js';
import { KEEPSAKE_DESIGNS } from '../src/data/keepsakeDesigns.js';
import { generateStandaloneHTML } from '../src/utils/htmlExporter.js';

function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255)
    .map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}

test('all 45 editions have readable ink and accents on their base materials', () => {
  assert.equal(TEMPLATES.length, 45);
  for (const template of TEMPLATES) {
    const design = KEEPSAKE_DESIGNS[template.id];
    assert.ok(design, template.id);
    for (const color of [design.ink, design.accent]) {
      const contrast = (luminance(color) + .05) / (luminance(design.background) + .05);
      assert.ok(contrast >= 4.5, `${template.id}: contrast ${contrast.toFixed(2)}`);
    }
  }
});

test('all 45 downloaded gifts render and reveal their own text and illustration', () => {
  for (const template of TEMPLATES) {
    const design = KEEPSAKE_DESIGNS[template.id];
    const body = `Carta personal de ${template.id} con cariño & recuerdos`;
    const html = generateStandaloneHTML(template.id, { ...template.defaults, letterText: body });
    assert.ok(html.includes(`data-family="${design.family}"`), template.id);
    const root = { innerHTML: '', style: {} };
    const context = vm.createContext({
      document: { getElementById: id => id === 'standalone-root' ? root : null, body: { style: {} } },
      window: {}, setTimeout: () => 0, console
    });
    const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
    vm.runInContext(script, context);
    assert.ok(root.innerHTML.includes('keepsake-frame'), template.id);
    if (root.innerHTML.includes('handleTapUniversal()')) {
      assert.ok(root.innerHTML.includes('keepsake-illustration'), template.id);
      for (let i = 0; i < 5; i++) context.window.handleTapUniversal();
    } else context.window.handleDirectUnlock();
    assert.ok(root.innerHTML.includes(body.replace('&', '&amp;')), template.id);
    assert.ok(root.innerHTML.includes('love-keepsake'), template.id);
  }
});
