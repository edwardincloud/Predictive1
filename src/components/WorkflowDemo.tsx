import React, { useState } from 'react';
import { Card } from './ui/Card';
import { RiskBadge } from './ui/RiskBadge';
import { ArrowRight, ArrowLeft, RotateCcw, AlertTriangle, CheckCircle2, Bot, Database, Brain, TestTube, Workflow, Link, Loader2 } from 'lucide-react';

interface WorkflowDemoProps {
  changeRequest: any;
  workflowState: {
    currentStep: number;
    riskScore: string;
    riskFactors: string[];
    recommendations: string[];
  };
  onAdvance: () => void;
  onReset: () => void;
}

export const WorkflowDemo: React.FC<WorkflowDemoProps> = ({
  changeRequest,
  workflowState,
  onAdvance,
  onReset
}) => {
  const [stepHistory, setStepHistory] = useState<{
    step: number;
    state: typeof workflowState;
  }[]>([]);
  const [reviewStep, setReviewStep] = useState<number | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<'factors' | 'recommendations' | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const getCurrentStepState = (step: number) => {
    if (reviewStep) {
      const historicalState = stepHistory.find(h => h.step === step);
      return historicalState ? historicalState.state : workflowState;
    }
    return workflowState;
  };

  // Update history when current step changes
  React.useEffect(() => {
    if (!reviewStep) {
      setStepHistory(prev => [...prev, { 
        step: workflowState.currentStep,
        state: { ...workflowState }
      }]);
    }
  }, [workflowState.currentStep]);

  // Auto-highlight sections with animation
  React.useEffect(() => {
    const highlightSequence = async () => {
      setHighlightedSection('factors');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHighlightedSection('recommendations');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHighlightedSection(null);
    };

    if (!reviewStep) {
      highlightSequence();
    }
  }, [workflowState.currentStep, reviewStep]);

  const handleAdvance = async () => {
    setIsAdvancing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onAdvance();
    setIsAdvancing(false);
  };

  // Get step-specific risk factors
  const getStepRiskFactors = (step: number, allFactors: string[]) => {
    switch (step) {
      case 1:
        return allFactors.filter(factor => 
          factor.includes('peak hours') ||
          factor.includes('emergency change type') ||
          factor.includes('Manual approval pathway')
        );
      case 2:
        return allFactors.filter(factor => 
          factor.includes('similar changes') ||
          factor.includes('historical incidents') ||
          factor.includes('past incidents')
        );
      case 3:
        return allFactors.filter(factor => 
          factor.includes('testing') ||
          factor.includes('Pre-production') ||
          factor.includes('test cases')
        );
      case 4:
        return allFactors.filter(factor => 
          factor.includes('Scheduling conflict') ||
          factor.includes('maintenance window') ||
          factor.includes('resource contention')
        );
      case 5:
        return allFactors.filter(factor => 
          factor.includes('Manual approval') ||
          factor.includes('emergency nature') ||
          factor.includes('validation')
        );
      case 6:
        return allFactors;
      default:
        return [];
    }
  };

  // Get step-specific recommendations
  const getStepRecommendations = (step: number, allRecommendations: string[]) => {
    switch (step) {
      case 1:
        return allRecommendations.filter(rec => 
          rec.includes('reschedule') ||
          rec.includes('rollback plan') ||
          rec.includes('implementation steps')
        );
      case 2:
        return allRecommendations.filter(rec => 
          rec.includes('similar past changes') ||
          rec.includes('successful patterns') ||
          rec.includes('historical data') ||
          rec.includes('lessons learned')
        );
      case 3:
        return allRecommendations.filter(rec => 
          rec.includes('test') ||
          rec.includes('validation') ||
          rec.includes('implementation plan')
        );
      case 4:
        return allRecommendations.filter(rec => 
          rec.includes('scheduling') ||
          rec.includes('coordinate') ||
          rec.includes('maintenance window')
        );
      case 5:
        return allRecommendations.filter(rec => 
          rec.includes('approval') ||
          rec.includes('monitoring') ||
          rec.includes('documentation')
        );
      case 6:
        return allRecommendations;
      default:
        return [];
    }
  };

  if (!changeRequest) {
    return (
      <Card className="h-full">
        <div className="flex flex-col items-center justify-center h-full py-12 text-center">
          <AlertTriangle size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No Change Request</h3>
          <p className="text-gray-400 mt-2">Submit a change request to start the workflow demo</p>
        </div>
      </Card>
    );
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Input Collection and Initial Analysis';
      case 2: return 'Historical Analysis';
      case 3: return 'Testing and Mitigation Validation';
      case 4: return 'Conflict Detection';
      case 5: return 'Handling Edge Cases';
      case 6: return 'Final Recommendation';
      default: return 'Workflow Complete';
    }
  };

  const getStepTools = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Bot size={16} className="mr-1 text-blue-500" />
              Now Assist
            </span>
            <span className="flex items-center">
              <Brain size={16} className="mr-1 text-purple-500" />
              AI Agent Studio
            </span>
            <span className="flex items-center">
              <Database size={16} className="mr-1 text-green-500" />
              Knowledge Graph
            </span>
          </div>
        );
      case 2:
        return (
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Brain size={16} className="mr-1 text-purple-500" />
              AI Agent Studio
            </span>
            <span className="flex items-center">
              <Database size={16} className="mr-1 text-green-500" />
              Workflow Data Fabric
            </span>
            <span className="flex items-center">
              <Bot size={16} className="mr-1 text-blue-500" />
              ML Models
            </span>
          </div>
        );
      case 3:
        return (
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <TestTube size={16} className="mr-1 text-purple-500" />
              Integration Hub
            </span>
            <span className="flex items-center">
              <Brain size={16} className="mr-1 text-blue-500" />
              AI Agent Studio
            </span>
            <span className="flex items-center">
              <Workflow size={16} className="mr-1 text-green-500" />
              Now Assist
            </span>
          </div>
        );
      case 4:
        return (
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Brain size={16} className="mr-1 text-purple-500" />
              AI Agent Studio
            </span>
            <span className="flex items-center">
              <Workflow size={16} className="mr-1 text-blue-500" />
              AI Agent Orchestrator
            </span>
          </div>
        );
      case 5:
        return (
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Brain size={16} className="mr-1 text-purple-500" />
              AI Agent Studio
            </span>
            <span className="flex items-center">
              <Bot size={16} className="mr-1 text-blue-500" />
              Now Assist
            </span>
          </div>
        );
      case 6:
        return (
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Workflow size={16} className="mr-1 text-blue-500" />
              AI Agent Orchestrator
            </span>
            <span className="flex items-center">
              <Bot size={16} className="mr-1 text-green-500" />
              Now Assist
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const isComplete = workflowState.currentStep > 6;
  const currentState = getCurrentStepState(workflowState.currentStep);

  const renderStepContent = (step: number) => {
    const currentState = getCurrentStepState(step);
    const stepRiskFactors = getStepRiskFactors(step, currentState.riskFactors);
    const stepRecommendations = getStepRecommendations(step, currentState.recommendations);
    
    const baseContent = (
      <>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Step {step}: {getStepTitle(step)}
            </h3>
            <RiskBadge level={currentState.riskScore as any} />
          </div>
          {getStepTools(step)}
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500" 
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        <div className={`mb-6 transition-all duration-300 ${
          highlightedSection === 'factors' 
            ? 'bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm transform scale-102'
            : ''
        }`}>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Factors:</h4>
          {stepRiskFactors.length === 0 ? (
            <p className="text-gray-600 italic">No risk factors identified for this step</p>
          ) : (
            <ul className="space-y-2">
              {stepRiskFactors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle size={16} className="text-amber-500 mr-2 mt-0.5" />
                  <span className="text-gray-600">{factor}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`mb-8 transition-all duration-300 ${
          highlightedSection === 'recommendations'
            ? 'bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm transform scale-102'
            : ''
        }`}>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations:</h4>
          {stepRecommendations.length === 0 ? (
            <p className="text-gray-600 italic">No recommendations for this step</p>
          ) : (
            <ul className="space-y-2">
              {stepRecommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-600">{recommendation}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    );

    if (step === 6) {
      const riskColor = currentState.riskScore === 'low' ? 'green' : 
                       currentState.riskScore === 'medium' ? 'amber' : 'red';
      const riskAction = currentState.riskScore === 'low' ? 'Proceed with deployment' :
                        currentState.riskScore === 'medium' ? 'Proceed with caution' : 'Delay or revise change';
      
      return (
        <>
          {baseContent}
          <div className={`mt-4 p-4 bg-${riskColor}-50 rounded-lg border border-${riskColor}-200`}>
            <h4 className={`text-sm font-medium text-${riskColor}-800 mb-2`}>Final Risk Assessment</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Risk Level:</span>
                <RiskBadge level={currentState.riskScore as any} size="lg" />
              </div>
              <div className="text-sm text-gray-600">
                <strong>Recommended Action:</strong> {riskAction}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Summary:</strong> Based on the analysis of all previous steps, this change has been 
                assigned a {currentState.riskScore} risk level. {riskAction}.
              </div>
            </div>
          </div>
        </>
      );
    }

    return baseContent;
  };

  if (isComplete) {
    return (
      <Card className="h-full">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Workflow Complete</h2>
          <p className="text-gray-600 mb-6">The change risk assessment has been processed successfully.</p>
          <RiskBadge level={workflowState.riskScore as any} size="lg" />
          <div className="mt-8">
            <button
              onClick={onReset}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <RotateCcw size={16} className="mr-2" />
              Start New Assessment
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div>
        {reviewStep !== null ? (
          <>
            {renderStepContent(reviewStep)}
            <div className="flex justify-between">
              <button
                onClick={() => setReviewStep(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                Return to Current Step
              </button>
              {reviewStep > 1 && (
                <button
                  onClick={() => setReviewStep(reviewStep - 1)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Previous Step
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {renderStepContent(workflowState.currentStep)}
            <div className="flex justify-between">
              {workflowState.currentStep > 1 && (
                <button
                  onClick={() => setReviewStep(workflowState.currentStep - 1)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Review Previous Step
                </button>
              )}
              <button
                onClick={handleAdvance}
                disabled={isAdvancing}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ml-auto ${
                  isAdvancing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isAdvancing ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Analysing...
                  </>
                ) : (
                  <>
                    {workflowState.currentStep === 6 ? 'Complete' : 'Advance to Next Step'}
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};