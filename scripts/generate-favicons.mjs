import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "public", "favicon.ico");
const outDir = path.join(root, "public");
const sizes = [16, 32, 48, 180, 192, 512];

if (!fs.existsSync(source)) {
  throw new Error(`Missing favicon source: ${source}`);
}

const image = sharp(source).ensureAlpha();

for (const size of sizes) {
  const target = path.join(outDir, `favicon-${size}.png`);
  await image
    .clone()
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(target);
  console.log(`Wrote ${target}`);
}
