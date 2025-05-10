const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Generating favicon from favicon.svg with white background...");

// Check if imagemagick is installed
try {
  execSync("convert -version", { stdio: "ignore" });
} catch (error) {
  console.error("ImageMagick is not installed. Please install it first:");
  console.error("- On Windows: https://imagemagick.org/script/download.php");
  console.error("- On Mac: brew install imagemagick");
  console.error("- On Ubuntu/Debian: sudo apt-get install imagemagick");
  process.exit(1);
}

const publicDir = path.join(__dirname, "..", "public");
const svgPath = path.join(publicDir, "favicon.svg");
const icoPath = path.join(publicDir, "favicon.ico");

if (!fs.existsSync(svgPath)) {
  console.error(`SVG file not found: ${svgPath}`);
  process.exit(1);
}

try {
  // Convert SVG to ICO using ImageMagick's convert tool with white background
  // Creates a 16x16, 32x32, 48x48, and 64x64 favicon
  execSync(
    `convert -background white "${svgPath}" -define icon:auto-resize=64,48,32,16 "${icoPath}"`
  );
  console.log(`Favicon created successfully: ${icoPath}`);
} catch (error) {
  console.error("Error generating favicon:", error.message);
  process.exit(1);
}

// Generate PNG versions for better compatibility
const sizes = [16, 32, 64, 96, 128, 192, 256];
for (const size of sizes) {
  try {
    const pngPath = path.join(publicDir, `favicon-${size}x${size}.png`);
    execSync(
      `convert -background white "${svgPath}" -resize ${size}x${size} "${pngPath}"`
    );
    console.log(`Created ${size}x${size} PNG favicon: ${pngPath}`);
  } catch (error) {
    console.error(`Error generating ${size}x${size} PNG:`, error.message);
  }
}

console.log("Favicon generation complete");
