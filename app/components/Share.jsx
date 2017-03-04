import React, {Component, PropTypes} from 'react'
import { Panel, Grid, Row, Col, Button } from 'react-bootstrap'

import '../sass/share.sass'

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
    let { filename, createAt, download, size, id, expire_time } = this.props;
    let handleClick = (e) => {
      download(id, filename);
    };
    return (
      <Panel className="share-info">
        <Row>
          <Col xs={6} md={6}>{ filename }</Col>
          <Col xs={3} md={3} xsOffset={3}>
            <Button onClick={ handleClick }>下载</Button>
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
    );
  }
}

export default Share
