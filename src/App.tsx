import React, { useState } from 'react';
import { WorkflowVisualization } from './components/WorkflowVisualization';
import { ExplainabilityDashboard } from './components/ExplainabilityDashboard';
import { ChangeRequestForm } from './components/ChangeRequestForm';
import { WorkflowDemo } from './components/WorkflowDemo';
import { Header } from './components/Header';
import { Tab } from './components/ui/Tab';
import { PostChangeInsights } from './components/PostChangeInsights';
import { analyzeHistoricalRisk } from './utils/riskAnalysis';
import { validateTestingAndMitigation } from './utils/testingValidation';
import { detectConflicts } from './utils/conflictDetection';

function App() {
  const [activeTab, setActiveTab] = useState('visualization');
  const [changeRequest, setChangeRequest] = useState(null);
  const [workflowState, setWorkflowState] = useState({
    currentStep: 0,
    riskScore: 'medium',
    riskFactors: [],
    recommendations: []
  });

  const handleChangeRequestSubmit = (request) => {
    const initialRiskFactors = [];
    const initialRecommendations = [];
    const isPeakHours = (date: string) => {
      const hour = new Date(date).getHours();
      return hour >= 6 && hour <= 23;
    };

    // Step 1: Initial Risk Factors and Recommendations
    if (request.changeType === 'emergency') {
      initialRiskFactors.push('Emergency change type automatically elevates risk');
      initialRecommendations.push('Prepare emergency response team');
      if (request.approvalType === 'manual') {
        initialRiskFactors.push('Manual approval pathway selected');
        initialRecommendations.push('Document manual approval justification');
      }
    }
    if (isPeakHours(request.plannedStartDate)) {
      initialRiskFactors.push('Change scheduled during peak hours (6:00 AM - 12:00 AM)');
      initialRecommendations.push('Consider rescheduling during off-peak hours');
    }
    if (request.declaredRisk === 'high') {
      initialRiskFactors.push('High risk declared by requester');
      initialRecommendations.push('Implement enhanced monitoring protocols');
    }

    initialRecommendations.push('Prepare detailed rollback plan');
    initialRecommendations.push('Review change implementation steps');

    setChangeRequest(request);
    setWorkflowState({
      currentStep: 1,
      riskScore: request.calculatedRisk || 'medium',
      riskFactors: initialRiskFactors,
      recommendations: initialRecommendations
    });
  };

  const advanceWorkflow = () => {
    if (workflowState.currentStep < 6) {
      const nextStep = workflowState.currentStep + 1;
      const currentFactors = [...workflowState.riskFactors];
      const currentRecommendations = [...workflowState.recommendations];
      let newFactors = [];
      let newRecommendations = [];
      let newRiskScore = workflowState.riskScore;

      // Accumulate risk factors and recommendations based on the step
      switch (nextStep) {
        case 2: {
          const historicalAnalysis = analyzeHistoricalRisk(changeRequest);
          newFactors = historicalAnalysis.factors;
          newRiskScore = historicalAnalysis.riskLevel;
          newRecommendations = [
            'Review similar past changes',
            'Consider successful patterns from previous changes',
            'Prepare for known issues based on historical data',
            'Document lessons learned from previous incidents'
          ];
          break;
        }
        case 3: {
          const testingValidation = validateTestingAndMitigation(changeRequest);
          newFactors = testingValidation.factors;
          newRiskScore = testingValidation.riskLevel;
          newRecommendations = [
            ...testingValidation.recommendations,
            'Document all test results and outcomes',
            'Update test cases based on findings'
          ];
          break;
        }
        case 4: {
          const conflictDetection = detectConflicts(changeRequest);
          newFactors = conflictDetection.factors;
          newRiskScore = conflictDetection.riskLevel;
          newRecommendations = [
            ...conflictDetection.recommendations,
            'Maintain communication with affected teams',
            'Update change calendar accordingly'
          ];
          break;
        }
        case 5: {
          if (changeRequest.approvalType === 'manual') {
            newFactors = [
              'Manual approval process requires additional documentation',
              'Emergency change validation bypassed',
              'Increased monitoring required'
            ];
            newRecommendations = [
              'Document manual approval justification',
              'Implement enhanced monitoring',
              'Prepare immediate response team',
              'Set up additional monitoring checkpoints',
              'Schedule post-implementation review'
            ];
          } else {
            newFactors = [
              'Standard validation process completed',
              'All required approvals obtained',
              'Normal monitoring sufficient'
            ];
            newRecommendations = [
              'Proceed with standard implementation',
              'Follow normal monitoring procedures',
              'Update documentation as required',
              'Schedule regular checkpoints'
            ];
          }
          break;
        }
        case 6: {
          // Final step accumulates all previous factors and adds final recommendations
          newFactors = [
            'Final risk assessment complete',
            'All validation steps reviewed',
            'Comprehensive analysis performed'
          ];
          newRecommendations = [
            'Execute implementation plan according to schedule',
            'Monitor all identified risk factors',
            'Keep stakeholders informed of progress',
            'Document any deviations from plan',
            'Prepare post-implementation report'
          ];
          break;
        }
      }

      setWorkflowState(prev => ({
        currentStep: nextStep,
        riskScore: newRiskScore,
        riskFactors: [...currentFactors, ...newFactors],
        recommendations: [...currentRecommendations, ...newRecommendations]
      }));
    }
  };

  const resetWorkflow = () => {
    setChangeRequest(null);
    setWorkflowState({
      currentStep: 0,
      riskScore: 'medium',
      riskFactors: [],
      recommendations: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <Tab 
            isActive={activeTab === 'visualization'} 
            onClick={() => setActiveTab('visualization')}
          >
            Workflow Visualization
          </Tab>
          <Tab 
            isActive={activeTab === 'demo'} 
            onClick={() => setActiveTab('demo')}
          >
            Interactive Demo
          </Tab>
          <Tab 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          >
            Explainability Dashboard
          </Tab>
          <Tab 
            isActive={activeTab === 'insights'} 
            onClick={() => setActiveTab('insights')}
          >
            Post-Change Insights
          </Tab>
        </div>

        {activeTab === 'visualization' && (
          <WorkflowVisualization currentStep={workflowState.currentStep} />
        )}

        {activeTab === 'demo' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <ChangeRequestForm 
                onSubmit={handleChangeRequestSubmit} 
                isSubmitted={!!changeRequest}
              />
            </div>
            <div>
              <WorkflowDemo 
                changeRequest={changeRequest}
                workflowState={workflowState}
                onAdvance={advanceWorkflow}
                onReset={resetWorkflow}
              />
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <ExplainabilityDashboard 
            riskScore={workflowState.riskScore}
            riskFactors={workflowState.riskFactors}
            recommendations={workflowState.recommendations}
            changeRequest={changeRequest}
          />
        )}

        {activeTab === 'insights' && (
          <PostChangeInsights 
            changeRequest={changeRequest}
            workflowState={workflowState}
          />
        )}
      </main>
    </div>
  );
}

export default App;