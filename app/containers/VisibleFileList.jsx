import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { deleteFile, addFile, receiveFile, updateFileProgress, uploadBlock,
  pauseToSendBlock, closeModal, openModal, updateShareLink } from '../actions/actions'
import FileList from '../components/FileList.jsx'
import { STOPED, PROCESSING, UNSTATED, COMPLETED } from '../actions/actions.js'
import fetch from 'isomorphic-fetch'
import { push } from 'react-router-redux'

const mapStateToProps = (state) => {
  return {
    files: state.files,
    shareModalShow: state.shareModal.show,
    shareLink: state.shareModal.shareLink
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    downloadFile: (file) => {
      return (e) => {
        let { id } = file;
        let a = document.createElement('a');
        a.href = `/api/files/${id}`;
        a.download = file.filename;
        a.click();
      };
    },
    onContinueSendFile: (index) => {
      return (e) => {
        // if (status != STOPED) throw Error('任务不在停止状态');
        dispatch(uploadBlock(index));
      };
    },
    onLoaded: () => {
      dispatch(receiveFile());
    },
    onPauseSendFile: (index) => {
      return e => dispatch(pauseToSendBlock(index));
    },
    shareFile: (file) => {
      return (e) => {
        let { id } = file;
        fetch(`/api/shares`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id
          })
        })
          .then(res => res.json())
          .then(res => {
            if (res.status == 'OK') {
              let { share_id } = res;
              dispatch(updateShareLink(`/car/${share_id}`));
              dispatch(openModal());
            } else {
              alert(`分享失败，错误代码${res.status}`);
            }
          });
      }
    },
    closeModal: (e) => {
      dispatch(closeModal());
    },
    copyLink: (link) => {
      window.clipboardData.setData('Text', `${window.location.host}/${link}`);
      alert('复制成功');
    },
    toShareLink: (link) => {
      dispatch(push(link));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileList)
