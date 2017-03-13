import BlackWhiteFilter from '../containers/filters/BlackWhiteFilter'
import LaplaceFilter from '../containers/filters/LaplaceFilter'

const filters = {
  'GREY': BlackWhiteFilter,
  'LAPALACE': LaplaceFilter
};

/*
 * action类型
 */
export const ADD_FILE = 'ADD_FILE';
export const DELETE_FILE = 'DELETE_FILE';
export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPDATE_BLOCKS = 'UPDATE_BLOCKS';
export const RECEIVE_FILE = 'RECEIVE_FILE';
export const CHOOSE_FILE = 'CHOOSE_FILE';
export const PAUSE_UPLOAD = 'PAUSE_UPLOAD';
export const UPDATE_USERNAME = 'UPDATE_USERNAME';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const MAX_BLOCK_SIZE = 1024 * 1024;
export const MIN_BLOCK_SIZE = 200 * 1024;

/*
 * 文件上传状态
 */
export const STOPED = 'STOPED';
export const PROCESSING = 'PROCESSING';
export const COMPLETED = 'COMPLETED';
export const UNSTARTED = 'UNSTARTED';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const BLOCK_NUM = 100;
import { convertBytes, convertTime, convertDate } from '../commons/Conversion.js'
import fetch from 'isomorphic-fetch'
import { push } from 'react-router-redux'

/*
 * 分享文件状态
 */
export const UPDATE_SHARE = 'UPDATE_SHARE'
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const OPEN_MODAL = 'OPEN_MODAL'
export const UPDATE_SHARE_LINK = 'UPDATE_SHARE_LINK'

/*
 * 分享播放器状态
 */
export const OPEN_PLAYER = 'OPEN_PLAYER';
export const CLOSE_PLAYER = 'CLOSE_PLAYER';
export const PLAY_CANVAS = 'PLAY_CANVAS';
export const PAUSE_CANVAS = 'PAUSE_CANVAS';
export const SHOW_CANVAS = 'SHOW_CANVAS';
export const HIDE_CANVAS = 'HIDE_CANVAS';

/*
 * 播放器滤镜
 */
export const TO_GREY = 'TO_GREY';
export const TO_LAPLACE = 'TO_LAPLACE';
export const TO_NORMAL = 'TO_NORMAL';

export function addFile(file, action) {
  return {
    type: ADD_FILE,
    ...action
  };
}

export function deleteFile(text) {
  return {
    type: DELETE_FILE,
    text
  };
}

export function uploadFile(index) {
  return {
    type: UPLOAD_FILE,
    index,
    status: 'PROCESSING'
  }
}

export function chooseFile(filename) {
  return {
    type: CHOOSE_FILE,
    filename
  };
}

