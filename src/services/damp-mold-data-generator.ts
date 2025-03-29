
// Re-export the generate function and data utility functions from the new damp-mold modules
export { 
  generateAndInsertDampMoldData 
} from './damp-mold/data-generator';

export {
  generateMonthlyRiskDataFromDailyData
} from './damp-mold/data-processing';

export {
  fetchDampMoldData 
} from './damp-mold/data-fetching';
