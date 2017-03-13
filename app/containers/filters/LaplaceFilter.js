export default function(ctx, width, height) {
  let imageData = ctx.getImageData(0, 0, width, height);
  let data = imageData.data;
  for (let i = 0; i < height; ++i) {
    for (let j = 0; j < width; ++j) {
      let index = i * (4 * width) + 4 * j;
      if (i > 0 && i < height - 1 && j > 0 && j < width - 1) {
        data[index] = computeLaplace(index, data, width);
        data[index + 1] = computeLaplace(index + 1, data, width);
        data[index + 2] = computeLaplace(index + 2, data, width);
      } else {
        data[index] = data[index + 1] = data[index + 2] = 0;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function computeLaplace(index, data, width) {
  let roundValue = data[index + 4] + data[index - 4] + data[index - 4 * width]
    + data[index + 4 * width];
  return 127 + data[index] * 4 - roundValue;
}
