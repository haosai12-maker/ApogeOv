import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, "../public/images/LogoO.png");
const outputPath = path.join(__dirname, "../public/favicon.ico");

async function convertToIco() {
  try {
    const sizes = [16, 32, 48, 64, 128, 256];
    const buffers = [];

    for (const size of sizes) {
      const buffer = await sharp(inputPath)
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      buffers.push({ size, buffer });
    }

    const icoHeader = Buffer.alloc(6);
    icoHeader.writeUInt16LE(0, 0);
    icoHeader.writeUInt16LE(1, 2);
    icoHeader.writeUInt16LE(buffers.length, 4);

    let offset = 6 + buffers.length * 16;
    const entries = [];

    for (const { size, buffer } of buffers) {
      const entry = Buffer.alloc(16);
      entry.writeUInt8(size >= 256 ? 0 : size, 0);
      entry.writeUInt8(size >= 256 ? 0 : size, 1);
      entry.writeUInt8(0, 2);
      entry.writeUInt8(0, 3);
      entry.writeUInt16LE(1, 4);
      entry.writeUInt16LE(32, 6);
      entry.writeUInt32LE(buffer.length, 8);
      entry.writeUInt32LE(offset, 12);
      entries.push(entry);
      offset += buffer.length;
    }

    const icoBuffer = Buffer.concat([icoHeader, ...entries, ...buffers.map(b => b.buffer)]);
    await Bun.write(outputPath, icoBuffer);

    console.log(`✅ Favicon ICO creado: ${outputPath}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

convertToIco();