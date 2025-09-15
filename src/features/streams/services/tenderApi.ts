import type { TenderSearchResponse, DecisionStatus } from '../types';

const API_BASE_URL = 'http://localhost:3000';

export class TenderApiService {
  /**
   * Search tenders with pagination
   */
  static async searchTenders(skip: number = 0, take: number = 10): Promise<TenderSearchResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/tenders/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skip, take }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tenders:', error);
      throw new Error('Failed to fetch tenders');
    }
  }

  /**
   * Record a decision on a tender
   */
  static async recordDecision(tenderId: number, decisionStatus: DecisionStatus): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/interactions/decisionStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenderId, decisionStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error recording decision:', error);
      throw new Error('Failed to record decision');
    }
  }

}
