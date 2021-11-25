import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', isLoginFailed: false, errorMsg: ''}

  onSubmitForm = async event => {
    event.preventDefault()

    const {history} = this.props
    const {username, password} = this.state

    const userDetails = {
      username,
      password,
    }

    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const jwtToken = fetchedData.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      history.replace('/')
    } else {
      const fetchedData = await response.json()

      const message = fetchedData.error_msg
      this.setState({isLoginFailed: true, errorMsg: message})
      console.log(fetchedData.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, isLoginFailed, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-image"
          />
          <form className="form-card" onSubmit={this.onSubmitForm}>
            <div className="input-container">
              <label htmlFor="username">USERNAME</label>
              <input
                id="username"
                value={username}
                type="text"
                placeholder="username"
                className="input-pro"
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="input-container">
              <label htmlFor="password">PASSWORD</label>
              <input
                id="password"
                type="password"
                value={password}
                placeholder="password"
                className="input-pro"
                onChange={this.onChangePassword}
              />
            </div>
            <button type="submit" className="button-login">
              Login
            </button>
            {isLoginFailed ? (
              <p className="error-message-pro">{errorMsg}</p>
            ) : null}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
