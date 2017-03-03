import React, { Component, PropTypes } from 'react'
import Uploader from '../containers/VisibleUploader.jsx'
import VisibleFileList from '../containers/VisibleFileList.jsx'
import '../sass/file-transferer.sass'
// class FileTransferer extends Component {
//   render() {
//     return (
//       <div>
//         <Uploader />
//         <FileList />
//       </div>
//       );
//   }
// }

const FileTransferer = () => (
  <div className="file-transferer">
    <Uploader />
    <VisibleFileList />
  </div>
);

export default FileTransferer
