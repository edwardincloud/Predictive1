import { ChangeRequest } from '../types';

interface TestingValidationResult {
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  recommendations: string[];
  testingFeasible: boolean;
  testCompletionLink?: string;
}

export function validateTestingAndMitigation(changeRequest: ChangeRequest): TestingValidationResult {
  // Simulate testing feasibility check based on change type and timing
  const testingFeasible = changeRequest.changeType !== 'emergency';
  
  if (!testingFeasible) {
    // For emergency changes where testing isn't feasible
    const hasBackoutPlan = true; // In a real system, this would be determined by checking the change details
    
    if (hasBackoutPlan) {
      return {
        riskLevel: 'high',
        factors: [
          'Testing not feasible due to emergency nature',
          'Backout plan in place as mitigation'
        ],
        recommendations: [
          'Ensure backout plan is readily available',
          'Schedule additional support staff during implementation',
          'Prepare for immediate rollback if needed'
        ],
        testingFeasible: false
      };
    }
    
    return {
      riskLevel: 'high',
      factors: [
        'Testing not feasible due to emergency nature',
        'No comprehensive backout plan identified'
      ],
      recommendations: [
        'URGENT: Develop backout plan before proceeding',
        'Consider alternative implementation approaches',
        'Required: Additional approval for no-test implementation'
      ],
      testingFeasible: false
    };
  }

  // Simulate test results for standard/normal changes
  const testsPassed = Math.random() > 0.3; // Simulated test results
  const hasTestCompletionLink = Math.random() > 0.5; // Simulate whether test completion link exists
  
  if (!hasTestCompletionLink) {
    return {
      riskLevel: 'high',
      factors: [
        'No test completion link available',
        'Unable to verify test execution',
        'Testing documentation incomplete'
      ],
      recommendations: [
        'URGENT: Provide test completion documentation',
        'Review testing process compliance',
        'Required: Additional approval for incomplete testing documentation'
      ],
      testingFeasible: true
    };
  }

  const testCompletionLink = 'https://testing-portal.example.com/test-results/CHG0010234';
  
  if (testsPassed) {
    return {
      riskLevel: 'low',
      factors: [
        'Pre-production testing completed successfully',
        'All test cases passed',
        'No significant issues identified'
      ],
      recommendations: [
        'Proceed with implementation as planned',
        'Monitor system performance post-deployment',
        'Keep test results for future reference'
      ],
      testingFeasible: true,
      testCompletionLink
    };
  }

  return {
    riskLevel: 'high',
    factors: [
      'Pre-production testing revealed issues',
      'Critical test cases failed',
      'Performance impact detected'
    ],
    recommendations: [
      'Address failed test cases before proceeding',
      'Review and update implementation plan',
      'Consider scheduling additional testing window'
    ],
    testingFeasible: true,
    testCompletionLink
  };
}