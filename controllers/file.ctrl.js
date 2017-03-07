const fs = require('co-fs');
const File = require('../models/File.js');
const path = require('path');

module.exports = {
  downloadFile,
  showFile,
  createFile,
  receiveFile
};

function* receiveFile(next) {
  try {
    let id = this.params.file;
    let file = this.request.files[0];
    let buffer = yield fs.readFile(file.path);
    let { index } = this.request.fields;
    index = parseInt(index);
    let block = {
      id,
      index,
      buffer
    };
    try {
      file = yield File.receiveOneBlock(block);
    } catch (e) {
      this.body = {
        status: 'DATABASE_ERR',
        err: e
      };
      return;
    }
    this.body = {
      status: 'OK',
      uploadedBlocks: file.uploadedBlocks
    }
  } catch (e) {
    this.body = {
      status: 'UNKNOWN_ERR',
      err: e
    };
    return;
  }
}

function* downloadFile(next) {
  let id = this.params.file;
  let file;
  try {
    file = yield File.findById(id);
  } catch (e) {
    throw e;
  }
  let data;
  try {
    data = yield fs.readFile(path.join(__dirname, file.path));
  } catch (e) {
    throw e;
  }
  this.res.connection.setTimeout(0);
  this.attachment(file.filename);
  this.body = data;
  yield next;
}

function* showFile(next) {
  let files = yield File.show();
  this.body = {
    status: 'OK',
    files
  };
  yield next;
}

function* createFile(next) {
  let { name, size, blockNum, md5 } = this.request.fields;
  let file = {
    size,
    blockNum,
    filename: name,
    md5,
    path: `../files/${name}`
  };
  let target;
  let id;
  let exist;
  try {
    target = yield File.getIdByMD5(md5);
  } catch (e) {
    this.body = {
      status: 'DATABASE_ERR',
      err: e
    };
    return;
  }
  if (!target) {
    try {
      file = yield File.create(file);
      id = file._id;
    } catch (e) {
      this.body = {
        status: 'DATABASE_ERR',
        err: e
      };
      return;
    }
  } else {
    file = target;
    id = file._id;
  }
  this.body = {
    status: 'OK',
    id,
    uploadedBlocks: file.uploadedBlocks
  };
}
