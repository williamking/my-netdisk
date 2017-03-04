import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Share from '../components/Share.jsx'
import { getShareFile } from '../actions/actions'
import fetch from 'isomorphic-fetch'

function mapStateToProps(state, ownProps) {
  return {
    filename: state.shareFile.filename,
    size: state.shareFile.size,
    createAt: state.shareFile.createAt,
    id: ownProps.params.id,
    expire_time: state.shareFile.expire_time
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
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Share)
