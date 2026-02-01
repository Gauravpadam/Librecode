package com.localcode.config;

import com.localcode.persistence.entity.*;
import com.localcode.persistence.repository.ProblemRepository;
import com.localcode.persistence.repository.TestCaseRepository;
import com.localcode.persistence.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

/**
 * Configuration class for seeding the database with initial data.
 * This seeder creates sample problems, test cases, and user accounts for testing.
 */
@Configuration
public class DataSeeder {
    
    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);
    
    @Bean
    CommandLineRunner initDatabase(
            ProblemRepository problemRepository,
            TestCaseRepository testCaseRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            // Only seed if database is empty
            if (problemRepository.count() > 0) {
                logger.info("Database already contains data. Skipping seeding.");
                return;
            }
            
            logger.info("Starting database seeding...");
            
            // Create sample users
            seedUsers(userRepository, passwordEncoder);
            
            // Create sample problems with test cases
            seedProblems(problemRepository, testCaseRepository);
            
            logger.info("Database seeding completed successfully!");
        };
    }
    
    private void seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        logger.info("Seeding users...");
        
        List<User> users = new ArrayList<>();
        
        // Test user 1
        User user1 = new User();
        user1.setUsername("testuser");
        user1.setEmail("test@example.com");
        user1.setPasswordHash(passwordEncoder.encode("password123"));
        users.add(user1);
        
        // Test user 2
        User user2 = new User();
        user2.setUsername("johndoe");
        user2.setEmail("john@example.com");
        user2.setPasswordHash(passwordEncoder.encode("password123"));
        users.add(user2);
        
        // Admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        users.add(admin);
        
        userRepository.saveAll(users);
        logger.info("Created {} users", users.size());
    }
    
    private void seedProblems(ProblemRepository problemRepository, TestCaseRepository testCaseRepository) {
        logger.info("Seeding problems...");
        
        List<Problem> problems = new ArrayList<>();
        
        // Problem 1: Two Sum (Easy)
        problems.add(createTwoSumProblem());
        
        // Problem 2: Reverse String (Easy)
        problems.add(createReverseStringProblem());
        
        // Problem 3: Palindrome Number (Easy)
        problems.add(createPalindromeNumberProblem());
        
        // Problem 4: FizzBuzz (Easy)
        problems.add(createFizzBuzzProblem());
        
        // Problem 5: Valid Parentheses (Easy)
        problems.add(createValidParenthesesProblem());
        
        // Problem 6: Maximum Subarray (Medium)
        problems.add(createMaximumSubarrayProblem());
        
        // Problem 7: Longest Substring Without Repeating Characters (Medium)
        problems.add(createLongestSubstringProblem());
        
        // Problem 8: Container With Most Water (Medium)
        problems.add(createContainerWithMostWaterProblem());
        
        // Problem 9: Binary Tree Level Order Traversal (Medium)
        problems.add(createBinaryTreeLevelOrderProblem());
        
        // Problem 10: Merge Intervals (Medium)
        problems.add(createMergeIntervalsProblem());
        
        // Problem 11: Word Search (Hard)
        problems.add(createWordSearchProblem());
        
        // Problem 12: Median of Two Sorted Arrays (Hard)
        problems.add(createMedianTwoSortedArraysProblem());
        
        // Problem 13: Trapping Rain Water (Hard)
        problems.add(createTrappingRainWaterProblem());
        
        // Save all problems
        problemRepository.saveAll(problems);
        logger.info("Created {} problems", problems.size());
    }

    
    // ==================== EASY PROBLEMS ====================
    
    private Problem createTwoSumProblem() {
        Problem problem = new Problem();
        problem.setTitle("Two Sum");
        problem.setDescription("Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n" +
                "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n" +
                "You can return the answer in any order.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: nums = [2,7,11,15], target = 9\n" +
                "Output: [0,1]\n" +
                "Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: nums = [3,2,4], target = 6\n" +
                "Output: [1,2]\n" +
                "```");
        problem.setConstraints("- 2 <= nums.length <= 10^4\n" +
                "- -10^9 <= nums[i] <= 10^9\n" +
                "- -10^9 <= target <= 10^9\n" +
                "- Only one valid answer exists.");
        problem.setDifficulty(Difficulty.EASY);
        problem.setTimeLimitMs(2000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def two_sum(nums, target):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function twoSum(nums, target) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "[2,7,11,15]\n9", "[0,1]", true, 0));
        testCases.add(new TestCase(problem, "[3,2,4]\n6", "[1,2]", true, 1));
        testCases.add(new TestCase(problem, "[3,3]\n6", "[0,1]", false, 2));
        testCases.add(new TestCase(problem, "[1,5,3,7,9]\n12", "[2,4]", false, 3));
        problem.setTestCases(testCases);
        
        return problem;
    }
    
    private Problem createReverseStringProblem() {
        Problem problem = new Problem();
        problem.setTitle("Reverse String");
        problem.setDescription("Write a function that reverses a string. The input string is given as an array of characters.\n\n" +
                "You must do this by modifying the input array in-place with O(1) extra memory.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\n" +
                "Output: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\n" +
                "Output: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n" +
                "```");
        problem.setConstraints("- 1 <= s.length <= 10^5\n" +
                "- s[i] is a printable ascii character.");
        problem.setDifficulty(Difficulty.EASY);
        problem.setTimeLimitMs(2000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public void reverseString(char[] s) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def reverse_string(s):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function reverseString(s) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "[\"h\",\"e\",\"l\",\"l\",\"o\"]", "[\"o\",\"l\",\"l\",\"e\",\"h\"]", true, 0));
        testCases.add(new TestCase(problem, "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]", true, 1));
        testCases.add(new TestCase(problem, "[\"A\"]", "[\"A\"]", false, 2));
        testCases.add(new TestCase(problem, "[\"a\",\"b\"]", "[\"b\",\"a\"]", false, 3));
        problem.setTestCases(testCases);
        
        return problem;
    }
    
    private Problem createPalindromeNumberProblem() {
        Problem problem = new Problem();
        problem.setTitle("Palindrome Number");
        problem.setDescription("Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\n" +
                "An integer is a palindrome when it reads the same backward as forward.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: x = 121\n" +
                "Output: true\n" +
                "Explanation: 121 reads as 121 from left to right and from right to left.\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: x = -121\n" +
                "Output: false\n" +
                "Explanation: From left to right, it reads -121. From right to left, it becomes 121-.\n" +
                "```");
        problem.setConstraints("- -2^31 <= x <= 2^31 - 1");
        problem.setDifficulty(Difficulty.EASY);
        problem.setTimeLimitMs(2000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public boolean isPalindrome(int x) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def is_palindrome(x):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function isPalindrome(x) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "121", "true", true, 0));
        testCases.add(new TestCase(problem, "-121", "false", true, 1));
        testCases.add(new TestCase(problem, "10", "false", false, 2));
        testCases.add(new TestCase(problem, "0", "true", false, 3));
        testCases.add(new TestCase(problem, "12321", "true", false, 4));
        problem.setTestCases(testCases);
        
        return problem;
    }
    
    private Problem createFizzBuzzProblem() {
        Problem problem = new Problem();
        problem.setTitle("FizzBuzz");
        problem.setDescription("Given an integer `n`, return a string array `answer` (1-indexed) where:\n\n" +
                "- `answer[i] == \"FizzBuzz\"` if `i` is divisible by 3 and 5.\n" +
                "- `answer[i] == \"Fizz\"` if `i` is divisible by 3.\n" +
                "- `answer[i] == \"Buzz\"` if `i` is divisible by 5.\n" +
                "- `answer[i] == i` (as a string) if none of the above conditions are true.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: n = 3\n" +
                "Output: [\"1\",\"2\",\"Fizz\"]\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: n = 5\n" +
                "Output: [\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]\n" +
                "```\n\n" +
                "**Example 3:**\n" +
                "```\n" +
                "Input: n = 15\n" +
                "Output: [\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]\n" +
                "```");
        problem.setConstraints("- 1 <= n <= 10^4");
        problem.setDifficulty(Difficulty.EASY);
        problem.setTimeLimitMs(2000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public List<String> fizzBuzz(int n) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def fizz_buzz(n):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function fizzBuzz(n) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "3", "[\"1\",\"2\",\"Fizz\"]", true, 0));
        testCases.add(new TestCase(problem, "5", "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]", true, 1));
        testCases.add(new TestCase(problem, "15", "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]", false, 2));
        testCases.add(new TestCase(problem, "1", "[\"1\"]", false, 3));
        problem.setTestCases(testCases);
        
        return problem;
    }
    
    private Problem createValidParenthesesProblem() {
        Problem problem = new Problem();
        problem.setTitle("Valid Parentheses");
        problem.setDescription("Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\n" +
                "An input string is valid if:\n" +
                "1. Open brackets must be closed by the same type of brackets.\n" +
                "2. Open brackets must be closed in the correct order.\n" +
                "3. Every close bracket has a corresponding open bracket of the same type.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: s = \"()\"\n" +
                "Output: true\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: s = \"()[]{}\"\n" +
                "Output: true\n" +
                "```\n\n" +
                "**Example 3:**\n" +
                "```\n" +
                "Input: s = \"(]\"\n" +
                "Output: false\n" +
                "```");
        problem.setConstraints("- 1 <= s.length <= 10^4\n" +
                "- s consists of parentheses only '()[]{}'.");
        problem.setDifficulty(Difficulty.EASY);
        problem.setTimeLimitMs(2000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def is_valid(s):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function isValid(s) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "()", "true", true, 0));
        testCases.add(new TestCase(problem, "()[]{}", "true", true, 1));
        testCases.add(new TestCase(problem, "(]", "false", true, 2));
        testCases.add(new TestCase(problem, "([)]", "false", false, 3));
        testCases.add(new TestCase(problem, "{[]}", "true", false, 4));
        problem.setTestCases(testCases);
        
        return problem;
    }

    
    // ==================== MEDIUM PROBLEMS ====================
    
    private Problem createMaximumSubarrayProblem() {
        Problem problem = new Problem();
        problem.setTitle("Maximum Subarray");
        problem.setDescription("Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\n" +
                "Output: 6\n" +
                "Explanation: The subarray [4,-1,2,1] has the largest sum 6.\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: nums = [1]\n" +
                "Output: 1\n" +
                "Explanation: The subarray [1] has the largest sum 1.\n" +
                "```\n\n" +
                "**Example 3:**\n" +
                "```\n" +
                "Input: nums = [5,4,-1,7,8]\n" +
                "Output: 23\n" +
                "Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.\n" +
                "```");
        problem.setConstraints("- 1 <= nums.length <= 10^5\n" +
                "- -10^4 <= nums[i] <= 10^4");
        problem.setDifficulty(Difficulty.MEDIUM);
        problem.setTimeLimitMs(3000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def max_sub_array(nums):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function maxSubArray(nums) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "[-2,1,-3,4,-1,2,1,-5,4]", "6", true, 0));
        testCases.add(new TestCase(problem, "[1]", "1", true, 1));
        testCases.add(new TestCase(problem, "[5,4,-1,7,8]", "23", true, 2));
        testCases.add(new TestCase(problem, "[-1]", "-1", false, 3));
        testCases.add(new TestCase(problem, "[-2,-1]", "-1", false, 4));
        problem.setTestCases(testCases);
        
        return problem;
    }
    
    private Problem createLongestSubstringProblem() {
        Problem problem = new Problem();
        problem.setTitle("Longest Substring Without Repeating Characters");
        problem.setDescription("Given a string `s`, find the length of the longest substring without repeating characters.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: s = \"abcabcbb\"\n" +
                "Output: 3\n" +
                "Explanation: The answer is \"abc\", with the length of 3.\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: s = \"bbbbb\"\n" +
                "Output: 1\n" +
                "Explanation: The answer is \"b\", with the length of 1.\n" +
                "```\n\n" +
                "**Example 3:**\n" +
                "```\n" +
                "Input: s = \"pwwkew\"\n" +
                "Output: 3\n" +
                "Explanation: The answer is \"wke\", with the length of 3.\n" +
                "```");
        problem.setConstraints("- 0 <= s.length <= 5 * 10^4\n" +
                "- s consists of English letters, digits, symbols and spaces.");
        problem.setDifficulty(Difficulty.MEDIUM);
        problem.setTimeLimitMs(3000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def length_of_longest_substring(s):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function lengthOfLongestSubstring(s) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "abcabcbb", "3", true, 0));
        testCases.add(new TestCase(problem, "bbbbb", "1", true, 1));
        testCases.add(new TestCase(problem, "pwwkew", "3", true, 2));
        testCases.add(new TestCase(problem, "", "0", false, 3));
        testCases.add(new TestCase(problem, "dvdf", "3", false, 4));
        problem.setTestCases(testCases);
        
        return problem;
    }
    
    private Problem createContainerWithMostWaterProblem() {
        Problem problem = new Problem();
        problem.setTitle("Container With Most Water");
        problem.setDescription("You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\n" +
                "Find two lines that together with the x-axis form a container, such that the container contains the most water.\n\n" +
                "Return the maximum amount of water a container can store.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: height = [1,8,6,2,5,4,8,3,7]\n" +
                "Output: 49\n" +
                "Explanation: The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. The max area is 49.\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: height = [1,1]\n" +
                "Output: 1\n" +
                "```");
        problem.setConstraints("- n == height.length\n" +
                "- 2 <= n <= 10^5\n" +
                "- 0 <= height[i] <= 10^4");
        problem.setDifficulty(Difficulty.MEDIUM);
        problem.setTimeLimitMs(3000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public int maxArea(int[] height) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def max_area(height):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function maxArea(height) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "[1,8,6,2,5,4,8,3,7]", "49", true, 0));
        testCases.add(new TestCase(problem, "[1,1]", "1", true, 1));
        testCases.add(new TestCase(problem, "[4,3,2,1,4]", "16", false, 2));
        testCases.add(new TestCase(problem, "[1,2,1]", "2", false, 3));
        problem.setTestCases(testCases);
        
        return problem;
    }
    
    private Problem createBinaryTreeLevelOrderProblem() {
        Problem problem = new Problem();
        problem.setTitle("Binary Tree Level Order Traversal");
        problem.setDescription("Given the `root` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: root = [3,9,20,null,null,15,7]\n" +
                "Output: [[3],[9,20],[15,7]]\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: root = [1]\n" +
                "Output: [[1]]\n" +
                "```\n\n" +
                "**Example 3:**\n" +
                "```\n" +
                "Input: root = []\n" +
                "Output: []\n" +
                "```");
        problem.setConstraints("- The number of nodes in the tree is in the range [0, 2000].\n" +
                "- -1000 <= Node.val <= 1000");
        problem.setDifficulty(Difficulty.MEDIUM);
        problem.setTimeLimitMs(3000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def level_order(root):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function levelOrder(root) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "[3,9,20,null,null,15,7]", "[[3],[9,20],[15,7]]", true, 0));
        testCases.add(new TestCase(problem, "[1]", "[[1]]", true, 1));
        testCases.add(new TestCase(problem, "[]", "[]", true, 2));
        testCases.add(new TestCase(problem, "[1,2,3,4,5]", "[[1],[2,3],[4,5]]", false, 3));
        problem.setTestCases(testCases);
        
        return problem;
    }
    
    private Problem createMergeIntervalsProblem() {
        Problem problem = new Problem();
        problem.setTitle("Merge Intervals");
        problem.setDescription("Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\n" +
                "Output: [[1,6],[8,10],[15,18]]\n" +
                "Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: intervals = [[1,4],[4,5]]\n" +
                "Output: [[1,5]]\n" +
                "Explanation: Intervals [1,4] and [4,5] are considered overlapping.\n" +
                "```");
        problem.setConstraints("- 1 <= intervals.length <= 10^4\n" +
                "- intervals[i].length == 2\n" +
                "- 0 <= start_i <= end_i <= 10^4");
        problem.setDifficulty(Difficulty.MEDIUM);
        problem.setTimeLimitMs(3000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def merge(intervals):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function merge(intervals) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "[[1,3],[2,6],[8,10],[15,18]]", "[[1,6],[8,10],[15,18]]", true, 0));
        testCases.add(new TestCase(problem, "[[1,4],[4,5]]", "[[1,5]]", true, 1));
        testCases.add(new TestCase(problem, "[[1,4],[0,4]]", "[[0,4]]", false, 2));
        testCases.add(new TestCase(problem, "[[1,4],[2,3]]", "[[1,4]]", false, 3));
        problem.setTestCases(testCases);
        
        return problem;
    }

    
    // ==================== HARD PROBLEMS ====================
    
    private Problem createWordSearchProblem() {
        Problem problem = new Problem();
        problem.setTitle("Word Search");
        problem.setDescription("Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\n" +
                "The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"\n" +
                "Output: true\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"\n" +
                "Output: true\n" +
                "```\n\n" +
                "**Example 3:**\n" +
                "```\n" +
                "Input: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"\n" +
                "Output: false\n" +
                "```");
        problem.setConstraints("- m == board.length\n" +
                "- n = board[i].length\n" +
                "- 1 <= m, n <= 6\n" +
                "- 1 <= word.length <= 15\n" +
                "- board and word consists of only lowercase and uppercase English letters.");
        problem.setDifficulty(Difficulty.HARD);
        problem.setTimeLimitMs(5000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def exist(board, word):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function exist(board, word) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nABCCED", "true", true, 0));
        testCases.add(new TestCase(problem, "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nSEE", "true", true, 1));
        testCases.add(new TestCase(problem, "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nABCB", "false", true, 2));
        testCases.add(new TestCase(problem, "[[\"A\"]]\nA", "true", false, 3));
        problem.setTestCases(testCases);
        
        return problem;
    }
    
    private Problem createMedianTwoSortedArraysProblem() {
        Problem problem = new Problem();
        problem.setTitle("Median of Two Sorted Arrays");
        problem.setDescription("Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\n" +
                "The overall run time complexity should be O(log (m+n)).\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: nums1 = [1,3], nums2 = [2]\n" +
                "Output: 2.00000\n" +
                "Explanation: merged array = [1,2,3] and median is 2.\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: nums1 = [1,2], nums2 = [3,4]\n" +
                "Output: 2.50000\n" +
                "Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.\n" +
                "```");
        problem.setConstraints("- nums1.length == m\n" +
                "- nums2.length == n\n" +
                "- 0 <= m <= 1000\n" +
                "- 0 <= n <= 1000\n" +
                "- 1 <= m + n <= 2000\n" +
                "- -10^6 <= nums1[i], nums2[i] <= 10^6");
        problem.setDifficulty(Difficulty.HARD);
        problem.setTimeLimitMs(5000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def find_median_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function findMedianSortedArrays(nums1, nums2) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "[1,3]\n[2]", "2.0", true, 0));
        testCases.add(new TestCase(problem, "[1,2]\n[3,4]", "2.5", true, 1));
        testCases.add(new TestCase(problem, "[]\n[1]", "1.0", false, 2));
        testCases.add(new TestCase(problem, "[2]\n[]", "2.0", false, 3));
        problem.setTestCases(testCases);
        
        return problem;
    }
    
    private Problem createTrappingRainWaterProblem() {
        Problem problem = new Problem();
        problem.setTitle("Trapping Rain Water");
        problem.setDescription("Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\n" +
                "**Example 1:**\n" +
                "```\n" +
                "Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\n" +
                "Output: 6\n" +
                "Explanation: The elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.\n" +
                "```\n\n" +
                "**Example 2:**\n" +
                "```\n" +
                "Input: height = [4,2,0,3,2,5]\n" +
                "Output: 9\n" +
                "```");
        problem.setConstraints("- n == height.length\n" +
                "- 1 <= n <= 2 * 10^4\n" +
                "- 0 <= height[i] <= 10^5");
        problem.setDifficulty(Difficulty.HARD);
        problem.setTimeLimitMs(5000);
        problem.setMemoryLimitMb(256);
        problem.setStarterCodeJava("class Solution {\n    public int trap(int[] height) {\n        // Your code here\n    }\n}");
        problem.setStarterCodePython("def trap(height):\n    # Your code here\n    pass");
        problem.setStarterCodeJavascript("function trap(height) {\n    // Your code here\n}");
        
        List<TestCase> testCases = new ArrayList<>();
        testCases.add(new TestCase(problem, "[0,1,0,2,1,0,1,3,2,1,2,1]", "6", true, 0));
        testCases.add(new TestCase(problem, "[4,2,0,3,2,5]", "9", true, 1));
        testCases.add(new TestCase(problem, "[4,2,3]", "1", false, 2));
        testCases.add(new TestCase(problem, "[3,0,2,0,4]", "7", false, 3));
        problem.setTestCases(testCases);
        
        return problem;
    }
}
