import { combineReducers } from 'redux'
import { ADD_FILE, DELETE_FILE, UPDATE_PROGRESS, UPLOAD_FILE, UPDATE_BLOCKS,
  STOPED, PAUSE_UPLOAD, RECEIVE_FILE, CHOOSE_FILE, UPDATE_USERNAME, UPDATE_PASSWORD,
  LOGIN, LOGOUT, UPDATE_SHARE, OPEN_MODAL, UPDATE_SHARE_LINK,
  CLOSE_MODAL} from '../actions/actions.js'
import { routerReducer } from 'react-router-redux'

function username(state = '', action) {
  switch (action.type) {
    case UPDATE_USERNAME:
      return action.username;
      break;
    default:
      return state;
  }
}

function password(state = '', action) {
  switch (action.type) {
    case UPDATE_PASSWORD:
      return action.password;
    default:
      return state;
  }
}

function online(state = false, action) {
  switch (action.type) {
    case LOGIN:
      return true;
    case LOGOUT:
      return false;
    default:
      return state;
  }
}

const auth = combineReducers({
  username,
  password,
  online
});

function files(state = [], action) {
  switch (action.type) {
    case ADD_FILE:
      return [
        ...state,
        {
          filename: action.file.name, // 文件名
          size: action.file.size, // 文件大小
          file: action.file, // 文件数据对象
          status: action.status, // 文件任务状态(UNSTARTED, PROCESSING, STOPED, COMPLETED)
          progress: action.progress, // 上传进度
          blockSize: action.blockSize, // 文件实际分块大小
          blockNum: action.blockNum, // 文件实际分块数
          error: null, // 错误信息
          timeUsed: '00:00:00',  // 上传用时
          speed: '--', // 上传速度
          lastUpdatedTime: Date.now(), // 上次更新时间
          lastUploadedSize: 0, // 最近一次上传的数据大小
          leftTime: '--:--:--', // 估计剩余时间,
          uploadedBlocks: action.uploadedBlocks, // 已上传分块数,
          id: action.id // 文件在服务器数据库中对应的id
        }
      ];
    case DELETE_FILE:
      let newState = [...state];
      return newState.splice(action.index, 1);
    case UPLOAD_FILE:
      return state.map((file, index) => {
        if (index == action.index) {
          return {
            ...file,
            status: action.status
          };
        } else {
          return file;
        }
      });
    case RECEIVE_FILE:
      return [...state, ...action.files];
    case PAUSE_UPLOAD:
      return state.map((file, index) => {
        if (index == action.index) {
          return {
            ...file,
            status: STOPED
          };
        } else {
          return file;
        }
      });
    case UPDATE_PROGRESS:
      return state.map((file, index) => {
        if (index == action.index) {
          return {
            ...file,
            ...action.info
          };
        } else {
          return file;
        }
      });
    case UPDATE_BLOCKS:
      return state.map((file, index) => {
        if (index == action.index) {
          return {
            ...file,
            ...action.info
          };
        } else {
          return file;
        }
      });
    default:
      return state
  }
}

function filename(state = '', action) {
  switch (action.type) {
    case CHOOSE_FILE:
      return action.filename;
    default:
      return state;
  }
}

function shareFile(state = {}, action) {
  switch (action.type) {
    case UPDATE_SHARE:
      return action.file;
    default:
      return state;
  }
}

function shareModal(state={
  show: false,
  shareLink: ''
}, action) {
  switch (action.type) {
    case UPDATE_SHARE_LINK:
      return {
        ...state,
        shareLink: action.shareLink
      };
    case CLOSE_MODAL:
      return {
        ...state,
        show: false
      };
    case OPEN_MODAL:
      return {
        ...state,
        show: true
      };
    default:
      return state;
  }
}

const FileApp = combineReducers({
  auth,
  files,
  filename,
  shareFile,
  shareModal,
  routing: routerReducer
});

export default FileApp
