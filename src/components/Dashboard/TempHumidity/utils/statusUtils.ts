
import { StatItem } from "@/components/Dashboard/Common/SummaryStats";

/**
 * Converts temperature/humidity status to StatItem type
 */
export function getTypeFromStatus(status: 'good' | 'caution' | 'warning'): StatItem['type'] {
  switch (status) {
    case 'good': return 'success';
    case 'caution': return 'caution';
    case 'warning': return 'high-risk';
    default: return 'normal';
  }
}

/**
 * Returns human-readable label for temperature/humidity status
 */
export function getStatusLabel(status: 'good' | 'caution' | 'warning'): string {
  switch (status) {
    case 'good': return 'Optimal';
    case 'caution': return 'Caution';
    case 'warning': return 'Warning';
    default: return 'Unknown';
  }
}
