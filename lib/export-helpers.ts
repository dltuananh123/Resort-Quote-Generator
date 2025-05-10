/**
 * Export helpers for document conversion to image/PDF
 */

import domToImage from "dom-to-image";

type QualityLevel = "normal" | "high" | "ultra";

interface QualitySettings {
  scale: number;
  quality: number;
}

/**
 * Quality settings for image export
 */
export const qualitySettings: Record<QualityLevel, QualitySettings> = {
  normal: { scale: 2, quality: 0.9 },
  high: { scale: 3, quality: 0.95 },
  ultra: { scale: 4, quality: 1.0 },
};

/**
 * Convert DOM element to a PNG blob
 */
export async function elementToPngBlob(
  element: HTMLElement,
  quality: QualityLevel
): Promise<Blob> {
  const { scale, quality: qualityValue } = qualitySettings[quality];

  return await domToImage.toBlob(element, {
    quality: qualityValue,
    bgcolor: "#ffffff",
    height: element.offsetHeight * scale,
    width: element.offsetWidth * scale,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: `${element.offsetWidth}px`,
      height: `${element.offsetHeight}px`,
    },
  });
}

/**
 * Convert DOM element to a PNG data URL
 */
export async function elementToPngDataUrl(
  element: HTMLElement,
  quality: QualityLevel
): Promise<string> {
  const { scale, quality: qualityValue } = qualitySettings[quality];

  return await domToImage.toPng(element, {
    quality: qualityValue,
    bgcolor: "#ffffff",
    height: element.offsetHeight * scale,
    width: element.offsetWidth * scale,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: `${element.offsetWidth}px`,
      height: `${element.offsetHeight}px`,
    },
  });
}
