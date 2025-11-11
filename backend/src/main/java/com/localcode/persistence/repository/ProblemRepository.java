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
}
