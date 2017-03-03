import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addFile, deleteFile, uploadFile } from '../actions/actions'

const mapStatetoProps = (state) => {
  return {
    files: state.files
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(FileTransferer)
