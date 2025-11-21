// src/services/adminService.ts
import { API_BASE_URL } from "../constants";
import type { StudentsResponse, RegisterResponse, YearFilter } from "../types";
import { getAuthHeaders } from "../hooks/useAuth";

export const adminService = {
  async fetchStudents(year: YearFilter = "all"): Promise<StudentsResponse> {
    const params = year === "all" ? "" : `?year=${encodeURIComponent(year.toString())}`;
    
    const res = await fetch(`${API_BASE_URL}/api/admin/students${params}`, {
      headers: getAuthHeaders(),
    });

    if (res.status === 401 || res.status === 403) {
      console.warn("Got 401/403 from /api/admin/students – showing no students.");
      return { students: [] };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed with ${res.status}`);
    }

    return res.json();
  },

  async importStudentsCsv(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/api/admin/students/import-csv`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Upload failed with ${res.status}`);
    }
  },

  async fetchGradeRegister(
    year: number,
    courseId: string
  ): Promise<RegisterResponse> {
    const params = new URLSearchParams();
    params.set("year", String(year));
    params.set("courseId", courseId);

    const res = await fetch(
      `${API_BASE_URL}/api/admin/grades?${params.toString()}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed with ${res.status}`);
    }

    return res.json();
  },

  async saveGrade(
    studentId: string,
    courseId: string,
    grade: string,
    year: number
  ): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/admin/grades`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        courseId,
        grade,
        year,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Failed with ${res.status}`);
    }
  },
};