# Database Seeding Guide

## Overview

The LocalCode backend includes an automatic database seeding mechanism that populates the database with sample data when the application starts with an empty database.

## What Gets Seeded

### Sample Users

The seeder creates 3 test user accounts:

| Username | Email | Password | Purpose |
|----------|-------|----------|---------|
| testuser | test@example.com | password123 | General testing |
| johndoe | john@example.com | password123 | General testing |
| admin | admin@example.com | admin123 | Admin testing |

**Note:** All passwords are securely hashed using BCrypt with 12 rounds before storage.

### Sample Problems

The seeder creates 13 coding problems across three difficulty levels:

#### Easy Problems (5)
1. **Two Sum** - Find two numbers that add up to a target
2. **Reverse String** - Reverse a character array in-place
3. **Palindrome Number** - Check if a number is a palindrome
4. **FizzBuzz** - Classic FizzBuzz problem
5. **Valid Parentheses** - Validate bracket matching

#### Medium Problems (5)
6. **Maximum Subarray** - Find the contiguous subarray with the largest sum
7. **Longest Substring Without Repeating Characters** - Find longest unique substring
8. **Container With Most Water** - Two-pointer problem for maximum area
9. **Binary Tree Level Order Traversal** - BFS tree traversal
10. **Merge Intervals** - Merge overlapping intervals

#### Hard Problems (3)
11. **Word Search** - Backtracking problem on a 2D grid
12. **Median of Two Sorted Arrays** - Binary search problem
13. **Trapping Rain Water** - Calculate trapped water between bars

### Test Cases

Each problem includes:
- **Sample test cases** (visible to users): 2-3 test cases marked as samples
- **Hidden test cases** (for validation): 1-2 additional test cases
- **Total**: 4-5 test cases per problem

All test cases include:
- Input data
- Expected output
- Sample flag (true/false)
- Order index for consistent display

## How It Works

### Automatic Seeding

The seeder runs automatically when:
1. The application starts
2. The database is empty (no problems exist)

If the database already contains problems, the seeder skips execution to avoid duplicates.

### Implementation Details

The seeder is implemented in `DataSeeder.java` using Spring Boot's `CommandLineRunner`:

```java
@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner initDatabase(...) {
        return args -> {
            if (problemRepository.count() > 0) {
                logger.info("Database already contains data. Skipping seeding.");
                return;
            }
            // Seed data...
        };
    }
}
```

## Starter Code

Each problem includes starter code templates for three languages:

### Java
```java
class Solution {
    public ReturnType methodName(ParamType param) {
        // Your code here
    }
}
```

### Python
```python
def method_name(param):
    # Your code here
    pass
```

### JavaScript
```javascript
function methodName(param) {
    // Your code here
}
```

## Resource Limits

Problems have different resource limits based on difficulty:

| Difficulty | Time Limit | Memory Limit |
|------------|------------|--------------|
| Easy | 2000ms | 256MB |
| Medium | 3000ms | 256MB |
| Hard | 5000ms | 256MB |

## Manual Seeding

If you need to manually trigger seeding:

1. **Clear the database:**
   ```sql
   TRUNCATE TABLE test_results, submissions, custom_test_cases, test_cases, problems, users CASCADE;
   ```

2. **Restart the application:**
   ```bash
   mvn spring-boot:run
   ```

The seeder will detect the empty database and populate it automatically.

## Disabling the Seeder

To disable automatic seeding, you can:

1. **Comment out the bean** in `DataSeeder.java`:
   ```java
   // @Bean
   CommandLineRunner initDatabase(...) { ... }
   ```

2. **Or add a profile condition**:
   ```java
   @Profile("!prod")
   @Bean
   CommandLineRunner initDatabase(...) { ... }
   ```

## Customizing Seed Data

To add or modify problems:

1. Open `localcode/backend/src/main/java/com/localcode/config/DataSeeder.java`
2. Add a new problem creation method following the existing pattern:
   ```java
   private Problem createYourProblem() {
       Problem problem = new Problem();
       problem.setTitle("Your Problem Title");
       problem.setDescription("Problem description...");
       problem.setDifficulty(Difficulty.MEDIUM);
       problem.setTimeLimitMs(3000);
       problem.setMemoryLimitMb(256);
       // Set starter code...
       
       List<TestCase> testCases = new ArrayList<>();
       testCases.add(new TestCase(problem, "input", "output", true, 0));
       problem.setTestCases(testCases);
       
       return problem;
   }
   ```
3. Add the problem to the `seedProblems()` method:
   ```java
   problems.add(createYourProblem());
   ```

## Verification

After seeding, verify the data:

```sql
-- Check users
SELECT id, username, email FROM users;

-- Check problems by difficulty
SELECT difficulty, COUNT(*) FROM problems GROUP BY difficulty;

-- Check test cases
SELECT p.title, COUNT(tc.id) as test_count 
FROM problems p 
LEFT JOIN test_cases tc ON p.id = tc.problem_id 
GROUP BY p.id, p.title;
```

Expected results:
- 3 users
- 13 problems (5 Easy, 5 Medium, 3 Hard)
- 52-65 total test cases (4-5 per problem)

## Troubleshooting

### Seeder Not Running

**Problem:** Seeder doesn't execute on startup.

**Solutions:**
- Check logs for "Starting database seeding..." message
- Verify database connection is working
- Ensure `spring.jpa.hibernate.ddl-auto` is set to `update` or `create`

### Duplicate Data

**Problem:** Seeder runs multiple times creating duplicates.

**Solutions:**
- The seeder checks `problemRepository.count() > 0` before running
- If duplicates exist, clear the database and restart

### Compilation Errors

**Problem:** DataSeeder.java fails to compile.

**Solutions:**
- Ensure all entity classes are properly defined
- Check that repositories are correctly configured
- Verify Spring Boot dependencies in pom.xml

## Production Considerations

For production deployments:

1. **Disable automatic seeding** using profiles
2. **Use SQL scripts** for controlled data initialization
3. **Backup seed data** before making changes
4. **Test seeding** in staging environment first

## Related Files

- `DataSeeder.java` - Main seeder implementation
- `Problem.java` - Problem entity
- `TestCase.java` - Test case entity
- `User.java` - User entity
- `application.properties` - Database configuration
