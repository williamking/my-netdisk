import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateUsername, updatePassword, login } from '../actions/actions'
import fetch from 'isomorphic-fetch'
import Auth from '../components/Auth.jsx'
import { push } from 'react-router-redux'

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    password: state.auth.password
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUsernameChange: (e) => {
      dispatch(updateUsername(e.target.value));
    },
    onPasswordChange: (e) => {
      dispatch(updatePassword(e.target.value));
    },
    checkLogin: function () {
      fetch('/api/auths', {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(json => {
          if (json.status == 'OK') {
            let { online } = json;
            if (online) {
              dispatch(login());
              dispatch(push('netdisk'));
            }
          } else {
            alert(`服务器错误，错误码${json.status}`);
            console.log(json.err);
          }
        });
    },
    login: (username, password) => {
      fetch('/api/auths', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password
        })
      })
        .then(res => res.json())
        .then(json => {
          if (json.status == 'OK') {
            dispatch(login());
            dispatch(push('/netdisk'));
          } else {
            alert(`服务器错误，错误码${json.status}`);
            console.log(json.err);
          }
        });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
