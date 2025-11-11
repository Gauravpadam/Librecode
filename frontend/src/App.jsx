import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import SubmissionHistory from './pages/SubmissionHistory';
import SubmissionDetail from './pages/SubmissionDetail';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route 
              path="problems" 
              element={
                <ProtectedRoute>
                  <ProblemList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="problems/:id" 
              element={
                <ProtectedRoute>
                  <ProblemDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="submissions" 
              element={
                <ProtectedRoute>
                  <SubmissionHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="submissions/:id" 
              element={
                <ProtectedRoute>
                  <SubmissionDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
