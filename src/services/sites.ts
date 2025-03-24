
import { apiRequest } from "./api-client";
import { Site, PaginatedResponse } from "./interfaces";
import { toast } from "sonner";

// Function to fetch sites for a project
export const fetchSites = async (projectId: number): Promise<Site[]> => {
  try {
    console.log(`Fetching sites for project ${projectId} from API...`);
    const data = await apiRequest<PaginatedResponse<Site>>(`/sites?projectid=${projectId}`);
    console.log(`Sites for project ${projectId} API response:`, data);
    
    // Process the response similar to projects
    const sites = data.list || [];
    console.log('Number of sites received:', sites.length);
    
    // Transform API response to match our Site interface
    return sites.map((site: any) => ({
      id: site.id,
      name: site.name,
      address: site.address,
      description: site.description,
      devices: site.devices,
      projectId: site.projectId,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt,
      status: site.status || "Unknown",
      location: site.location,
      isRemoved: site.isRemoved,
      type: site.type,
      locationText: site.locationText,
      fields: site.fields,
      ...site  // Include any other properties
    }));
  } catch (error) {
    console.error(`Error fetching sites for project ${projectId}:`, error);
    toast.error("Failed to fetch sites. Please try again later.");
    return [];
  }
};
