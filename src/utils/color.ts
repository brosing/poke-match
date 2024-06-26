export function imageToRGBA(image: HTMLImageElement) {
  image.crossOrigin = 'Anonymous'
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  context?.drawImage(image, 0, 0, 1, 1);
  return context?.getImageData(0, 0, 1, 1).data.join(',')
}
