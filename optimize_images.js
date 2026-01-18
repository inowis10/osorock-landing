import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

const files = [
    'logo zorro.png',
    'zorro rock.png',
    'background.jpg'
];

async function optimize() {
    for (const file of files) {
        const inputPath = path.join(publicDir, file);
        const outputPath = path.join(publicDir, file.replace(/\.(png|jpg|jpeg)$/, '.webp'));

        if (fs.existsSync(inputPath)) {
            console.log(`Optimizing ${file}...`);
            let pipeline = sharp(inputPath);

            if (file.includes('background')) {
                pipeline = pipeline.resize(1920); // Full HD width
            } else if (file.includes('zorro rock')) {
                pipeline = pipeline.resize(800); // 800px width
            }

            await pipeline
                .webp({ quality: 80 })
                .toFile(outputPath);

            const oldSize = fs.statSync(inputPath).size / 1024;
            const newSize = fs.statSync(outputPath).size / 1024;
            console.log(`Finished ${file}: ${oldSize.toFixed(2)} KB -> ${newSize.toFixed(2)} KB`);
        } else {
            console.error(`File not found: ${inputPath}`);
        }
    }
}

optimize().catch(console.error);
