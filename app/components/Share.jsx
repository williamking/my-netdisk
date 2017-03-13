import React, {Component, PropTypes} from 'react'
import { Panel, Grid, Row, Col, Button, Modal, DropdownButton, MenuItem } from 'react-bootstrap'
import { TO_GREY, TO_LAPLACE, TO_NORMAL } from '../actions/actions.js'

import '../sass/share.sass'

function createPlayer(ctx, src, showPlayer, type, handleHide) {
  let { handlePlay, handlePause, canvasState, flushCanvas,
    handleCanvasShow, handleCanvasHide, handleToFilter } = ctx.props;
  let play = (e) => {
    if (canvasState == 'HIDED') return;
    handlePlay(ctx.canvas, ctx.video);
  };
  let pause = (e) => {
    if (canvasState == 'HIDED') return;
    handlePause();
  };

  let canvasVideo;
  if (canvasState != 'HIDED') canvasVideo = (
    <canvas className="video" ref={e => ctx.canvas = e}></canvas>
  );
  else canvasVideo = (<div></div>);

  let acccessButton;
  if (canvasState != 'HIDED') {
    acccessButton = (
      <div>
        <DropdownButton dropup bsStyle="info" title="选择滤镜" id="filters">
          <MenuItem eventKey="0" onClick={ handleToFilter(TO_NORMAL) }>无</MenuItem>
          <MenuItem eventKey="1" onClick={ handleToFilter(TO_GREY) }>黑白</MenuItem>
          <MenuItem eventKey="2" onClick={ handleToFilter(TO_LAPLACE) }>浮雕</MenuItem>
        </DropdownButton>
        <Button onClick={ handleCanvasHide } className="pull-right">隐藏canvas</Button>
      </div>
    );
  } else {
    acccessButton = (
      <Button bsStyle="primary" onClick={ handleCanvasShow } className="pull-right">显示canvas</Button>
    );
  }

  return (
    <Modal show={ showPlayer } onHide={ handleHide }
      backdrop={ false } onPlay={ play } onPause={ pause }>
      <Modal.Body>
        <Modal.Header closeButton>
          在线播放
        </Modal.Header>
        <video width="100%" className="video" id="video"
          controls="controls" ref={e => {ctx.video = e}}>
          <source src={ src } type={ type }></source>
        </video>
        { canvasVideo }
        { acccessButton }
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
      player = createPlayer(this, src, playerShow, mediaType, handleHide);
      playButton = (
        <Button onClick={ handleShow }>在线观看</Button>
      );
    }
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
