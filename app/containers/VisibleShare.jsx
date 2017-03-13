import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Share from '../components/Share.jsx'
import { getShareFile, closePlayer, openPlayer, canvasPlay, canvasPause,
  canvasShow, canvasHide, toFilter } from '../actions/actions'
import fetch from 'isomorphic-fetch'

const mediaTypes = {
  "mp3": "audio/mpeg",
  "mp4": "video/mp4",
  "ogv": "video/ogg",
  "mkv": "video/mkv",
  "webm": "video/webm"
};

function mapStateToProps(state, ownProps) {
  return {
    filename: state.shareFile.filename,
    size: state.shareFile.size,
    mediaType: mediaType(state.shareFile.filename),
    createAt: state.shareFile.createAt,
    id: ownProps.params.id,
    expire_time: state.shareFile.expire_time,
    src: `/api/shares/download?id=${ownProps.params.id}&mode=stream`,
    playerShow: state.player.show,
    canvasState: state.player.canvasState,
    filter: state.player.filter
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadInfo: (id) => {
      dispatch(getShareFile(id));
    },
    download: (id, filename) => {
      let a = document.createElement('a');
      a.href = `/api/shares/download?id=${id}`;
      a.download = filename;
      a.click();
    },
    handleShow: () => {
      dispatch(openPlayer());
    },
    handleHide: () => {
      dispatch(closePlayer());
    },
    handlePlay: (canvas, video) => {
      dispatch(canvasPlay(canvas, video));
    },
    handlePause: () => {
      dispatch(canvasPause());
    },
    handleCanvasShow: () => {
      dispatch(canvasShow());
    },
    handleCanvasHide: () => {
      dispatch(canvasHide());
    },
    handleToFilter: (type) => {
      return () => {
        dispatch(toFilter(type));
      };
    }
  };
}

function mediaType(filename) {
  if (!filename) return null;
  let arr = filename.split('.');
  let extName = arr[arr.length - 1];
  return mediaTypes[extName];
}

export default connect(mapStateToProps, mapDispatchToProps)(Share)
