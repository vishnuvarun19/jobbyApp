import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Header from '../Header'

class Home extends Component {
  onClickFindJobs = () => {
    const {history} = this.props
    history.replace('/jobs')
  }

  render() {
    return (
      <div className="home-card-pro">
        <Header />
        <div className="homeDescription-container">
          <h1 className="para-heading">
            Find The Job That
            <br />
            Fits Your Life
          </h1>
          <p className="para-info">
            Millions of people are searching for jobs, salary
            information,company reviews. Find the job that fits your abilities
            and potential
          </p>
          <Link to="/jobs">
            <button type="button" className="find-jobs-button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home
