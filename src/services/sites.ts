import { apiRequest } from "./api-client";
import { Site, PaginatedResponse } from "./interfaces";
import { toast } from "sonner";

// Cache for site device counts
export const siteDevicesCache: Record<number, number> = {};

// Function to fetch sites for a project
export const fetchSites = async (projectId: number): Promise<Site[]> => {
  try {
    console.log(`Fetching sites for project ${projectId} from API...`);
    const response = await apiRequest<PaginatedResponse<Site>>(`/sites?projectid=${projectId}`);
    console.log(`Sites for project ${projectId} API raw response:`, response);
    
    if (!response || !response.list) {
      console.error(`Invalid API response format for project ${projectId}:`, response);
      return [];
    }
    
    // Process the response similar to projects
    const sites = response.list || [];
    console.log(`Number of sites received for project ${projectId}:`, sites.length);
    
    if (sites.length === 0) {
      console.log(`No sites found for project ${projectId}`);
    }
    
    // Transform API response to match our Site interface
    const transformedSites = sites.map((site: any) => {
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
      
      // Determine the status properly
      const status = site.warning ? "Warning" : (site.isRemoved ? "Inactive" : "Active");
      console.log(`Site ${site.id} (${site.name}) status determined as: ${status}`);
      
      return {
        id: site.id,
        name: site.name,
        address: site.locationText || site.address,
        description: site.description,
        devices: deviceCount, // Ensure we're returning the parsed numeric value
        projectId: site.projectId,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
        status: status,
        location: site.location,
        isRemoved: site.isRemoved || false,
        type: site.type,
        locationText: site.locationText,
        fields: site.fields,
        ...site  // Include any other properties
      };
    });
    
    console.log(`Transformed sites for project ${projectId}:`, transformedSites);
    return transformedSites;
  } catch (error) {
    console.error(`Error fetching sites for project ${projectId}:`, error);
    toast.error("Failed to fetch sites. Please try again later.");
    throw error; // Re-throw to let React Query handle the error
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
      
      console.log(`Direct device count from API for site ${siteId}: ${deviceCount}`);
    }
    
    // Check cache for device count
    let finalDeviceCount = deviceCount;
    if (siteDevicesCache[siteId] !== undefined) {
      const cachedCount = siteDevicesCache[siteId];
      console.log(`Cached device count for site ${siteId}: ${cachedCount}`);
      
      // Use the higher value between cached and direct
      if (cachedCount > deviceCount) {
        console.log(`Using cached count ${cachedCount} for site ${siteId} (higher than direct ${deviceCount})`);
        finalDeviceCount = cachedCount;
      }
    }
    
    // Always update cache with the best count we have
    if (finalDeviceCount > 0) {
      console.log(`Updating cache with device count ${finalDeviceCount} for site ${siteId}`);
      siteDevicesCache[siteId] = finalDeviceCount;
    }
    
    return {
      id: data.id,
      name: data.name,
      address: data.locationText || data.address,
      description: data.description,
      devices: finalDeviceCount, // Use the final count we calculated
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
