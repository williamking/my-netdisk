const mongoose = require('mongoose');
const fs = require('co-fs');
const path = require('path');

const FileSchema = new mongoose.Schema({
  filename: String,
  size: Number,
  blockNum: Number,
  blockSize: Number,
  uploadedBlocks: {
    type: Number,
    default: 0
  },
  lastUpdatedTime: {
    type: Date,
    default: Date.now()
  },
  createAt: {
    type: Date,
    default: Date.now()
  },
  md5: String,
  path: String
});

const FileModel = mongoose.model('File', FileSchema);

module.exports = {
  create,
  show,
  receiveOneBlock,
  getIdByMD5,
  findById
};

function* create(file) {
  let { filename, size, blockNum, blockSize, path, md5 } = file;
  let newFile = new FileModel({
    filename,
    size,
    blockNum,
    blockSize,
    md5,
    path
  });
  return newFile.save();
}

function* findById(id) {
  let file;
  file = yield FileModel.findOne({_id: id});
  return file;
}

function* getIdByMD5(md5) {
  let file;
  try {
    file = yield FileModel.findOne({ md5 });
  } catch (e) {
    throw e;
  }
  if (file) return file;
    else return null;
}

function* show() {
  return FileModel.find({}).sort({'createAt': 1});
}

function* receiveOneBlock(block) {
  try {
    let { index, id, buffer } = block;
    let file;
    try {
      file = yield FileModel.findOne({_id: id});
    } catch (e) {
      console.log(e);
      throw e;
    }
    let { blockSize, uploadedBlocks } = file;
    if (uploadedBlocks + 1 == index) {
      // 对文件进行分块合并
      let fd = yield fs.open(path.join(__dirname, file.path), 'a+');
      try {
        yield fs.write(fd, buffer, 0, buffer.length, blockSize * uploadedBlocks);
      } catch (e) {
        console.log(e);
        throw e;
      }
      file.uploadedBlocks++;
      yield file.save();
    } else {
      throw Error('ERROR FILE BLOCK');
    }
    return file;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
