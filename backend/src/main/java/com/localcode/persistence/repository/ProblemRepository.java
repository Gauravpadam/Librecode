package com.localcode.persistence.repository;

import com.localcode.persistence.entity.Difficulty;
import com.localcode.persistence.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Problem entity operations.
 */
@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    
    /**
     * Find all problems by difficulty level.
     *
     * @param difficulty the difficulty level to filter by
     * @return list of problems with the specified difficulty
     */
    List<Problem> findByDifficulty(Difficulty difficulty);
    
    /**
     * Find all problems ordered by creation date descending.
     *
     * @return list of problems ordered by newest first
     */
    List<Problem> findAllByOrderByCreatedAtDesc();
    
    /**
     * Find all problems by difficulty ordered by creation date descending.
     *
     * @param difficulty the difficulty level to filter by
     * @return list of problems with the specified difficulty ordered by newest first
     */
    List<Problem> findByDifficultyOrderByCreatedAtDesc(Difficulty difficulty);
    
    /**
     * Search problems by title containing the search term (case-insensitive).
     *
     * @param title the search term
     * @return list of problems matching the search term
     */
    List<Problem> findByTitleContainingIgnoreCase(String title);
    
    /**
     * Count problems by difficulty level.
     *
     * @param difficulty the difficulty level
     * @return count of problems with the specified difficulty
     */
    long countByDifficulty(Difficulty difficulty);
    
    /**
     * Find problems with filters (difficulty, tags, search).
     * Uses native query to support PostgreSQL array operations.
     *
     * @param difficulty the difficulty level (optional)
     * @param tags array of tags to filter by (OR logic)
     * @param searchTerm search term for title (optional)
     * @return list of problems matching the filters
     */
    @Query(value = "SELECT p.* FROM problems p " +
           "WHERE (:difficulty IS NULL OR p.difficulty = CAST(:difficulty AS VARCHAR)) " +
           "AND (:tags IS NULL OR p.tags && CAST(:tags AS TEXT[])) " +
           "AND (:searchTerm IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY p.created_at DESC",
           nativeQuery = true)
    List<Problem> findWithFilters(
        @Param("difficulty") String difficulty,
        @Param("tags") String[] tags,
        @Param("searchTerm") String searchTerm
    );
}
