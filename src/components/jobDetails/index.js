import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn, MdLocalPostOffice} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'
import FailureView from '../FailureView'

const apiStatusConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const getSimilarJobsUp = similar => {
  const upSim = similar.map(eachJob => ({
    companyLogoUrl: eachJob.company_logo_url,
    employmentType: eachJob.employment_type,
    id: eachJob.id,
    jobDescription: eachJob.job_description,
    location: eachJob.location,
    rating: eachJob.rating,
    title: eachJob.title,
  }))

  return upSim
}

const getData = job => {
  const upData = {
    companyLogoUrl: job.company_logo_url,
    employmentType: job.employment_type,
    id: job.id,
    jobDescription: job.job_description,
    companyWebsiteUrl: job.company_website_url,
    location: job.location,
    packagePerAnnum: job.package_per_annum,
    rating: job.rating,
    title: job.title,
  }

  return upData
}
const getUpSkills = skills => {
  let upData = []
  upData = skills.map(eachSkill => ({
    imageUrl: eachSkill.image_url,
    name: eachSkill.name,
  }))
  return upData
}

const getLifeAt = life => ({
  imageUrl: life.image_url,
  description: life.description,
})

class JobDetails extends Component {
  state = {
    jobDetailsData: '',
    similarJobs: [],
    skills: [],
    lifeAt: {},
    apiStatus: apiStatusConstants.loading,
  }

  componentDidMount() {
    console.log('yes')
    this.getSpecificJobDetails()
  }

  getSpecificJobDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const upFetechedData = {
        jobDetails: fetchedData.job_details,
        similarJobs: fetchedData.similar_jobs,
      }
      const {jobDetails, similarJobs} = upFetechedData
      const {skills} = jobDetails
      const lifeAtCompany = jobDetails.life_at_company

      const upSimilar = getSimilarJobsUp(similarJobs)
      const updatedJobDetails = getData(jobDetails)
      const UpSkills = getUpSkills(skills)
      const lifeAt = getLifeAt(lifeAtCompany)
      console.log(lifeAt)

      this.setState({
        jobDetailsData: updatedJobDetails,
        similarJobs: upSimilar,
        skills: UpSkills,
        apiStatus: apiStatusConstants.success,
        lifeAt,
      })
    } else {
      console.log('failure')
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  jobProfile = () => {
    const {skills, jobDetailsData, lifeAt, apiStatus} = this.state

    const {
      title,
      companyLogoUrl,
      rating,
      packagePerAnnum,
      employmentType,
      location,
      jobDescription,
      companyWebsiteUrl,
    } = jobDetailsData

    const {imageUrl, name} = skills

    const {description} = lifeAt

    return (
      <>
        <div className="job-logo-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="logo-pro"
          />
          <div className="job-name-rating">
            <h1 className="job-para-title">{title}</h1>
            <div className="rating-contianer">
              <BsStarFill className="star-fill-color" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-location-salary">
          <div className="job-location-top">
            <p className="job-location-container">
              <MdLocationOn className="job-location-icon" /> {location}
            </p>

            <p className="job-location-container">
              <MdLocalPostOffice className="job-location-icon" />
              {employmentType}
            </p>
          </div>
          <p className="job-package-pro">{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="description-link">
          <h1 className="name-head">Description</h1>
          <a href={companyWebsiteUrl} className="anchor-link">
            Visit <FiExternalLink />
          </a>
        </div>
        <div className="job-description-container">
          <p className="job-para">{jobDescription}</p>
        </div>
        <h1 className="name-head">Skills</h1>
        <ul className="skills-container">
          {skills.map(eachItem => (
            <li id={eachItem.name} className="skills-item">
              <img
                src={eachItem.imageUrl}
                alt={eachItem.name}
                className="skill-image"
              />
              <p className="skill-para">{eachItem.name}</p>
            </li>
          ))}
        </ul>
        <h1>Life at Company</h1>
        <div className="life-container">
          <p className="para-des">{description}</p>
          <img
            src={lifeAt.imageUrl}
            alt="life at company"
            className="life-image"
          />
        </div>
      </>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    const element = similarJobs.map(eachItem => {
      const {
        companyLogoUrl,
        title,
        rating,
        location,
        employmentType,
        jobDescription,
      } = eachItem
      return (
        <>
          <li className="similar-list-item ">
            <div className="logo-cont">
              <img
                src={companyLogoUrl}
                alt="similar job company logo"
                className="logo-pro"
              />
              <div className="job-name-rating">
                <h1 className="job-para-title">{title}</h1>
                <div className="rating-contianer">
                  <BsStarFill className="star-fill-color" />
                  <p>{rating}</p>
                </div>
              </div>
            </div>
            <div className="simi-description-container">
              <h1 className="simi-des">Description</h1>

              <p className="simi-para">{jobDescription}</p>
            </div>
            <div className="job-top">
              <p className="job-location">
                <MdLocationOn className="simi-location-icon" /> {location}
              </p>

              <p className="job-location">
                <MdLocalPostOffice className="simi-location-icon" />
                {employmentType}
              </p>
            </div>
          </li>
        </>
      )
    })

    return element
  }

  renderLoading = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getSpecificJobDetails()
  }

  renderItems = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoading()
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return <FailureView onClickRetry={this.onClickRetry} />
      default:
        return null
    }
  }

  renderSuccess = () => (
    <>
      <div className="job-details">{this.jobProfile()}</div>
      <div className="similar-container">
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-sugesstion">{this.renderSimilarJobs()}</ul>
      </div>
    </>
  )

  render() {
    return (
      <div className="hello-bg">
        <Header />
        <div className="job-bg">{this.renderItems()}</div>
      </div>
    )
  }
}

export default JobDetails
