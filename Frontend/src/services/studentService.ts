// src/services/studentService.ts
import { API_BASE_URL } from "../constants";
import type { GradesResponse } from "../types";
import { getAuthHeaders } from "../hooks/useAuth";

export const studentService = {
  async fetchGrades(): Promise<GradesResponse> {
    console.log("🔍 Fetching grades...");
    console.log("API_BASE_URL:", API_BASE_URL);
    
    const headers = getAuthHeaders();
    console.log("Auth headers:", headers);
    
    const url = `${API_BASE_URL}/api/me/grades`;
    console.log("Request URL:", url);
    
    try {
      const res = await fetch(url, { headers });
      console.log("Response status:", res.status);
      
      if (res.status === 401 || res.status === 403) {
        console.warn("Got 401/403 from /api/me/grades – showing no grades.");
        return { grades: [] };
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed with ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Grades data received:", data);
      return data;
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  },
};