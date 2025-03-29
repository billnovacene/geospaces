
import { supabase } from "@/integrations/supabase/client";
import { generateAndInsertDampMoldData } from "./damp-mold-data-generator";
import { toast } from "sonner";

/**
 * Generates example data for various zones and sites
 */
export const generateExampleData = async () => {
  try {
    toast.info("Generating example data...");
    
    // First, create some basic project, site, zone structure if it doesn't exist
    // Check if we have any projects
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id, name')
      .limit(1);
    
    // Create a project if none exists
    let projectId = existingProjects?.[0]?.id;
    if (!projectId) {
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: 'Example Project',
          description: 'Auto-generated example project',
          status: 'Active'
        })
        .select('id')
        .single();
      
      if (projectError) throw projectError;
      projectId = newProject.id;
      
      console.log(`Created new project with ID: ${projectId}`);
    }
    
    // Check for existing sites
    const { data: existingSites } = await supabase
      .from('sites')
      .select('id, name')
      .eq('project_id', projectId)
      .limit(3);
    
    // Create sites if needed
    const siteIds = [];
    if (!existingSites || existingSites.length < 2) {
      const sitesToCreate = [
        { name: 'North Building', address: '123 North St', description: 'North campus building', status: 'Active' },
        { name: 'South Building', address: '456 South Ave', description: 'South campus building', status: 'Active' }
      ];
      
      for (const site of sitesToCreate) {
        const { data: newSite, error: siteError } = await supabase
          .from('sites')
          .insert({
            ...site,
            project_id: projectId
          })
          .select('id')
          .single();
        
        if (siteError) throw siteError;
        siteIds.push(newSite.id);
        
        console.log(`Created new site with ID: ${newSite.id}`);
      }
    } else {
      existingSites.forEach(site => siteIds.push(site.id));
    }
    
    // Create zones for each site
    for (const siteId of siteIds) {
      // Check for existing zones
      const { data: existingZones } = await supabase
        .from('zones')
        .select('id, name')
        .eq('site_id', siteId)
        .limit(5);
      
      // Create zones if needed
      const zoneIds = [];
      if (!existingZones || existingZones.length < 3) {
        const zonesToCreate = [
          { name: 'Ground Floor', description: 'Ground floor area', type: 'Floor', status: 'Active', area: 150 },
          { name: 'First Floor', description: 'First floor area', type: 'Floor', status: 'Active', area: 120 },
          { name: 'Kitchen', description: 'Kitchen area', type: 'Room', status: 'Active', area: 30 }
        ];
        
        for (const zone of zonesToCreate) {
          const { data: newZone, error: zoneError } = await supabase
            .from('zones')
            .insert({
              ...zone,
              site_id: siteId
            })
            .select('id')
            .single();
          
          if (zoneError) throw zoneError;
          zoneIds.push(newZone.id);
          
          console.log(`Created new zone with ID: ${newZone.id}`);
        }
      } else {
        existingZones.forEach(zone => zoneIds.push(zone.id));
      }
      
      // Generate data for each zone
      for (const zoneId of zoneIds) {
        await generateAndInsertDampMoldData(zoneId.toString(), siteId.toString());
        console.log(`Generated data for zone ${zoneId} in site ${siteId}`);
      }
    }
    
    toast.success("Example data generated successfully", {
      description: "The database has been populated with sample data"
    });
    
    return true;
  } catch (error) {
    console.error("Error generating example data:", error);
    toast.error("Failed to generate example data", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return false;
  }
};
