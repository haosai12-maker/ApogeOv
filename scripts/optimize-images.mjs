import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsDir = path.join(__dirname, "../public/images/products");
const QUALITY = 80;
const SIZES = {
  large: 800,
  small: 400,
};

async function cleanFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function processProductImages() {
  const productFolders = await fs.readdir(productsDir);
  const imageMapping = [];

  for (const folder of productFolders) {
    const folderPath = path.join(productsDir, folder);
    const stat = await fs.stat(folderPath);

    if (!stat.isDirectory()) continue;

    const files = await fs.readdir(folderPath);
    const originalFiles = files.filter(
      (f) =>
        /\.(jpg|jpeg|png)$/i.test(f) ||
        (f.includes("Generated") || f.includes("WhatsApp") || f.includes("Sin"))
    );

    if (originalFiles.length === 0) {
      console.log(`No original images in ${folder}`);
      continue;
    }

    let imageIndex = 1;
    for (const file of originalFiles) {
      const inputPath = path.join(folderPath, file);
      const ext = ".webp";
      const cleanFolderName = await cleanFilename(folder);
      const baseName = `${cleanFolderName}-${imageIndex}`;

      const largePath = path.join(folderPath, `${baseName}-large${ext}`);
      const smallPath = path.join(folderPath, `${baseName}-small${ext}`);

      console.log(`Processing: ${file}`);

      try {
        const imageBuffer = await fs.readFile(inputPath);
        const metadata = await sharp(imageBuffer).metadata();
        const originalSize = imageBuffer.length;

        const [largeBuffer, smallBuffer] = await Promise.all([
          sharp(imageBuffer)
            .resize(SIZES.large, null, { withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toBuffer(),
          sharp(imageBuffer)
            .resize(SIZES.small, null, { withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toBuffer(),
        ]);

        await Promise.all([
          fs.writeFile(largePath, largeBuffer),
          fs.writeFile(smallPath, smallBuffer),
        ]);

        console.log(
          `  -> ${baseName}-large.webp (${(largeBuffer.length / 1024).toFixed(1)}KB), ${baseName}-small.webp (${(smallBuffer.length / 1024).toFixed(1)}KB)`
        );

        imageMapping.push({
          folder,
          originalFile: file,
          baseName,
          width: metadata.width || 800,
          large: `${baseName}-large.webp`,
          small: `${baseName}-small.webp`,
        });

        await fs.unlink(inputPath);
        imageIndex++;
      } catch (err) {
        console.error(`  Error: ${err.message}`);
      }
    }
  }

  await fs.writeFile(
    path.join(__dirname, "../src/data/image-mapping.json"),
    JSON.stringify(imageMapping, null, 2)
  );

  console.log("\n✅ Image optimization complete!");
  console.log(`📁 Processed ${imageMapping.length} images`);
  console.log("\nImage mapping saved to src/data/image-mapping.json");
}

processProductImages().catch(console.error);
