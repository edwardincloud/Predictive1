// Workflow Types
export interface WorkflowState {
  currentStep: number;
  riskScore: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendations: string[];
}

export interface ChangeRequest {
  id?: string;
  title: string;
  description: string;
  justification: string;
  plannedStartDate: string;
  plannedEndDate: string;
  businessApplicationGroup: string;
  declaredRisk: 'low' | 'medium' | 'high';
  changeType: 'standard' | 'emergency' | 'normal';
  priority: 'low' | 'medium' | 'high';
  calculatedRisk?: 'low' | 'medium' | 'high';
  riskFactors?: string[];
}

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  tools: string[];
  icon?: string;
}