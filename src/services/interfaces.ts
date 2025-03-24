
// Interface for Project data
export interface Project {
  id: number;
  name: string;
  customerId?: number;
  createdAt: string;
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

// Interface for Zone data
export interface Zone {
  id: number;
  name: string;
  siteId: number;
  isRemoved?: boolean;
  location?: any[];
  description?: string;
  fields?: any[];
  createdAt: string;
  updatedAt?: string;
  type?: string;
  devices?: number;
  status?: string;
  [key: string]: any; // For any additional properties
}

// Interface for API response types
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  totalPages: number;
  itemTo: number;
  page: number;
  limit: number;
  pageSize: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface ProjectResponse {
  project: Project;
}
