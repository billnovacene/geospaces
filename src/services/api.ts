
import { toast } from "sonner";

// API Token
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxMSIsImlhdCI6MTc0MjgxNDc2MiwiZXhwIjozNzk2NjY5NTI0fQ.hoawe56oJZwLzTwMRxWIqYk80OGIfnSBGERs9ZzrToo";

// Base URL for the API
const API_BASE_URL = "https://api-prod.novacene.io/api/v2";

// Interface for Project data
export interface Project {
  id: number;  // Changed from string to number based on API response
  name: string;
  customerId?: number;
  createdAt: string;  // Changed from created_at to match API response
  updatedAt?: string;
  image?: string;
  sites?: number;
  devices?: number;
  status?: string;
  description?: string;
  bb101?: boolean;
  triggerDevice?: boolean;
  notification?: boolean;
  [key: string]: any; // For any additional properties
}

// Interface for Site data
export interface Site {
  id: number;
  name: string;
  address?: string;
  description?: string;
  devices?: number;
  projectId: number;
  createdAt: string;
  updatedAt?: string;
  status?: string;
  location?: any[];
  isRemoved?: boolean;
  type?: string;
  locationText?: string;
  fields?: any[];
  [key: string]: any; // For any additional properties
}

// Function to fetch projects
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    console.log('Fetching projects from API...');
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "api_token": API_TOKEN
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.message || "Failed to fetch projects");
    }
    
    const data = await response.json();
    console.log('Projects API response:', data);
    
    // Updated to use data.list instead of data.data
    const projects = data.list || [];
    console.log('Number of projects received:', projects.length);
    
    // Transform API response to match our Project interface
    return projects.map((project: any) => ({
      id: project.id,
      name: project.name,
      customerId: project.customerId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      image: project.image,
      sites: project.sites,
      devices: project.devices,
      status: project.status || "Unknown",  // Default status if not provided
      description: project.description,
      bb101: project.bb101,
      triggerDevice: project.triggerDevice,
      notification: project.notification,
      ...project  // Include any other properties
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    toast.error("Failed to fetch projects. Please try again later.");
    return [];
  }
};

// Function to fetch a single project
export const fetchProject = async (id: string): Promise<Project | null> => {
  try {
    console.log(`Fetching project ${id} from API...`);
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "api_token": API_TOKEN
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response for single project:', errorData);
      throw new Error(errorData.message || "Failed to fetch project");
    }
    
    const data = await response.json();
    console.log(`Project ${id} API response:`, data);
    
    // Check if the response has a project property and use it
    const projectData = data.project || data;
    
    if (projectData) {
      return {
        id: projectData.id,
        name: projectData.name,
        customerId: projectData.customerId,
        createdAt: projectData.createdAt,
        updatedAt: projectData.updatedAt,
        image: projectData.image,
        sites: projectData.sites,
        devices: projectData.devices,
        status: projectData.status || "Unknown",
        description: projectData.description,
        bb101: projectData.bb101,
        triggerDevice: projectData.triggerDevice,
        notification: projectData.notification,
        ...projectData  // Include any other properties
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    toast.error("Failed to fetch project details. Please try again later.");
    return null;
  }
};

// Function to fetch sites for a project
export const fetchSites = async (projectId: number): Promise<Site[]> => {
  try {
    console.log(`Fetching sites for project ${projectId} from API...`);
    const response = await fetch(`${API_BASE_URL}/sites?projectid=${projectId}`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "api_token": API_TOKEN
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response for sites:', errorData);
      throw new Error(errorData.message || "Failed to fetch sites");
    }
    
    const data = await response.json();
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
