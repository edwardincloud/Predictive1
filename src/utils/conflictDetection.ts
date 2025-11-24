import { ChangeRequest } from '../types';
import scheduledChanges from '../data/scheduledChanges.json';

export interface ConflictDetectionResult {
  hasConflicts: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  recommendations: string[];
  conflictingChanges?: typeof scheduledChanges.scheduledChanges;
}

export function detectConflicts(changeRequest: ChangeRequest): ConflictDetectionResult {
  const requestStart = new Date(changeRequest.plannedStartDate);
  const requestEnd = new Date(changeRequest.plannedEndDate);
  
  // Check for overlapping changes
  const overlappingChanges = scheduledChanges.scheduledChanges.filter(change => {
    const changeStart = new Date(change.startTime);
    const changeEnd = new Date(change.endTime);
    
    return (
      (requestStart >= changeStart && requestStart < changeEnd) ||
      (requestEnd > changeStart && requestEnd <= changeEnd) ||
      (requestStart <= changeStart && requestEnd >= changeEnd)
    );
  });

  // Check if the change falls within maintenance windows
  const dayOfWeek = requestStart.getDay();
  const startHour = requestStart.getHours();
  const endHour = requestEnd.getHours();
  
  const maintenanceWindow = scheduledChanges.maintenanceWindows.find(window => {
    const windowStart = parseInt(window.startTime.split(':')[0]);
    const windowEnd = parseInt(window.endTime.split(':')[0]);
    return window.daysOfWeek.includes(dayOfWeek) &&
           startHour >= windowStart &&
           endHour <= windowEnd;
  });

  if (overlappingChanges.length === 0 && maintenanceWindow) {
    return {
      hasConflicts: false,
      riskLevel: 'low',
      factors: [
        'No scheduling conflicts detected',
        'Change scheduled within approved maintenance window',
        'No resource conflicts identified'
      ],
      recommendations: [
        'Proceed with scheduled timeframe',
        'Ensure all stakeholders are notified',
        'Follow standard change procedures'
      ]
    };
  }

  if (overlappingChanges.length > 0) {
    const conflictDetails = overlappingChanges.map(change => 
      `Change ${change.id} (${change.businessApplicationGroup})`
    ).join(', ');

    return {
      hasConflicts: true,
      riskLevel: 'high',
      factors: [
        `Scheduling conflict detected with: ${conflictDetails}`,
        'Overlapping change windows may impact service',
        'Resource contention possible'
      ],
      recommendations: [
        'Reschedule change to avoid conflicts',
        'Coordinate with other change owners',
        'Consider breaking down the change into smaller windows'
      ],
      conflictingChanges: overlappingChanges
    };
  }

  return {
    hasConflicts: true,
    riskLevel: 'medium',
    factors: [
      'Change scheduled outside maintenance window',
      'Additional approval may be required',
      'Business impact assessment needed'
    ],
    recommendations: [
      'Consider rescheduling within maintenance window',
      'Obtain additional approvals for out-of-window execution',
      'Prepare detailed business justification'
    ]
  };
}