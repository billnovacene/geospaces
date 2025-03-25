
/**
 * Utility for extracting and managing operating hours information
 */

// Helper function to extract operating hours from site data
export function extractOperatingHours(site: any): { startTime: string; endTime: string } | null {
  if (!site.fields) return null;
  
  // Find the first field with energyCalculationField that has operating hours
  const fieldWithHours = site.fields.find(
    (field: any) => field.energyCalculationField && 
    field.energyCalculationField.operatingHoursStartTime && 
    field.energyCalculationField.operatingHoursEndTime
  );
  
  if (fieldWithHours?.energyCalculationField) {
    return {
      startTime: fieldWithHours.energyCalculationField.operatingHoursStartTime,
      endTime: fieldWithHours.energyCalculationField.operatingHoursEndTime
    };
  }
  
  return null;
}
