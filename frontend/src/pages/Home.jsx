import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getStats } from "../services/submissionService";
import { CodingQuote, StatsCard, RecentSubmissions } from "../components/home";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";

const FAKE_HOME_STATS = {
  solvedProblems: 18,
  totalSubmissions: 42,
  accuracy: 73,
  recentSubmissions: [
    {
      id: 1,
      problemTitle: "Two Sum",
      status: "accepted",
      language: "javascript",
      submittedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
      id: 2,
      problemTitle: "Reverse Linked List",
      status: "wrong_answer",
      language: "cpp",
      submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: 3,
      problemTitle: "Binary Tree Inorder Traversal",
      status: "time_limit_exceeded",
      language: "python",
      submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
};

function Home() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    solved: 0,
    submissions: 0,
    accuracy: "0%",
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        let statsData;

        if (import.meta.env.VITE_USE_FAKE_HOME_STATS === "true") {
          await new Promise((r) => setTimeout(r, 300)); // simulate API
          statsData = FAKE_HOME_STATS;
        } else {
          // Fetch user stats (now includes recent submissions)
          statsData = await getStats();
        }

        setStats({
          solved: statsData.solvedProblems || 0,
          submissions: statsData.totalSubmissions || 0,
          accuracy: statsData.accuracy
            ? `${Math.round(statsData.accuracy)}%`
            : "0%",
        });

        // Use recent submissions from stats response
        setRecentSubmissions(statsData.recentSubmissions || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
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
                title="Problems Solved"
                value={loading ? "—" : stats.solved}
                icon="✓"
              <StatsCard
              />
              <StatsCard
                title="Total Submissions"
                value={loading ? "—" : stats.submissions}
                icon="📝"
              />
              <StatsCard
                title="Accuracy"
                value={loading ? "—" : stats.accuracy}
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
              <Link to="/register">
                <Button variant="primary" className="text-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
