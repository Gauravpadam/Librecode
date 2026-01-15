import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Layout component with slate background and new theme
 * Wraps all pages with consistent navigation and footer
 */
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-slate-850 border-t border-slate-700 text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2025 LocalCode. Self-hosted coding practice platform.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
