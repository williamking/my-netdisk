import React, { Component, PropTypes } from 'react'
import { Button, Grid, Col, Row } from 'react-bootstrap'

import '../sass/uploader.sass'

class Uploader extends Component {
  render() {
    let {onAddClick, onFileChange, filename, logout} = this.props;
    return (<div className="uploader">
      <Grid>
        <Row>
          <form id="files" ref="fileForm">
            <input id="file-to-add" name="newFile" type="file"
              onChange={ onFileChange } className="invisible"></input>
            <Col xs={3} md={3}>
              <Button bsStyle="info" className="choose-file">
                <label htmlFor="file-to-add">选择文件</label>
              </Button>
            </Col>
            <Col xs={6} md={6} className="file-info">
              <div className="filename">{ filename }</div>
            </Col>
            <Col xs={3} md={3}>
              <Button bsStyle="primary" className="addFile" onClick = {e => {
                e.preventDefault(); onAddClick(this.refs.fileForm)
              }}>添加文件</Button>
            </Col>
          </form>
        </Row>
        <Button className="logout" bsStyle="danger"
          onClick = { logout }>退出网盘</Button>
      </Grid>
    </div>);
  }
}
;

export default Uploader
