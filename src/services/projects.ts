
import { apiRequest } from "./api-client";
import { Project, PaginatedResponse, ProjectResponse } from "./interfaces";
import { toast } from "sonner";

// Cache for project devices counts from the list endpoint
export const projectDevicesCache: Record<number, number> = {};

// Function to fetch projects
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    console.log('Fetching projects from API...');
    const data = await apiRequest<PaginatedResponse<Project>>('/projects');
    console.log('Projects API response:', data);
    
    // Get projects from the list
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
      sites: typeof project.sites === 'number' ? project.sites : parseInt(project.sites, 10) || 0,
      devices: typeof project.devices === 'number' ? project.devices : parseInt(project.devices, 10) || 0,
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
    
    // First, try to get the project from the projects list to ensure we have accurate device count
    try {
      const projectsData = await apiRequest<PaginatedResponse<Project>>('/projects');
      const projectsList = projectsData.list || [];
      const projectId = parseInt(id, 10);
      const matchingProject = projectsList.find((p: any) => p.id === projectId);
      
      if (matchingProject && matchingProject.devices !== undefined) {
        console.log(`Caching device count ${matchingProject.devices} for project ${id}`);
        projectDevicesCache[projectId] = matchingProject.devices;
      }
    } catch (listError) {
      console.error("Error fetching projects list for device count:", listError);
    }
    
    // Now fetch the individual project details
    const data = await apiRequest<ProjectResponse>(`/projects/${id}`);
    console.log(`Project ${id} API response:`, data);
    
    // Check if the response has a project property and use it
    const projectData = data.project || data;
    
    if (projectData) {
      const projectId = projectData.id;
      
      // Use the cached device count if available, otherwise use the one from the response
      let deviceCount = projectData.devices;
      
      // If device count is missing or zero, try to use the cached value
      if (deviceCount === 0 || deviceCount === undefined || deviceCount === null) {
        if (projectDevicesCache[projectId] !== undefined) {
          console.log(`Using cached device count: ${projectDevicesCache[projectId]}`);
          deviceCount = projectDevicesCache[projectId];
        }
      }
      
      console.log(`Final device count for project ${id}:`, deviceCount);
      
      return {
        id: projectData.id,
        name: projectData.name,
        customerId: projectData.customerId,
        createdAt: projectData.createdAt,
        updatedAt: projectData.updatedAt,
        image: projectData.image,
        sites: typeof projectData.sites === 'number' ? projectData.sites : parseInt(projectData.sites, 10) || 0,
        devices: typeof deviceCount === 'number' ? deviceCount : parseInt(deviceCount, 10) || 0,
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
