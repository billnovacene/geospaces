
import { apiRequest } from "./api-client";
import { Site, PaginatedResponse } from "./interfaces";
import { toast } from "sonner";

// Cache for site device counts
export const siteDevicesCache: Record<number, number> = {};

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
    return sites.map((site: any) => {
      // Parse device count - make sure we have actual numbers
      let deviceCount = 0;
      if (site.devices !== undefined) {
        deviceCount = typeof site.devices === 'number' 
          ? site.devices 
          : parseInt(String(site.devices), 10) || 0;
      }
      
      // Cache device count for later use
      if (site.id) {
        console.log(`Caching device count ${deviceCount} for site ${site.id}`);
        siteDevicesCache[site.id] = deviceCount;
      }
      
      return {
        id: site.id,
        name: site.name,
        address: site.locationText || site.address,
        description: site.description,
        devices: deviceCount, // Ensure we're returning the parsed numeric value
        projectId: site.projectId,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
        status: site.warning ? "Warning" : (site.isRemoved ? "Inactive" : "Active"),
        location: site.location,
        isRemoved: site.isRemoved,
        type: site.type,
        locationText: site.locationText,
        fields: site.fields,
        ...site  // Include any other properties
      };
    });
  } catch (error) {
    console.error(`Error fetching sites for project ${projectId}:`, error);
    toast.error("Failed to fetch sites. Please try again later.");
    return [];
  }
};

// Function to fetch a single site
export const fetchSite = async (siteId: number): Promise<Site | null> => {
  try {
    console.log(`Fetching site ${siteId} from API...`);
    
    const data = await apiRequest<Site>(`/sites/${siteId}`);
    console.log(`Site ${siteId} API response:`, data);
    
    if (!data) {
      console.error("Site data not found in API response");
      return null;
    }
    
    // Parse device count - make sure we have actual numbers
    let deviceCount = 0;
    if (data.devices !== undefined) {
      deviceCount = typeof data.devices === 'number' 
        ? data.devices 
        : parseInt(String(data.devices), 10) || 0;
    }
    
    // Use cached device count if available and greater than current count
    if (siteDevicesCache[siteId] !== undefined && siteDevicesCache[siteId] > 0) {
      console.log(`Using cached device count for site ${siteId}: ${siteDevicesCache[siteId]}`);
      deviceCount = siteDevicesCache[siteId];
    } else if (deviceCount > 0) {
      // Update cache with this count if better than what we had
      console.log(`Updating cache with device count ${deviceCount} for site ${siteId}`);
      siteDevicesCache[siteId] = deviceCount;
    }
    
    return {
      id: data.id,
      name: data.name,
      address: data.locationText || data.address,
      description: data.description,
      devices: deviceCount, // Make sure we're returning the numeric value
      projectId: data.projectId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.warning ? "Warning" : (data.isRemoved ? "Inactive" : "Active"),
      location: data.location,
      isRemoved: data.isRemoved,
      type: data.type,
      locationText: data.locationText,
      fields: data.fields,
      ...data  // Include any other properties
    };
  } catch (error) {
    console.error(`Error fetching site ${siteId}:`, error);
    toast.error("Failed to fetch site details. Please try again later.");
    return null;
  }
};
