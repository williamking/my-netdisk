import React, {Component, PropTypes} from 'react'
import { STOPED, UNSTARTED, PROCESSING, COMPLETED } from '../actions/actions.js'
import Panel from 'react-bootstrap/lib/Alert'
import Label from 'react-bootstrap/lib/Label'
import Form from 'react-bootstrap/lib/Form'
import Col from 'react-bootstrap/lib/Col'
import Button from 'react-bootstrap/lib/Button'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import HelpBlock from 'react-bootstrap/lib/HelpBlock'

import '../sass/Auth.sass'

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <Col componentClass={ControlLabel} sm={2}>{label}</Col>
      <Col sm={10}><FormControl {...props} /></Col>
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

class Auth extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { checkLogin } = this.props;
    checkLogin();
  }

  render() {
    let { onUsernameChange, onPasswordChange, login, logout, username, password } = this.props;
    let handleClick = (e) => {
      let { username, password } = this.props;
      e.preventDefault();
      login(username, password);
    };
    return (
      <div className='auth-wrapper'>
        <Panel className='authentication'>
          <Form horizontal>
            <h1 className="title">登录我的网盘</h1>
            <FieldGroup
              id="username"
              label="用户名"
              value={ username }
              placeholder="输入用户名登录"
              onChange={ onUsernameChange }
            />
            <FieldGroup
              id="password"
              type="password"
              label="密码"
              value={ password }
              placeholder="请输入密码"
              onChange={ onPasswordChange }
            />
            <FormGroup>
              <Col smOffset={2} sm={10} >
                <Button type='submit' className="pull-right" onClick={ handleClick }>
                  登录
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Panel>
      </div>
    );
  }
}

export default Auth
