import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to LocalCode
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Practice coding problems in your self-hosted environment
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/problems" className="btn-primary text-lg px-8 py-3">
            Browse Problems
          </Link>
          <Link to="/register" className="btn-secondary text-lg px-8 py-3">
            Get Started
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-2">Practice Offline</h3>
          <p className="text-gray-600">
            Self-hosted platform for coding practice without internet dependency
          </p>
        </div>
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-2">Multiple Languages</h3>
          <p className="text-gray-600">
            Support for Java, Python, and JavaScript
          </p>
        </div>
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-600">
            Monitor your problem-solving journey and submissions
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
