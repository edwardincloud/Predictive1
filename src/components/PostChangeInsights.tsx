import React, { useState } from 'react';
import { Card } from './ui/Card';
import { RiskBadge } from './ui/RiskBadge';
import { AlertCircle, CheckCircle2, ArrowUpCircle, BarChart3, Brain, Bot, LineChart, RefreshCcw, AlertTriangle, FileSearch, GitBranch, History, Zap, Target, Gauge, ArrowRightCircle as ArrowUpRightCircle } from 'lucide-react';

interface PostChangeInsightsProps {
  changeRequest: any;
  workflowState: {
    currentStep: number;
    riskScore: string;
    riskFactors: string[];
    recommendations: string[];
  };
}

interface Incident {
  id: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  rootCause?: string;
  resolution?: string;
  status: 'investigating' | 'resolved' | 'mitigated';
}

export const PostChangeInsights: React.FC<PostChangeInsightsProps> = ({
  changeRequest,
  workflowState
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Simulated incidents data
  const incidents: Incident[] = [
    {
      id: 'INC0001234',
      timestamp: '2025-07-15T23:15:00Z',
      severity: 'high',
      description: 'Database performance degradation after upgrade',
      rootCause: 'Query optimization settings not properly configured post-upgrade',
      resolution: 'Applied correct query optimizer settings and validated performance',
      status: 'resolved'
    },
    {
      id: 'INC0001235',
      timestamp: '2025-07-15T23:30:00Z',
      severity: 'medium',
      description: 'Increased error rate in application logs',
      rootCause: 'Connection pool settings mismatch',
      resolution: 'Adjusted connection pool parameters to match new database version',
      status: 'resolved'
    }
  ];

  if (!changeRequest) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No Change Data Available</h3>
          <p className="text-gray-400 mt-2">Submit a change request to view post-change insights</p>
        </div>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating': return 'text-blue-600 bg-blue-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'mitigated': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incident Timeline */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <History size={20} className="text-blue-500 mr-2" />
              Incident Timeline
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {incidents.length} Incidents
            </span>
          </div>

          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedIncident?.id === incident.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedIncident(incident)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <AlertTriangle size={16} className="text-orange-500 mr-2" />
                    <span className="font-medium text-gray-800">{incident.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                <div className="text-xs text-gray-500">
                  {new Date(incident.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Incident Analysis */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileSearch size={20} className="text-purple-500 mr-2" />
              Incident Analysis
            </h3>
            <RiskBadge level={workflowState.riskScore as any} />
          </div>

          {selectedIncident ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Root Cause Analysis</h4>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-start mb-4">
                    <Brain size={16} className="text-purple-500 mr-2 mt-1" />
                    <div>
                      <p className="text-gray-800 font-medium">Identified Cause</p>
                      <p className="text-sm text-gray-600">{selectedIncident.rootCause}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 size={16} className="text-green-500 mr-2 mt-1" />
                    <div>
                      <p className="text-gray-800 font-medium">Resolution</p>
                      <p className="text-sm text-gray-600">{selectedIncident.resolution}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Impact Assessment</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">Service Impact</p>
                    <p className="text-2xl font-bold text-orange-600">15 min</p>
                    <p className="text-xs text-orange-700">Degraded Performance</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Users Affected</p>
                    <p className="text-2xl font-bold text-blue-600">247</p>
                    <p className="text-xs text-blue-700">Active Sessions</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Prevention Measures</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <GitBranch size={16} className="text-blue-500 mr-2 mt-1" />
                    <span className="text-gray-600">Update deployment checklist with configuration validation steps</span>
                  </li>
                  <li className="flex items-start">
                    <Bot size={16} className="text-purple-500 mr-2 mt-1" />
                    <span className="text-gray-600">Implement automated configuration verification</span>
                  </li>
                  <li className="flex items-start">
                    <BarChart3 size={16} className="text-green-500 mr-2 mt-1" />
                    <span className="text-gray-600">Enhanced monitoring of database performance metrics</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileSearch size={32} className="text-gray-300 mb-3" />
              <p className="text-gray-500">Select an incident to view detailed analysis</p>
            </div>
          )}
        </Card>
      </div>

      {/* Feedback Loop Section */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <ArrowUpCircle size={20} className="text-green-500 mr-2" />
            Feedback Loop
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Active Learning
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Model Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Target size={16} className="text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800">Prediction Accuracy</span>
                </div>
                <p className="text-2xl font-bold text-indigo-600">94.5%</p>
                <p className="text-xs text-indigo-700 mt-1">+2.3% from last month</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Gauge size={16} className="text-teal-600 mr-2" />
                  <span className="text-sm font-medium text-teal-800">Risk Assessment</span>
                </div>
                <p className="text-2xl font-bold text-teal-600">96.2%</p>
                <p className="text-xs text-teal-700 mt-1">+1.8% from last month</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Learning Integration</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <Zap size={16} className="text-amber-500 mr-2 mt-1" />
                <div>
                  <p className="text-gray-800 font-medium">Pattern Recognition</p>
                  <p className="text-sm text-gray-600">New configuration patterns identified and integrated into validation rules</p>
                </div>
              </div>
              <div className="flex items-start">
                <ArrowUpRightCircle size={16} className="text-blue-500 mr-2 mt-1" />
                <div>
                  <p className="text-gray-800 font-medium">Model Updates</p>
                  <p className="text-sm text-gray-600">Risk prediction model enhanced with recent incident data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Recent Improvements</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle2 size={16} className="text-green-600 mr-2" />
                <span className="font-medium text-green-800">Validation Rules</span>
              </div>
              <p className="text-sm text-green-700">Added 3 new configuration validation checks based on recent incidents</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Brain size={16} className="text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">AI Model</span>
              </div>
              <p className="text-sm text-blue-700">Enhanced pattern detection with new ML features</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Bot size={16} className="text-purple-600 mr-2" />
                <span className="font-medium text-purple-800">Automation</span>
              </div>
              <p className="text-sm text-purple-700">Implemented automated config verification steps</p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Insights */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Brain size={20} className="text-indigo-500 mr-2" />
            AI-Driven Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-3">
              <Bot size={18} className="text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-800">Pattern Recognition</h4>
            </div>
            <p className="text-sm text-purple-700">
              Similar configuration issues detected in 3 previous changes. Recommended: Implement automated config validation.
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-3">
              <LineChart size={18} className="text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-800">Risk Prediction</h4>
            </div>
            <p className="text-sm text-blue-700">
              85% confidence in successful resolution based on historical data and implemented fixes.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-3">
              <RefreshCcw size={18} className="text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">Learning Integration</h4>
            </div>
            <p className="text-sm text-green-700">
              Updated risk model with new patterns. Future similar changes will undergo enhanced validation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};