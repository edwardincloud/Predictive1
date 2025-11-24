import React from 'react';
import { BarChart3, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 size={28} className="text-blue-200" />
            <div>
              <h1 className="text-xl font-bold md:text-2xl">Change Risk Forecasting</h1>
              <p className="text-sm text-blue-100">AI Agent Workflow & Outage Prediction</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <AlertTriangle size={16} className="text-yellow-300" />
            <span className="text-sm text-yellow-100">Active monitoring: 42 changes in progress</span>
          </div>
        </div>
      </div>
    </header>
  );
};