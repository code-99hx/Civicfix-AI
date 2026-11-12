import sharp from 'sharp';
import path from 'path';

const inputPath = 'C:\\Users\\aafta\\.gemini\\antigravity-ide\\brain\\594be146-0c56-4002-978c-e59ca85120e6\\organic_rainbow_sphere_1792245789070.jpg';
const outputPath = 'c:\\SIH Hackathon\\civicfix-ai\\public\\images\\rainbow_sphere.png';

async function processImage() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outBuffer = Buffer.alloc(width * height * 4);

  // Background threshold
  const threshold = 14;

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];

    const maxVal = Math.max(r, g, b);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    let alpha = 0;
    if (maxVal > threshold) {
      // Smooth sigmoid / cubic easing for edges
      const normalized = (maxVal - threshold) / (255 - threshold);
      alpha = Math.min(255, Math.round(Math.pow(normalized, 0.85) * 255));
    }

    if (alpha > 0) {
      // Unmultiply color slightly so thin iridescent colors stay vivid
      const factor = Math.max(0.4, alpha / 255);
      outBuffer[i * 4] = Math.min(255, Math.round(r / factor));
      outBuffer[i * 4 + 1] = Math.min(255, Math.round(g / factor));
      outBuffer[i * 4 + 2] = Math.min(255, Math.round(b / factor));
      outBuffer[i * 4 + 3] = alpha;
    } else {
      outBuffer[i * 4] = 0;
      outBuffer[i * 4 + 1] = 0;
      outBuffer[i * 4 + 2] = 0;
      outBuffer[i * 4 + 3] = 0;
    }
  }

  await sharp(outBuffer, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png({ quality: 100, compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`Successfully generated transparent PNG at: ${outputPath} (${width}x${height})`);
}

processImage().catch(console.error);
