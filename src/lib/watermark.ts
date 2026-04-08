import logoUrl from "@/assets/Untitled design - 2026-03-27T091410.050.png";

/**
 * Applies a Plezyy logo watermark to the lower-right corner of an image file.
 * Returns a new File with the watermark applied.
 * Non-image files (videos, gifs) are returned unchanged.
 */
export async function applyWatermark(file: File): Promise<File> {
  // Only watermark static images
  if (!file.type.match(/^image\/(png|jpe?g|webp)$/)) return file;

  const img = await loadImage(URL.createObjectURL(file));
  const logo = await loadImage(logoUrl);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;

  // Draw original image
  ctx.drawImage(img, 0, 0);

  // Scale logo — target ~12% of image width, min 40px
  const logoWidth = Math.max(40, Math.round(img.width * 0.12));
  const logoHeight = Math.round(logo.height * (logoWidth / logo.width));

  // Position: lower-right with padding
  const padding = Math.round(img.width * 0.025);
  const x = img.width - logoWidth - padding;
  const y = img.height - logoHeight - padding;

  // Draw with slight transparency
  ctx.globalAlpha = 0.5;
  ctx.drawImage(logo, x, y, logoWidth, logoHeight);
  ctx.globalAlpha = 1;

  // Convert back to File
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), file.type, 0.92)
  );

  return new File([blob], file.name, { type: file.type, lastModified: Date.now() });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
