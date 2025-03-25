
import { toast } from "sonner";

// API Token
export const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxMSIsImlhdCI6MTc0MjgxNDc2MiwiZXhwIjozNzk2NjY5NTI0fQ.hoawe56oJZwLzTwMRxWIqYk80OGIfnSBGERs9ZzrToo";

// Base URL for the API
export const API_BASE_URL = "https://api-prod.novacene.io/api/v2";

// Generic request function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const headers = {
      "accept": "application/json",
      "api_token": API_TOKEN,
      ...(options.headers || {})
    };

    console.log(`🌐 API Request: ${API_BASE_URL}${endpoint}`);
    console.time(`API call to ${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      ...options,
      headers
    });

    console.timeEnd(`API call to ${endpoint}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ API Response for ${endpoint}:`, {
      status: response.status,
      dataSize: JSON.stringify(data).length,
      dataPreview: JSON.stringify(data).slice(0, 200) + '...',
    });
    
    return data;
  } catch (error) {
    console.error(`❌ Error in API request to ${endpoint}:`, error);
    toast.error(`API request failed: ${(error as Error).message}`);
    throw error;
  }
}
