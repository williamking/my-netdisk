export default function(ctx, width, height) {
  let imageData = ctx.getImageData(0, 0, width, height);
  let data = imageData.data;
  for (let i = 0; i < data.length - 4; i += 4) {
    let average = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = average;
  }
  ctx.putImageData(imageData, 0, 0);
}