export function receiveFile() {
  return (dispatch) => {
    return fetch('/api/files', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(json => {
        if (json.status == 'OK') {
          let files = parseToFiles(json);
          dispatch({
            type: 'RECEIVE_FILE',
            files
          });
        } else {
          dispatch(push('/'));
        }
      });
  };
}

export function getShareFile(id) {
  return (dispatch) => {
    return fetch(`/api/shares/${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.status == 'OK') {
          dispatch(updateShare(res.share));
        } else {
          alert(`服务器错误，错误代码${res.status}`);
        }
      });
  }
}

export function updateShareLink(link) {
  return {
    type: UPDATE_SHARE_LINK,
    shareLink: link
  };
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  };
}

export function openModal() {
  return {
    type: OPEN_MODAL
  };
}

function updateShare(share) {
  return {
    type: UPDATE_SHARE,
    file: {
      ...share.file,
      expire_time: convertDate(share.expire_time),
      size: convertBytes(share.file.size),
      createAt: convertDate(share.file.createAt)
    }
  };
}

export function uploadBlock(index) {
  return (dispatch, getState) => {
    dispatch(uploadFile(index));
    let state = getState();
    let { uploadedBlocks } = state.files[index];
    createRequest(getState, dispatch, index, uploadedBlocks);
  };
}

export function pauseToSendBlock(index) {
  return {
    type: PAUSE_UPLOAD,
    index
  };
}

export function updateFileProgress(index, info) {
  return {
    type: UPDATE_PROGRESS,
    index,
    info
  };
}

export function updateUsername(username) {
  return {
    type: UPDATE_USERNAME,
    username
  };
}

export function updatePassword(password) {
  return {
    type: UPDATE_PASSWORD,
    password
  };
}

export function login() {
  return {
    type: LOGIN
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}

export function sendLogout() {
  return (dispatch) => {
    fetch('/api/auths/logout', {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(res => {
        if (res.status == 'OK') {
          dispatch(logout());
          dispatch(push('/'));
        } else {
          alert(`服务器错误，错误代码${res.status}`);
        }
      });
  };
}

export function updateFileBlocks(index, uploadedBlocks, blockNum) {
  let info = {
    lastUpdatedTime: Date.now(),
    uploadedBlocks: uploadedBlocks
  };
  if (uploadedBlocks >= blockNum) {
    info.progress = '100%';
    info.status = COMPLETED;
    info.speed = '--';
    info.leftTime = '--:--:--';
  }
  return {
    type: UPDATE_BLOCKS,
    index,
    info
  }
}

export function closePlayer() {
  return {
    type: CLOSE_PLAYER
  };
}

export function openPlayer() {
  return {
    type: OPEN_PLAYER
  };
}

export function canvasPlay(canvas, video) {
  return (dispatch, getState) => {
    dispatch({ type: PLAY_CANVAS });
    let ctx = canvas.getContext('2d');
    let width = document.querySelectorAll('.modal-body')[0].width;
    let videoStyle = window.getComputedStyle(video);
    canvas.style.width = videoStyle.width;
    canvas.style.height = videoStyle.height;
    canvas.height = parseInt(videoStyle.height);
    canvas.width = parseInt(videoStyle.width);

    let flush = function() {
      let state = getState();
      let {canvasState, filter} = state.player;
      if (!video.ended) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (filter != 'NORMAL')
          filters[filter](ctx, canvas.width, canvas.height);
        if (canvasState == 'PLAYED') {
          window.requestAnimationFrame(flush);
        }
      }
    };
    flush();
  };
}

export function canvasPause() {
  return {
    type: PAUSE_CANVAS
  };
}

export function canvasShow() {
  return {
    type: SHOW_CANVAS
  };
}

export function canvasHide() {
  return {
    type: HIDE_CANVAS
  };
}

export function toFilter(type) {
  return {
    type
  };
}

function parseToFiles(json) {
  let { files } = json;
  let completedFiles = [];
  files.map((file, index) => {
    if (file.uploadedBlocks == file.blockNum) {
      let result = {
        filename: file.filename, // 文件名
        size: file.size, // 文件大小
        status: COMPLETED, // 文件任务状态(UNSTARTED, PROCESSING, STOPED, COMPLETED)
        progress: '100%', // 上传进度
        blockNum: file.blockNum, // 文件实际分块数
        error: null, // 错误信息
        timeUsed: '--:--:--',  // 上传用时
        speed: 'UNKNOWN', // 上传速度
        lastUpdatedTime: Date.now(), // 上次更新时间
        lastUploadedSize: 0, // 最近一次上传的数据大小
        leftTime: '--:--:--', // 估计剩余时间,
        uploadedBlocks: file.uploadedBlocks, // 已上传分块数,
        id: file._id // 文件在服务器数据库中对应的id
      }
      completedFiles.push(result);
    }
  });
  return completedFiles;
}

function blockSendOnProgress(e, getState, dispatch, index, uploadedBlocks) {
  let state = getState();
  let file = state.files[index];
  let { size, blockSize, lastUploadedSize, lastUpdatedTime } = file;
  let uploadedSize = uploadedBlocks * blockSize + e.loaded;
  let progress = (uploadedSize * 100 / size).toFixed(1) + '%';
  let newUpdateTime = Date.now();
  let speed = Math.round(Math.abs(uploadedSize - lastUploadedSize) * 1000 / (newUpdateTime - lastUpdatedTime));
  let leftTime;
  if (speed != 0) {
    leftTime = convertTime(Math.round((size - uploadedSize) / speed));
  } else {
    leftTime = '--:--:--';
  }
  debugger;
  speed = convertBytes(speed) + '/s';
  // file.timer = setTimeout(() => {
    dispatch(updateFileProgress(
      index,
      {
        lastUpdatedTime: newUpdateTime,
        lastUploadedSize: uploadedSize,
        progress,
        speed,
        leftTime
      }
    ));
  // }, 300);
}

function blockSendOnCompleted(e, getState, dispatch, index, uploadedBlocks) {
  let state = getState();
  let file = state.files[index];
  let xhr = e.currentTarget;
  if (xhr.status != 200) {
    alert(`上传错误: 错误代码${xhr.status}`);
    return;
  }
  let { timer, blockSize, blockNum } = file;
  if (timer) clearTimeout(timer);
  if (uploadedBlocks + 1 < blockNum) { // 判断是否已上传完
    uploadedBlocks++;
    dispatch(updateFileBlocks(
      index,
      uploadedBlocks,
      blockNum
    ));
    if (file.status == 'PROCESSING') {
      createRequest(getState, dispatch, index, uploadedBlocks);
    }
  } else {
    let lastUpdateTime = Date.now();
    dispatch(updateFileBlocks(
      index,
      uploadedBlocks + 1,
      blockNum
    ));
  }
}

function blockSendOnError(e, file, dispatch, index) {
  console.log(e);
}

function produceFormData(file, start, end, uploadedBlocks) {
  let form = new FormData();
  let slice = file.file.slice(start, end);
  form.append('file', file.file.slice(start, end));
  form.append('id', file.id);
  form.append('index', uploadedBlocks + 1);
  return form;
}

function createRequest(getState, dispatch, index, uploadedBlocks) {
  let xhr = new XMLHttpRequest();
  xhr.upload.addEventListener('progress', (e) => {
    blockSendOnProgress(e, getState, dispatch, index, uploadedBlocks);
  });
  xhr.addEventListener('error', (e) => {
    alert('failed');
    blockSendOnError(e, getState, dispatch, index, uploadedBlocks);
  });
  xhr.addEventListener('load', (e) => {
    console.log(`Block ${uploadedBlocks} completed.`);
    blockSendOnCompleted(e, getState, dispatch, index, uploadedBlocks);
  });
  xhr.addEventListener('abort', (e) => {
    console.log('abort');
  });

  let state = getState();
  let file = state.files[index];
  let { size, blockSize } = file;
  // 创建分块文件
  let start = uploadedBlocks * blockSize;
  let end = Math.min((uploadedBlocks + 1) * blockSize, size);
  let blockData = produceFormData(file, start, end, uploadedBlocks);

  xhr.open('PUT', `/api/files/${file.id}`);
  xhr.send(blockData);
}
