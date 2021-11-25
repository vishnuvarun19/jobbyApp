import './index.css'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch, BsStarFill} from 'react-icons/bs'
import {MdLocationOn, MdLocalPostOffice} from 'react-icons/md'
import Loader from 'react-loader-spinner'

import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profile: '',
    isProfileLoaded: true,
    searchValue: '',
    salaryRadio: '',
    categoryCheck: [],
    isJobLoading: apiStatusConstants.loading,
    jobsList: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
    console.log('compocompleted')
  }

  getJobsDetails = async () => {
    console.log('inLoading')
    this.setState({isJobLoading: apiStatusConstants.loading})
    const {searchValue, salaryRadio, categoryCheck} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const getUpdatedData = jobs => {
      const uJobs = jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      return uJobs
    }

    const stringCategory = categoryCheck.join()

    const url = `https://apis.ccbp.in/jobs?employment_type=${stringCategory}&minimum_package=${salaryRadio}&search=${searchValue}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      console.log('job success')
      const fetchedData = await response.json()
      const {jobs} = fetchedData
      const updatedData = getUpdatedData(jobs)
      this.setState({
        jobsList: updatedData,
        isJobLoading: apiStatusConstants.success,
      })
    } else {
      console.log('failure')
      this.setState({isJobLoading: apiStatusConstants.failure})
    }
  }

  renderProfileData = () => {
    const {profile, isProfileLoaded} = this.state
    const {name, profileImageUrl, shortBio} = profile

    const onClickRetry = () => {
      this.getProfileDetails()
    }

    return (
      <div className="profile-pro">
        {isProfileLoaded ? (
          <div className="profile-pro">
            <img
              src={profileImageUrl}
              alt="profile"
              className="profile-image"
            />
            <h1 className="profile-heading">{name}</h1>
            <p className="profile-para">{shortBio}</p>
          </div>
        ) : (
          <div className="profile-button-container">
            <button
              type="button"
              className="profile-button"
              onClick={onClickRetry}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    )
  }

  renderEmploymentTypesList = () => (
    <ul className="employee-list">
      <h1 className="list-heading">Type of Employment</h1>
      {employmentTypesList.map(eachItem => {
        const onClickCheckBox = event => {
          const {categoryCheck} = this.state
          const valueCheck = event.target.value

          if (valueCheck) {
            categoryCheck.push(event.target.value)
            this.setState({categoryCheck}, this.getJobsDetails)
          } else {
            const updatedCategoryList = categoryCheck.filter(
              each => each !== valueCheck,
            )

            this.setState(
              {categoryCheck: updatedCategoryList},
              this.getJobsDetails,
            )
          }
        }

        return (
          <li className="employee-list-item">
            <input
              id={eachItem.employmentTypeId}
              className="input-checkbox"
              type="checkbox"
              value={eachItem.employmentTypeId}
              onClick={onClickCheckBox}
            />
            <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
          </li>
        )
      })}
    </ul>
  )

  renderSalaryRange = () => (
    <ul className="employee-list">
      <h1 className="list-heading">Salary Range</h1>
      {salaryRangesList.map(eachItem => {
        const onClickRadio = () => {
          this.setState(
            {salaryRadio: eachItem.salaryRangeId},
            this.getJobsDetails,
          )
        }
        return (
          <li onClick={onClickRadio}>
            <input
              id={eachItem.salaryRangeId}
              type="radio"
              value={eachItem.salaryRangeId}
              className="input-checkbox"
              name="salary"
            />
            <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
          </li>
        )
      })}
    </ul>
  )

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const fetchedProfile = await response.json()
      const profileDetails = fetchedProfile.profile_details

      const updatedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }

      this.setState({profile: updatedData})
    } else {
      this.setState({isProfileLoaded: false})
    }
  }

  renderSearchElement = () => {
    const onChangeSearch = event => {
      this.setState({searchValue: event.target.value})
    }

    const onClickSearch = () => {
      this.getJobsDetails()
    }

    const {searchValue} = this.state

    return (
      <div className="input-container-search">
        <input
          type="search"
          className="input-search"
          placeholder="Search"
          value={searchValue}
          onChange={onChangeSearch}
        />
        <button
          type="button"
          testid="searchButton"
          className="search-button"
          onClick={onClickSearch}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => {
    const onClickRetryJobs = () => {
      this.getJobsDetails()
    }
    return (
      <div className="fail-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button
          type="button"
          className="profile-button"
          onClick={onClickRetryJobs}
        >
          Retry
        </button>
      </div>
    )
  }

  renderSuccessView = () => {
    const {jobsList} = this.state

    const {length} = jobsList

    const isLengthGreaterThanZero = length > 0

    const element = isLengthGreaterThanZero ? (
      <ul className="job-list-container">
        {jobsList.map(eachJob => {
          const {
            companyLogoUrl,
            employmentType,
            id,
            jobDescription,
            location,
            packagePerAnnum,
            rating,
            title,
          } = eachJob
          return (
            <Link to={`/jobs/${id}`} className="link-class">
              <li id={id} className="job-list-item">
                <div className="logo-container">
                  <img
                    src={companyLogoUrl}
                    alt="company logo"
                    className="logo-pro"
                  />
                  <div className="job-name-rating">
                    <h1 className="para-title">{title}</h1>
                    <div className="rating-contianer">
                      <BsStarFill className="star-fill-color" />
                      <p>{rating}</p>
                    </div>
                  </div>
                </div>
                <div className="location-salary">
                  <div className="localtio-top">
                    <p className="location-container">
                      <MdLocationOn className="location-icon" /> {location}
                    </p>

                    <p className="location-container">
                      <MdLocalPostOffice className="location-icon" />{' '}
                      {employmentType}
                    </p>
                  </div>
                  <p className="package-pro">{packagePerAnnum}</p>
                </div>
                <hr />
                <div className="description-container">
                  <h1 className="des-head">Description</h1>
                  <p>{jobDescription}</p>
                </div>
              </li>
            </Link>
          )
        })}
      </ul>
    ) : (
      <div className="nojobs-pro">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )

    return element
  }

  renderJobsList = () => {
    const {isJobLoading} = this.state
    console.log('rendering jobs list')
    console.log(isJobLoading)
    switch (isJobLoading) {
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-bg">
        <Header />
        <div className="job-bottom-section">
          <div className="bottom-one">
            {this.renderProfileData()}
            <hr />
            {this.renderEmploymentTypesList()}
            <hr />
            {this.renderSalaryRange()}
          </div>
          <div className="bottom-two">
            {this.renderSearchElement()}
            {this.renderJobsList()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
