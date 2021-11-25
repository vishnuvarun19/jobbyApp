import './index.css'
import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav>
      <ul className="nav-pro">
        <Link to="/" className="header-links-container">
          <li>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </li>
        </Link>

        <li className="header-links-container">
          <Link to="/" className="link-pro">
            <p>Home</p>
          </Link>
          <Link to="/jobs" className="link-pro">
            <p>Jobs</p>
          </Link>
        </li>
        <li className="list-item-pro">
          <button
            type="button"
            onClick={onClickLogout}
            className="logout-button"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
