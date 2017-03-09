const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

module.exports = {
  send
};

const mimeNames = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "application/javascript",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".ogg": "application/ogg",
  ".ogv": "video/ogg",
  ".oga": "audio/ogg",
  ".mkv": "video/mkv",
  ".txt": "text/plain",
  ".wav": "audio/x-wav",
  ".webm": "video/webm"
};

function send(ctx, path) {
  let resHeaders = {};
  let exist = fs.existsSync(path);
  if (!exist) {
    return sendResponse(ctx, 404, {
      msg: '找不到文件'
    });
  }

  return createResponse(ctx, path);
}

function sendResponse(ctx, status, body) {
  ctx.status = status;
  ctx.body = body;
}

function getMineTypeFromExt(extName) {
  let result = mimeNames[extName.toLowerCase()];

  if (!result) result = 'application/octet-stream';

  return result;
}

function createResponse(ctx, filepath) {
  let stat = fs.statSync(filepath);
  let range = readRangeFromHeader(ctx, stat.size);
  let {size} = stat;

  if (!range) {
    return sendNormalResponse(ctx, size, filepath)
  }

  let {start, end} = range;
  if (!(start >= 0 && end < size && start <= end)) {
    return sendRangeErrorResponse(ctx, size);
  }

  return sendPartialResponse(ctx, start, end, size, filepath);
}

function sendNormalResponse(ctx, size, filepath) {
  ctx.length = size;
  ctx.set('Accept-Ranges', 'bytes');
  ctx.type = getMineTypeFromExt(path.extname(filepath));
  let stream = fs.createReadStream(filepath);
  return sendResponse(ctx, 200, stream);
}

function sendRangeErrorResponse(ctx, size) {
  this.set('Content-Range') = `bytes */${size}`;
  sendResponse(ctx, 416, null);
}

function sendPartialResponse(ctx, start, end, size, filepath) {
  ctx.length = end - start + 1;
  ctx.type = getMineTypeFromExt(path.extname(filepath));
  ctx.set({
    'Content-Range': `bytes ${start}-${end}/${size}`,
    'Cache-Control': 'no-cache',
    'Accept-Ranges': 'bytes'
  });

  let stream = fs.createReadStream(filepath);
  if (stream) {
    ctx.body = stream;
  }

  sendResponse(ctx, 206, fs.createReadStream(filepath, { start, end }));
}

function readRangeFromHeader(ctx, size) {
  let range = ctx.headers['range'];

  if (!range || range.length == 0) return null;

  let arr = range.split(/bytes=([0-9]*)-([0-9]*)/);
  let start = parseInt(arr[1]);
  let end = parseInt(arr[2]);

  let result = {
    start: isNaN(start) ? 0 : start,
    end: isNaN(end) ? (size - 1) : end
  };

  if (isNaN(start) && !isNaN(end)) {
    result.start = size - end;
    result.end = size - 1;
  }

  return result;
}
