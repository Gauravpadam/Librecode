-- LocalCode Database Seed Data
-- This SQL script can be used as an alternative to the Java-based seeder
-- Run this script manually if you prefer SQL-based seeding

-- Note: This script assumes the schema has already been created by Hibernate
-- Passwords are BCrypt hashed with 12 rounds (password: "password123" for users, "admin123" for admin)

-- ==================== USERS ====================

INSERT INTO users (username, email, password_hash, created_at, updated_at) VALUES
('testuser', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW7QevQzQv8S', NOW(), NOW()),
('johndoe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW7QevQzQv8S', NOW(), NOW()),
('admin', 'admin@example.com', '$2a$12$X4wh4eur16ba5tITVEpKLOWW9f7Zbn.MjPLBNhA8jUXMHvQ8t89F6', NOW(), NOW());

-- ==================== PROBLEMS ====================

-- Problem 1: Two Sum (Easy)
INSERT INTO problems (title, description, constraints, difficulty, time_limit_ms, memory_limit_mb, starter_code_java, starter_code_python, starter_code_javascript, created_at) VALUES
('Two Sum', 
'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

**Example 2:**
```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```',
'- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.',
'EASY', 2000, 256,
'class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}',
'def two_sum(nums, target):
    # Your code here
    pass',
'function twoSum(nums, target) {
    // Your code here
}',
NOW());

-- Problem 2: Reverse String (Easy)
INSERT INTO problems (title, description, constraints, difficulty, time_limit_ms, memory_limit_mb, starter_code_java, starter_code_python, starter_code_javascript, created_at) VALUES
('Reverse String',
'Write a function that reverses a string. The input string is given as an array of characters.

You must do this by modifying the input array in-place with O(1) extra memory.

**Example 1:**
```
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
```

**Example 2:**
```
Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]
```',
'- 1 <= s.length <= 10^5
- s[i] is a printable ascii character.',
'EASY', 2000, 256,
'class Solution {
    public void reverseString(char[] s) {
        // Your code here
    }
}',
'def reverse_string(s):
    # Your code here
    pass',
'function reverseString(s) {
    // Your code here
}',
NOW());

-- Problem 3: Palindrome Number (Easy)
INSERT INTO problems (title, description, constraints, difficulty, time_limit_ms, memory_limit_mb, starter_code_java, starter_code_python, starter_code_javascript, created_at) VALUES
('Palindrome Number',
'Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.

An integer is a palindrome when it reads the same backward as forward.

**Example 1:**
```
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.
```

**Example 2:**
```
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-.
```',
'- -2^31 <= x <= 2^31 - 1',
'EASY', 2000, 256,
'class Solution {
    public boolean isPalindrome(int x) {
        // Your code here
    }
}',
'def is_palindrome(x):
    # Your code here
    pass',
'function isPalindrome(x) {
    // Your code here
}',
NOW());

-- Add more problems as needed...
-- (For brevity, showing structure for first 3 problems)

-- ==================== TEST CASES ====================

-- Test cases for Problem 1: Two Sum
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, order_index) VALUES
(1, '[2,7,11,15]
9', '[0,1]', true, 0),
(1, '[3,2,4]
6', '[1,2]', true, 1),
(1, '[3,3]
6', '[0,1]', false, 2),
(1, '[1,5,3,7,9]
12', '[2,4]', false, 3);

-- Test cases for Problem 2: Reverse String
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, order_index) VALUES
(2, '["h","e","l","l","o"]', '["o","l","l","e","h"]', true, 0),
(2, '["H","a","n","n","a","h"]', '["h","a","n","n","a","H"]', true, 1),
(2, '["A"]', '["A"]', false, 2),
(2, '["a","b"]', '["b","a"]', false, 3);

-- Test cases for Problem 3: Palindrome Number
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, order_index) VALUES
(3, '121', 'true', true, 0),
(3, '-121', 'false', true, 1),
(3, '10', 'false', false, 2),
(3, '0', 'true', false, 3),
(3, '12321', 'true', false, 4);

-- ==================== VERIFICATION QUERIES ====================

-- Uncomment to verify the seeded data:

-- SELECT COUNT(*) as user_count FROM users;
-- SELECT COUNT(*) as problem_count FROM problems;
-- SELECT difficulty, COUNT(*) as count FROM problems GROUP BY difficulty;
-- SELECT p.title, COUNT(tc.id) as test_case_count 
-- FROM problems p 
-- LEFT JOIN test_cases tc ON p.id = tc.problem_id 
-- GROUP BY p.id, p.title;
