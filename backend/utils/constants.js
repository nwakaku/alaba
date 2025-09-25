import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const COLLECTION_NAME = "DeFi_Knowledge";
export const EMBEDDING_MODEL = "text-embedding-3-small";

// Resolve data file relative to this file to avoid CWD issues
const DATA_DIR = join(__dirname, '..', 'data');
const FILE_PATH = join(DATA_DIR, 'information.txt');

// Ensure data directory exists
await fs.ensureDir(DATA_DIR);

// Read content from file
let CONTENT = "";
try {
    CONTENT = await fs.readFile(FILE_PATH, 'utf-8');
} catch (error) {
    console.log('Could not read information.txt, using empty content');
    CONTENT = "";
}

export { CONTENT };
