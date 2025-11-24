import { ChangeRequest } from '../types';
import historicalData from '../data/historicalData.json';

export interface HistoricalAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  similarChanges: typeof historicalData.changes;
}

export function analyzeHistoricalRisk(changeRequest: ChangeRequest): HistoricalAnalysisResult {
  const similarChanges = historicalData.changes.filter(change => 
    change.businessApplicationGroup === changeRequest.businessApplicationGroup &&
    change.type === changeRequest.changeType
  );

  if (similarChanges.length === 0) {
    return {
      riskLevel: changeRequest.calculatedRisk || 'medium',
      factors: ['No similar changes found in history - proceeding with caution'],
      similarChanges: []
    };
  }

  const incidentChanges = similarChanges.filter(change => change.outcome === 'incident');
  const hasIncidents = incidentChanges.length > 0;
  const resolvedIncidents = incidentChanges.filter(change => change.incidentDetails?.resolved);

  let riskLevel = 'low'; // Default to low risk
  const factors: string[] = [];

  if (hasIncidents) {
    riskLevel = 'medium'; // Set to medium only when incidents are found
    if (resolvedIncidents.length === incidentChanges.length) {
      factors.push(`Similar changes had incidents in the past (Change ID: ${incidentChanges[0].id}), but all were successfully resolved`);
    } else {
      factors.push(`Similar changes resulted in unresolved incidents (Change ID: ${incidentChanges[0].id})`);
    }
  } else {
    factors.push(`${similarChanges.length} similar changes completed successfully`);
  }

  return {
    riskLevel,
    factors,
    similarChanges
  };
}