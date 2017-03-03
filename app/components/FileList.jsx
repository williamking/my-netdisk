import React, {Component, PropTypes} from 'react'
import { STOPED, UNSTARTED, PROCESSING, COMPLETED } from '../actions/actions.js'
import { Table, Button, DropdownButton, MenuItem, Modal} from 'react-bootstrap'

import '../sass/filelist.sass'

function getAccessButton(files, index, onStartSendFile, onContinueSendFile,
  onPauseSendFile, downloadFile, shareFile) {
  switch (files[index].status) {
    case STOPED:
      return (
        <Button  bsStyle="primary" onClick={ onContinueSendFile(index) }>
          Continue
        </Button>
      );
    case UNSTARTED:
      return (
        <Button bsStyle="primary" onClick={ onContinueSendFile(index) }>
          Upload
        </Button>
      );
    case PROCESSING:
      return (<Button onClick={ onPauseSendFile(index) }>
        Paused
      </Button>);
    case COMPLETED:
      return (
        <DropdownButton bsStyle="success" title="Access" id={`dropdown-${index}`}>
          <MenuItem eventKey="1" onClick={ downloadFile(files[index]) }>Download</MenuItem>
          <MenuItem eventKey="2" onClick={ shareFile(files[index]) }>Share</MenuItem>
        </DropdownButton>
      );
    default:
      throw Error('错误状态');
  }
}

class FileList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { onLoaded } = this.props;
    onLoaded();
  }

  render() {
    let {files, onStartSendFile, downloadFile, onContinueSendFile,
      shareFile, onLoaded, onPauseSendFile, shareLink,
      toShareLink, shareModalShow, closeModal, copyLink} = this.props;
    return (
      <div className="upload-list">
        <Modal show={ shareModalShow } onHide={ closeModal }>
          <Modal.Header>
            <Modal.Title>分享成功</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            分享成功，分享链接
            <span onClick={ e => toShareLink(shareLink) } className="share-link">
              { `${window.location.host}/${shareLink}` }
            </span>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ closeModal }>关闭</Button>
            <Button>复制该链接</Button>
          </Modal.Footer>
        </Modal>
        <Table responsive>
          <thead>
            <tr>
              <th className="filename">Filename</th>
              <th>Size</th>
              <th>Progress</th>
              <th>Speed</th>
              <th>Access</th>
              <th>Timeleft</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) =>
              <tr key={ index }>
                <td className="filename" title={file.filename} >{file.filename}</td>
                <td>{Math.round(file.size / 1024 / 1024 * 100) / 100 + 'MB'}</td>
                <td>{file.progress}</td>
                <td>{file.speed}</td>
                <td>{ getAccessButton(files, index, onStartSendFile,
                    onContinueSendFile, onPauseSendFile, downloadFile, shareFile) }</td>
                <td>{file.leftTime}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default FileList
