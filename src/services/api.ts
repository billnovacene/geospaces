
import { toast } from "sonner";

// API Token
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxMSIsImlhdCI6MTc0MjgxNDc2MiwiZXhwIjozNzk2NjY5NTI0fQ.hoawe56oJZwLzTwMRxWIqYk80OGIfnSBGERs9ZzrToo";

// Base URL for the API
const API_BASE_URL = "https://api-prod.novacene.io/api/v2";

// Interface for Project data
export interface Project {
  id: string;
  created_at: string;
  name: string;
  default_team_id: string;
  status: string;
  description?: string;
  [key: string]: any; // For any additional properties
}

// Function to fetch projects
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "api_token": API_TOKEN
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch projects");
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    toast.error("Failed to fetch projects. Please try again later.");
    return [];
  }
};

// Function to fetch a single project
export const fetchProject = async (id: string): Promise<Project | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "api_token": API_TOKEN
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch project");
    }
    
    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    toast.error("Failed to fetch project details. Please try again later.");
    return null;
  }
};
