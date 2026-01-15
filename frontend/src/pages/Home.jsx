import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getStats, getSubmissions } from '../services/submissionService';
import { CodingQuote, StatsCard, RecentSubmissions } from '../components/home';

function Home() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ solved: 0, submissions: 0, accuracy: '0%' });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user stats
        const statsData = await getStats();
        
        // Calculate accuracy
        const accuracy = statsData.totalSubmissions > 0
          ? Math.round((statsData.acceptedSubmissions / statsData.totalSubmissions) * 100)
          : 0;

        setStats({
          solved: statsData.solvedProblems || 0,
          submissions: statsData.totalSubmissions || 0,
          accuracy: `${accuracy}%`,
        });

        // Fetch recent submissions (last 5)
        const submissionsData = await getSubmissions({ page: 0, size: 5 });
        
        // Handle both array and paginated response
        const submissions = Array.isArray(submissionsData) 
          ? submissionsData 
          : submissionsData.content || [];
        
        setRecentSubmissions(submissions);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-900">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Coding Quote */}
        <CodingQuote />

        {/* Stats Grid */}
        {isAuthenticated() && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <StatsCard 
                title="Problems Solved" 
                value={loading ? '—' : stats.solved}
                icon="✓"
              />
              <StatsCard 
                title="Total Submissions" 
                value={loading ? '—' : stats.submissions}
                icon="📝"
              />
              <StatsCard 
                title="Accuracy" 
                value={loading ? '—' : stats.accuracy}
                icon="🎯"
              />
            </div>

            {/* Recent Submissions */}
            <RecentSubmissions 
              submissions={recentSubmissions} 
              loading={loading}
            />
          </>
        )}

        {/* Welcome message for non-authenticated users */}
        {!isAuthenticated() && (
          <div className="mt-8 text-center">
            <h2 className="text-3xl font-bold text-slate-50 font-sans mb-4">
              Welcome to LocalCode
            </h2>
            <p className="text-xl text-slate-300 font-sans mb-8">
              Practice coding problems in your self-hosted environment
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="/login" 
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors"
              >
                Sign In
              </a>
              <a 
                href="/register" 
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-md transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
