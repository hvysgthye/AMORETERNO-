import { generateStandaloneHTML } from './src/utils/htmlExporter.js';
import { TEMPLATES } from './src/data/templates.js';
import fs from 'fs';
import path from 'path';

const tpl = TEMPLATES.find(t => t.id === 'candado');
const html = generateStandaloneHTML('candado', tpl.defaults);

const outPath = 'c:\\Users\\susig\\OneDrive\\Desktop\\Nueva carpeta (2)\\dedicatoria_candado_autonoma.html';
fs.writeFileSync(outPath, html, 'utf-8');
console.log('Sample standalone HTML exported to:', outPath);
