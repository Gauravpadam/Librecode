package com.localcode.services;

import com.localcode.dto.CustomTestCaseDTO;
import com.localcode.dto.CustomTestCaseRequest;
import com.localcode.exception.ResourceNotFoundException;
import com.localcode.exception.UnauthorizedException;
import com.localcode.exception.ValidationException;
import com.localcode.persistence.entity.CustomTestCase;
import com.localcode.persistence.entity.Problem;
import com.localcode.persistence.entity.User;
import com.localcode.persistence.repository.CustomTestCaseRepository;
import com.localcode.persistence.repository.ProblemRepository;
import com.localcode.persistence.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing custom test cases.
 */
@Service
public class TestCaseService {
    
    private final CustomTestCaseRepository customTestCaseRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    
    public TestCaseService(CustomTestCaseRepository customTestCaseRepository,
                          ProblemRepository problemRepository,
                          UserRepository userRepository) {
        this.customTestCaseRepository = customTestCaseRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Add a custom test case for a problem.
     *
     * @param problemId the problem ID
     * @param userId the user ID
     * @param request the custom test case request
     * @return the created custom test case DTO
     * @throws RuntimeException if problem or user not found
     */
    @Transactional
    public CustomTestCaseDTO addCustomTestCase(Long problemId, Long userId, CustomTestCaseRequest request) {
        // Validate problem exists
        Problem problem = problemRepository.findById(problemId)
            .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", problemId));
        
        // Validate user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        // Validate input and output are not empty
        if (request.getInput() == null || request.getInput().trim().isEmpty()) {
            throw new ValidationException("input", "Test case input cannot be empty");
        }
        
        if (request.getExpectedOutput() == null || request.getExpectedOutput().trim().isEmpty()) {
            throw new ValidationException("expectedOutput", "Test case expected output cannot be empty");
        }
        
        // Create custom test case
        CustomTestCase customTestCase = new CustomTestCase(
            problem,
            user,
            request.getInput(),
            request.getExpectedOutput()
        );
        
        customTestCase = customTestCaseRepository.save(customTestCase);
        
        return convertToDTO(customTestCase);
    }
    
    /**
     * Get all custom test cases for a problem and user.
     *
     * @param problemId the problem ID
     * @param userId the user ID
     * @return list of custom test case DTOs
     */
    @Transactional(readOnly = true)
    public List<CustomTestCaseDTO> getCustomTestCases(Long problemId, Long userId) {
        // Validate problem exists
        if (!problemRepository.existsById(problemId)) {
            throw new ResourceNotFoundException("Problem", "id", problemId);
        }
        
        List<CustomTestCase> customTestCases = customTestCaseRepository
            .findByProblemIdAndUserId(problemId, userId);
        
        return customTestCases.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Update a custom test case.
     *
     * @param testCaseId the test case ID
     * @param userId the user ID (for ownership validation)
     * @param request the update request
     * @return the updated custom test case DTO
     * @throws RuntimeException if test case not found or user doesn't own it
     */
    @Transactional
    public CustomTestCaseDTO updateCustomTestCase(Long testCaseId, Long userId, CustomTestCaseRequest request) {
        // Find test case and validate ownership
        CustomTestCase customTestCase = customTestCaseRepository.findByIdAndUserId(testCaseId, userId)
            .orElseThrow(() -> new UnauthorizedException(
                "Custom test case not found with id: " + testCaseId + " or you don't have permission to update it"
            ));
        
        // Validate input and output are not empty
        if (request.getInput() == null || request.getInput().trim().isEmpty()) {
            throw new ValidationException("input", "Test case input cannot be empty");
        }
        
        if (request.getExpectedOutput() == null || request.getExpectedOutput().trim().isEmpty()) {
            throw new ValidationException("expectedOutput", "Test case expected output cannot be empty");
        }
        
        // Update fields
        customTestCase.setInput(request.getInput());
        customTestCase.setExpectedOutput(request.getExpectedOutput());
        
        customTestCase = customTestCaseRepository.save(customTestCase);
        
        return convertToDTO(customTestCase);
    }
    
    /**
     * Delete a custom test case.
     *
     * @param testCaseId the test case ID
     * @param userId the user ID (for ownership validation)
     * @throws RuntimeException if test case not found or user doesn't own it
     */
    @Transactional
    public void deleteCustomTestCase(Long testCaseId, Long userId) {
        // Find test case and validate ownership
        CustomTestCase customTestCase = customTestCaseRepository.findByIdAndUserId(testCaseId, userId)
            .orElseThrow(() -> new UnauthorizedException(
                "Custom test case not found with id: " + testCaseId + " or you don't have permission to delete it"
            ));
        
        customTestCaseRepository.delete(customTestCase);
    }
    
    /**
     * Convert CustomTestCase entity to DTO.
     *
     * @param customTestCase the entity
     * @return the DTO
     */
    private CustomTestCaseDTO convertToDTO(CustomTestCase customTestCase) {
        return new CustomTestCaseDTO(
            customTestCase.getId(),
            customTestCase.getProblem().getId(),
            customTestCase.getUser().getId(),
            customTestCase.getInput(),
            customTestCase.getExpectedOutput(),
            customTestCase.getCreatedAt()
        );
    }
}
