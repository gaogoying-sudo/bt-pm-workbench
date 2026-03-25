import fs from 'node:fs';
import path from 'node:path';

// Demo reset is equivalent to clearing durable store.
// Seed data remains committed under src/data/**.
const dir = process.env.PMW_DATA_DIR || '.pmw-data';
const abs = path.resolve(process.cwd(), dir);

if (fs.existsSync(abs)) {
  fs.rmSync(abs, { recursive: true, force: true });
}
fs.mkdirSync(abs, { recursive: true });

console.log(`Demo reset completed: ${abs}`);
