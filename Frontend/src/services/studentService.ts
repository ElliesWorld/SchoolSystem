// src/services/studentService.ts
import { API_BASE_URL } from "../constants";
import type { GradesResponse } from "../types";
import { getAuthHeaders } from "../hooks/useAuth";

export const studentService = {
  async fetchGrades(): Promise<GradesResponse> {
    const res = await fetch(`${API_BASE_URL}/api/me/grades`, {
      headers: getAuthHeaders(),
    });

    if (res.status === 401 || res.status === 403) {
      console.warn("Got 401/403 from /api/me/grades – showing no grades.");
      return { grades: [] };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed with ${res.status}`);
    }

    return res.json();
  },
};