import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';

/**
 * RecentSubmissions component
 * Displays a list of recent submissions with status badges
 */
function RecentSubmissions({ submissions = [], loading = false }) {
  if (loading) {
    return (
      <Card className="mt-8">
        <h2 className="text-2xl font-bold text-slate-50 font-sans mb-6">
          Recent Submissions
        </h2>
        <div className="text-center py-8 text-slate-400">
          Loading submissions...
        </div>
      </Card>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <Card className="mt-8">
        <h2 className="text-2xl font-bold text-slate-50 font-sans mb-6">
          Recent Submissions
        </h2>
        <div className="text-center py-8 text-slate-400">
          No submissions yet. Start solving problems to see your progress!
        </div>
        <div className="text-center mt-4">
          <Link 
            to="/problems" 
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            Browse Problems →
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <h2 className="text-2xl font-bold text-slate-50 font-sans mb-6">
        Recent Submissions
      </h2>
      <div className="space-y-3">
        {submissions.map((submission) => (
          <Link
            key={submission.id}
            to={`/submissions/${submission.id}`}
            className="block p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-amber-500 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-slate-100 font-medium font-sans mb-1">
                  {submission.problemTitle || `Problem #${submission.problemId}`}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <span className="font-mono">{submission.language}</span>
                  <span>•</span>
                  <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                  {submission.runtime && (
                    <>
                      <span>•</span>
                      <span>{submission.runtime}ms</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={submission.status} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {submissions.length >= 5 && (
        <div className="text-center mt-6">
          <Link 
            to="/submissions" 
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            View All Submissions →
          </Link>
        </div>
      )}
    </Card>
  );
}

RecentSubmissions.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      problemId: PropTypes.number.isRequired,
      problemTitle: PropTypes.string,
      status: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
      submittedAt: PropTypes.string.isRequired,
      runtime: PropTypes.number,
    })
  ),
  loading: PropTypes.bool,
};

export default RecentSubmissions;
