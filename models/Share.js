const mongoose = require('mongoose');
const fs = require('co-fs');
const path = require('path');

const ShareSchema = new mongoose.Schema({
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  expire_time: {
    type: Date,
    default: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
});

const ShareModel = mongoose.model('Share', ShareSchema);

module.exports = {
  getByFile,
  getById
};

function* getById(id) {
  let shareItem;
  try {
    shareItem = yield ShareModel.findOne({ _id: id })
      .$where('this.expire_time > Date.now()').populate('file');
  } catch (e) {
    throw e;
  }
  return shareItem;
}

function* getByFile(fileId) {
  let shareItem;
  try {
    shareItem = yield ShareModel.findOne({ file: fileId })
      .$where('this.expire_time > Date.now()');
  } catch (e) {
    throw e;
  }
  if (!shareItem) {
    shareItem = new ShareModel({ file: fileId });
    yield shareItem.save();
  }
  return shareItem;
}
