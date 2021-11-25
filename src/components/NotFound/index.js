import './index.css'
import Header from '../Header'

const NotFound = () => (
  <>
    <Header />
    <div className="notfound-pro">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1>Page Not Found</h1>
      <p>we’re sorry, the page you requested could not be found</p>
    </div>
  </>
)

export default NotFound
