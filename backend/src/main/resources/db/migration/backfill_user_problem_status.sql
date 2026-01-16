-- Backfill UserProblemStatus from existing submissions
-- Run this once after creating the user_problem_status table

-- Insert SOLVED status for all problems with accepted submissions
INSERT INTO user_problem_status (user_id, problem_id, status, last_attempted)
SELECT DISTINCT 
    s.user_id,
    s.problem_id,
    'SOLVED',
    MAX(s.submitted_at)
FROM submissions s
WHERE s.status = 'ACCEPTED'
GROUP BY s.user_id, s.problem_id
ON CONFLICT (user_id, problem_id) DO NOTHING;

-- Insert ATTEMPTED status for problems with submissions but no accepted ones
INSERT INTO user_problem_status (user_id, problem_id, status, last_attempted)
SELECT DISTINCT 
    s.user_id,
    s.problem_id,
    'ATTEMPTED',
    MAX(s.submitted_at)
FROM submissions s
WHERE NOT EXISTS (
    SELECT 1 
    FROM submissions s2 
    WHERE s2.user_id = s.user_id 
    AND s2.problem_id = s.problem_id 
    AND s2.status = 'ACCEPTED'
)
GROUP BY s.user_id, s.problem_id
ON CONFLICT (user_id, problem_id) DO NOTHING;
