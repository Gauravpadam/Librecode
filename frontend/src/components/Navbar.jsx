import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './common/Button';

/**
 * Navbar component with new dark theme and amber accents
 */
function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-850 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <Link 
              to="/" 
              className="flex items-center text-xl font-bold text-amber-500 hover:text-amber-400 transition-colors"
            >
              LocalCode
            </Link>
            {isAuthenticated() && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                <Link
                  to="/problems"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Problems
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/submissions"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Submissions
                </Link>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                <span className="text-sm font-medium text-slate-300">
                  {user?.username}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="text-sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="text-sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
