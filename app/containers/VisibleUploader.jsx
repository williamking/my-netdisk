import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addFile, uploadFile, chooseFile, sendLogout, BLOCK_NUM, MIN_BLOCK_SIZE,
  MAX_BLOCK_SIZE, UNSTARTED, COMPLETED } from '../actions/actions'
import Uploader from '../components/Uploader.jsx'
import CryptoJS from 'crypto-js'

const mapStateToProps = (state) => {
  return {
    files: state.files,
    filename: state.filename
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddClick: (target) => {
      let form = new FormData(target);
      let file = form.get("newFile");
      getMD5AndDispatch(file, dispatch);
      target.reset();
      // console.log(file);
    },
    onFileChange: (element) => {
      let file = element.target.files[0];
      dispatch(chooseFile(file.name));
    },
    logout: (e) => {
      dispatch(sendLogout());
    }
  };
};

function getMD5AndDispatch(file, dispatch) {
  if (!FileReader) {
    alert('您的浏览器不支持FileReader');
  } else {
    let blob = file.slice(0, 1024 * 64);
    let preReader = new FileReader();
    let md5 = CryptoJS.algo.MD5.create();
    preReader.onload = (e) => {
      md5.update(CryptoJS.enc.Latin1.parse(e.target.result));
      let postReader = new FileReader();
      let blob = file.slice(file.size - 1024 * 64, file.size)
      postReader.onload = (e) => {
        md5.update(CryptoJS.enc.Latin1.parse(e.target.result));
        let final = md5.finalize();
        file.md5 = final.toString();
        calculateFile(file, dispatch);
      };
      postReader.readAsBinaryString(blob);
    };
    preReader.readAsBinaryString(blob)
  }
}

function calculateFile(file, dispatch) {
  let blockSize, blockNum;
  blockSize = Math.ceil(file.size / BLOCK_NUM);
  if (blockSize > MAX_BLOCK_SIZE) {
    blockSize = MAX_BLOCK_SIZE;
  } else {
    if (blockSize < MIN_BLOCK_SIZE) blockSize = MIN_BLOCK_SIZE;
  }
  blockNum = Math.ceil(file.size / blockSize);
  let xhr = sendFileInfo(file, blockNum);
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      let res = JSON.parse(xhr.responseText);
      let action =  {
        file,
        blockSize,
        blockNum,
        id: res.id,
        uploadedBlocks: res.uploadedBlocks,
        progress: (res.uploadedBlocks * 100.0 / blockNum).toFixed(1) + '%',
        status: res.uploadedBlocks < blockNum ? UNSTARTED : COMPLETED
      };
      dispatch(addFile(file, action));
    }
  };
}

function sendFileInfo(file, blockNum) {
  let xhr = new XMLHttpRequest();
  let form = new FormData();
  form.append('name', file.name);
  form.append('size', file.size);
  form.append('blockNum', blockNum);
  form.append('md5', file.md5);
  xhr.open('POST', '/api/files');
  xhr.send(form);
  return xhr;
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader)
