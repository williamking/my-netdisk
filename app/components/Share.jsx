import React, {Component, PropTypes} from 'react'
import { Panel, Grid, Row, Col, Button, Modal } from 'react-bootstrap'

import '../sass/share.sass'

function createPlayer(src, showPlayer, type, handleHide) {
  return (
    <Modal show={ showPlayer } onHide={ handleHide } backdrop={ false }>
      <Modal.Body>
        <Modal.Header closeButton>
          在线播放
        </Modal.Header>
        <video width="100%" height="400px" controls="controls">
          <source src={ src } type={ type }></source>
        </video>
      </Modal.Body>
    </Modal>
  );
}

class Share extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { id } = this.props;
    this.props.loadInfo(id);
  }

  componentDidUpdate() {
    let { id } = this.props;
    this.props.loadInfo(id);
  }

  render() {
    let { filename, createAt, download, size, id, expire_time, src, mediaType,
      playerShow, handleShow, handleHide } = this.props;
    let handleClick = (e) => {
      download(id, filename);
    };
    let player, playButton;
    if (mediaType) {
      player = createPlayer(src, playerShow, mediaType, handleHide);
      playButton = (
        <Button onClick={ handleShow }>在线观看</Button>
      );
    }
    let videoSrc = 'http://localhost:3000/api/files/58c0ffc0e08886335b7c672a?mode=stream';
    return (
      <div className="share-wrapper">
        <Panel className="share-info">
          <Row>
            <Col xs={4} md={4}>{ filename }</Col>
            <Col xs={4} md={4}>
              <Button onClick={ handleClick }>下载</Button>
            </Col>
            <Col xs={4} md={4}>
              {playButton}
            </Col>
          </Row>
          <Row>
            <Col xs={4} md={4}>
              文件大小： { size }
            </Col>
            <Col xs={4} md={4}>
              分享到期时间： { expire_time }
            </Col>
            <Col xs={4} md={4}>
              创建时间： { createAt }
            </Col>
          </Row>
        </Panel>
        { player }
      </div>
    );
  }
}

export default Share
