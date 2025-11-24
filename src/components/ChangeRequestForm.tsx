import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Clock, FileText, MessageSquare, Calendar, AlertTriangle, Loader2 } from 'lucide-react';

interface ChangeRequestFormProps {
  onSubmit: (request: any) => void;
  isSubmitted: boolean;
}

export const ChangeRequestForm: React.FC<ChangeRequestFormProps> = ({
  onSubmit,
  isSubmitted
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    justification: '',
    plannedStartDate: '',
    plannedEndDate: '',
    businessApplicationGroup: '',
    declaredRisk: 'low',
    changeType: 'standard',
    priority: 'low',
    approvalType: 'standard'
  });

  const [showApprovalPrompt, setShowApprovalPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'changeType') {
      if (value === 'emergency') {
        setShowApprovalPrompt(true);
      } else {
        setFormData(prev => ({ ...prev, [name]: value, approvalType: 'standard' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleApprovalSelection = (approvalType: 'standard' | 'manual') => {
    setFormData(prev => ({ 
      ...prev, 
      changeType: 'emergency',
      approvalType
    }));
    setShowApprovalPrompt(false);
  };

  const calculateInitialRisk = () => {
    const { changeType, declaredRisk } = formData;
    
    if (changeType === 'emergency') {
      return 'high';
    }
    
    return declaredRisk;
  };

  const isPeakHours = (startDate: string) => {
    const date = new Date(startDate);
    const hour = date.getHours();
    return hour >= 6 && hour <= 23;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const initialRisk = calculateInitialRisk();
    const duringPeakHours = isPeakHours(formData.plannedStartDate);
    
    const riskFactors = [];
    if (duringPeakHours) {
      riskFactors.push('Change scheduled during peak hours (6:00 AM - 12:00 AM)');
    }
    if (formData.changeType === 'emergency') {
      riskFactors.push('Emergency change type automatically elevates risk');
      if (formData.approvalType === 'manual') {
        riskFactors.push('Manual approval pathway selected');
      }
    }
    if (initialRisk === 'low') {
      riskFactors.push('Low risk based on standard change type and declared risk level');
    }

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onSubmit({
      ...formData,
      calculatedRisk: initialRisk,
      riskFactors
    });
  };

  const fillSampleData = () => {
    setFormData({
      title: 'Database Server Upgrade',
      description: 'Upgrade database server from version 10.2 to 11.5 to address security vulnerabilities and improve performance.',
      justification: 'Current version reaches end-of-support next month and contains known security issues.',
      plannedStartDate: '2025-07-15T22:00',
      plannedEndDate: '2025-07-16T03:00',
      businessApplicationGroup: 'Customer Data Services',
      declaredRisk: 'low',
      changeType: 'standard',
      priority: 'low',
      approvalType: 'standard'
    });
  };

  if (showApprovalPrompt) {
    return (
      <Card title="Emergency Change Approval\" className="mb-8">
        <div className="p-6">
          <div className="flex items-center mb-6 text-amber-600">
            <AlertTriangle className="mr-2" />
            <h3 className="text-lg font-semibold">Emergency Change Detected</h3>
          </div>
          <p className="mb-6 text-gray-600">
            Please select the approval pathway for this emergency change:
          </p>
          <div className="space-y-4">
            <button
              onClick={() => handleApprovalSelection('standard')}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
            >
              <h4 className="font-medium text-gray-800 mb-1">Standard Approval</h4>
              <p className="text-sm text-gray-600">
                Follow normal approval process with expedited review
              </p>
            </button>
            <button
              onClick={() => handleApprovalSelection('manual')}
              className="w-full px-4 py-3 bg-amber-50 hover:bg-amber-100 rounded-lg text-left transition-colors"
            >
              <h4 className="font-medium text-amber-800 mb-1">Manual Approval</h4>
              <p className="text-sm text-amber-700">
                Bypass standard validation with manual approval and documentation
              </p>
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Change Request Form" className="mb-8">
      {isSubmitted ? (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Change Request Submitted</h3>
          <p className="text-gray-600">Your change request is now being processed through the workflow.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={fillSampleData}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Fill with sample data
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Change Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="justification" className="block text-sm font-medium text-gray-700 mb-1">
                  Justification
                </label>
                <textarea
                  id="justification"
                  name="justification"
                  value={formData.justification}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="plannedStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Planned Start
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    id="plannedStartDate"
                    name="plannedStartDate"
                    value={formData.plannedStartDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="plannedEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      Planned End
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    id="plannedEndDate"
                    name="plannedEndDate"
                    value={formData.plannedEndDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="businessApplicationGroup" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Application Group
                </label>
                <input
                  type="text"
                  id="businessApplicationGroup"
                  name="businessApplicationGroup"
                  value={formData.businessApplicationGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="changeType" className="block text-sm font-medium text-gray-700 mb-1">
                    Change Type
                  </label>
                  <select
                    id="changeType"
                    name="changeType"
                    value={formData.changeType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="emergency">Emergency</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="declaredRisk" className="block text-sm font-medium text-gray-700 mb-1">
                    Declared Risk
                  </label>
                  <select
                    id="declaredRisk"
                    name="declaredRisk"
                    value={formData.declaredRisk}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Submit Change Request'
                  )}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};