import React from 'react';
import { 
  ClipboardList, Database, TestTube, Calendar, LineChart, 
  AlertCircle, ArrowUpCircle, LayoutGrid, HelpCircle
} from 'lucide-react';
import { Card } from './ui/Card';

interface WorkflowVisualizationProps {
  currentStep: number;
}

export const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = ({ 
  currentStep 
}) => {
  const workflowSteps = [
    { 
      id: 1, 
      title: 'Input Collection', 
      description: 'Extract details and predict initial risk score',
      icon: ClipboardList,
      tools: 'Now Assist, AI Agent Studio, Knowledge Graph'
    },
    { 
      id: 2, 
      title: 'Historical Analysis', 
      description: 'Search historical data for similar changes and analyze past incidents',
      icon: Database,
      tools: 'AI Agent Studio, Workflow Data Fabric, ML Models'
    },
    { 
      id: 3, 
      title: 'Testing Validation', 
      description: 'Check testing possibilities and review test results or backup plans',
      icon: TestTube,
      tools: 'AI Agent Studio, Integration Hub, Now Assist'
    },
    { 
      id: 4, 
      title: 'Conflict Detection', 
      description: 'Scan for scheduling and resource conflicts',
      icon: Calendar,
      tools: 'AI Agent Studio, AI Agent Orchestrator'
    },
    { 
      id: 5, 
      title: 'Handling Edge Cases', 
      description: 'Manage incomplete or urgent requests with prompts',
      icon: HelpCircle,
      tools: 'AI Agent Studio, Now Assist'
    },
    { 
      id: 6, 
      title: 'Final Recommendation', 
      description: 'Combine all data into final risk level and provide advice',
      icon: LineChart,
      tools: 'AI Agent Orchestrator, Now Assist'
    },
    { 
      id: 7, 
      title: 'Post-Incident Analysis', 
      description: 'Analyze change outcomes and document findings',
      icon: AlertCircle,
      tools: 'AI Agent Studio, Now Assist'
    },
    { 
      id: 8, 
      title: 'Feedback Loop', 
      description: 'Refine risk models based on change outcomes',
      icon: ArrowUpCircle,
      tools: 'AI Agent Studio, Machine Learning Models'
    },
    { 
      id: 9, 
      title: 'Explainability Dashboard', 
      description: 'Visualize risk score, factors, and recommendations',
      icon: LayoutGrid,
      tools: 'ServiceNow Reporting, Now Assist'
    }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Agent Workflow Visualization</h2>
        <p className="mb-6 text-gray-600">This workflow demonstrates how the AI agent processes change requests, analyzes risks, and provides recommendations to prevent service outages.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {workflowSteps.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isPast = currentStep > step.id;
            const isFuture = currentStep < step.id;
            
            return (
              <div 
                key={step.id}
                className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : isPast
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start mb-4">
                  <div className={`p-3 rounded-full mr-4 ${
                    isActive ? 'bg-blue-100 text-blue-600' : 
                    isPast ? 'bg-green-100 text-green-600' : 
                    'bg-gray-100 text-gray-500'
                  }`}>
                    <StepIcon size={24} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      isActive ? 'text-blue-700' : 
                      isPast ? 'text-green-700' : 
                      'text-gray-700'
                    }`}>
                      {step.id}. {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tools</h4>
                  <p className="text-sm text-gray-600 mt-1">{step.tools}</p>
                </div>
                
                {(isActive || isPast) && (
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isActive ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {isActive ? 'Active' : 'Completed'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};