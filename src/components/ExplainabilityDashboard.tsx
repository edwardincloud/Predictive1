import React from 'react';
import { Card } from './ui/Card';
import { RiskBadge } from './ui/RiskBadge';
import { AlertTriangle, CheckCircle2, BarChart3, Info, Calendar, Server, Clock, Brain, Shield } from 'lucide-react';

interface ExplainabilityDashboardProps {
  riskScore: string;
  riskFactors: string[];
  recommendations: string[];
  changeRequest: any;
}

export const ExplainabilityDashboard: React.FC<ExplainabilityDashboardProps> = ({
  riskScore,
  riskFactors,
  recommendations,
  changeRequest
}) => {
  if (!changeRequest) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Info size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No Data Available</h3>
          <p className="text-gray-400 mt-2">Submit a change request to view the dashboard</p>
        </div>
      </Card>
    );
  }

  const historicalData = [
    { month: 'Jan', successRate: 92, incidents: 4, color: '#34D399' },
    { month: 'Feb', successRate: 88, incidents: 7, color: '#F59E0B' },
    { month: 'Mar', successRate: 94, incidents: 3, color: '#34D399' },
    { month: 'Apr', successRate: 90, incidents: 5, color: '#34D399' },
    { month: 'May', successRate: 96, incidents: 2, color: '#34D399' },
    { month: 'Jun', successRate: 93, incidents: 4, color: '#34D399' }
  ];

  const similarChanges = [
    { id: 'CHG0010234', success: true, date: '2025-05-15' },
    { id: 'CHG0010187', success: false, date: '2025-05-02' },
    { id: 'CHG0010125', success: true, date: '2025-04-18' }
  ];

  const maxSuccessRate = Math.max(...historicalData.map(d => d.successRate));

  const riskColor = riskScore === 'low' ? 'green' : 
                   riskScore === 'medium' ? 'amber' : 'red';
  
  const riskAction = riskScore === 'low' ? 'Proceed with deployment' :
                    riskScore === 'medium' ? 'Proceed with caution' : 'Delay or revise change';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Final Risk Assessment</h3>
            <RiskBadge level={riskScore as any} size="lg" />
          </div>
          <div className={`p-4 bg-${riskColor}-50 rounded-lg border border-${riskColor}-200 mb-6`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Risk Level:</span>
                <RiskBadge level={riskScore as any} />
              </div>
              <div className="text-sm text-gray-600">
                <strong>Recommended Action:</strong> {riskAction}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Shield size={16} className="text-blue-500" />
              Risk Analysis Summary
            </div>
            <ul className="space-y-2">
              {riskFactors.map((factor, index) => {
                const isConflictFactor = factor.includes('Scheduling conflict detected with:');
                const isHistoricalFactor = factor.includes('unresolved incidents') || factor.includes('similar changes');
                
                const factorContent = isConflictFactor
                  ? factor.split(': ').map((part, i) => {
                      if (i === 0) return part + ': ';
                      return part.split(', ').map((change, j) => {
                        const matches = change.match(/Change (CHG\d+)/);
                        if (matches) {
                          return (
                            <React.Fragment key={j}>
                              {j > 0 && ', '}
                              <span className="text-blue-600">Change {matches[1]}</span>
                              {change.slice(matches[0].length)}
                            </React.Fragment>
                          );
                        }
                        return change;
                      });
                    })
                  : isHistoricalFactor
                  ? factor.split('(').map((part, i) => {
                      if (i === 0) return part;
                      if (part.includes('CHG')) {
                        const matches = part.match(/(CHG\d+)/);
                        if (matches) {
                          return (
                            <React.Fragment key={i}>
                              (<span className="text-blue-600">{matches[1]}</span>
                              {part.slice(matches[0].length)}
                            </React.Fragment>
                          );
                        }
                      }
                      return '(' + part;
                    })
                  : factor;

                return (
                  <li key={index} className="flex items-start">
                    <AlertTriangle size={16} className="text-amber-500 mr-2 mt-0.5" />
                    <span className="text-gray-600">{factorContent}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Recommendations</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Brain size={16} className="text-purple-500" />
              AI-Generated Recommendations
            </div>
            <ul className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-6">
            <Calendar size={18} className="mr-2 text-blue-500" />
            Change Details
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Title</h4>
              <p className="text-gray-700">{changeRequest.title}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Scheduled Time</h4>
              <p className="text-gray-700 flex items-center">
                <Clock size={14} className="mr-1 text-gray-400" />
                {new Date(changeRequest.plannedStartDate).toLocaleString()} to {new Date(changeRequest.plannedEndDate).toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Impacted Systems</h4>
              <p className="text-gray-700 flex items-center">
                <Server size={14} className="mr-1 text-gray-400" />
                {changeRequest.businessApplicationGroup}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-6">
            <BarChart3 size={18} className="mr-2 text-blue-500" />
            Historical Success Rates
          </h3>
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {historicalData.map((data, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  <div className="relative w-full px-1">
                    <div 
                      className="w-full rounded-t transition-all duration-500"
                      style={{ 
                        height: `${(data.successRate / maxSuccessRate) * 100}%`,
                        backgroundColor: data.color,
                        minHeight: '20px'
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                        {data.successRate}%
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 mt-2">
                      {data.month}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute left-0 bottom-0 w-full h-px bg-gray-200" />
          </div>
          <div className="mt-8 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2" />
                <span>Success Rate ≥ 90%</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
                <span>Success Rate &lt; 90%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Similar Changes</h3>
          <div className="overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {similarChanges.map((change, index) => (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 text-sm text-blue-600">{change.id}</td>
                    <td className="py-3 text-sm text-gray-600">{change.date}</td>
                    <td className="py-3">
                      {change.success ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          <CheckCircle2 size={12} className="mr-1" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          <AlertTriangle size={12} className="mr-1" />
                          Incident
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};