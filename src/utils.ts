export function createNewImage(src: string): HTMLImageElement {
  const image = new Image();
  image.src = src;
  return image;
}
