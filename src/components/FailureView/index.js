import './index.css'

const FailureView = props => {
  const {onClickRetry} = props

  const onClickButton = () => {
    onClickRetry()
  }

  return (
    <div className="fail-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="fail-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="profile-button" onClick={onClickButton}>
        Retry
      </button>
    </div>
  )
}

export default FailureView
