declare module "dom-to-image" {
  export function toSvg(node: HTMLElement, options?: object): Promise<string>;
  export function toPng(node: HTMLElement, options?: object): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: object): Promise<string>;
  export function toBlob(node: HTMLElement, options?: object): Promise<Blob>;
  export function toPixelData(
    node: HTMLElement,
    options?: object
  ): Promise<Uint8Array>;
  export default {
    toSvg,
    toPng,
    toJpeg,
    toBlob,
    toPixelData,
  };
}
