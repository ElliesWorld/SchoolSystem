// src/pages/adminregistergrades.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

type RegisterRow = {
  studentId: string;
  name: string;
  grade: string | null;
  date: string | null;
};

type RegisterResponse = {
  rows: RegisterRow[];
};

type Course = {
  id: string;
  name: string;
  subject: string;
  yearOffered: number;
};

const AdminRegisterGradesPage: React.FC = () => {
  const navigate = useNavigate();
  const storage = localStorage.getItem("idToken") ? localStorage : sessionStorage;
  const idToken = storage.getItem("idToken");

  const [year, setYear] = useState<1 | 2 | 3 | "all">("all");
  const [subject, setSubject] = useState<string | "">("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [rows, setRows] = useState<RegisterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace this with real API: GET /api/admin/courses
  // For now, you can hard-code or fetch from backend when you create that endpoint.
  useEffect(() => {
    // Hardcoded example; adjust to your real courses
    const mock: Course[] = [
      { id: "course-1", name: "Engelska 5", subject: "English", yearOffered: 1 },
      { id: "course-2", name: "Filosofi 1", subject: "Philosophy", yearOffered: 1 },
      { id: "course-3", name: "Engelska 6", subject: "English", yearOffered: 2 },
    ];
    setCourses(mock);
  }, []);

  async function loadRegister() {
    if (!idToken) {
      setError("Not logged in");
      return;
    }
    if (!courseId || year === "all") {
      setRows([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("year", String(year));
      params.set("courseId", courseId);

      const res = await fetch(
        `${API_BASE_URL}/api/admin/grades?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed with ${res.status}`);
      }

      const data: RegisterResponse = await res.json();
      setRows(data.rows);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load register");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRegister();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, courseId]);

  async function saveGrade(studentId: string, grade: string) {
    if (!idToken) return;
    if (!courseId || year === "all") return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/grades`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
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

      await loadRegister();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save grade");
    } finally {
      setSaving(false);
    }
  }

  const availableSubjects = Array.from(
    new Set(courses.map((c) => c.subject))
  ).sort();

  const filteredCourses = courses.filter((c) =>
    subject ? c.subject === subject : true
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f4" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div>
          <button
            onClick={() => navigate("/admin")}
            style={{
              border: "none",
              background: "none",
              fontSize: "1.3rem",
              cursor: "pointer",
              marginRight: 8,
            }}
            title="Back to all students"
          >
            ←
          </button>
          <span style={{ fontSize: "1.3rem", fontWeight: 600 }}>
            Register Grades
          </span>
        </div>
      </header>

      <main style={{ padding: "1.5rem 2rem" }}>
        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {["all", 1, 2, 3].map((y) => (
              <button
                key={y}
                onClick={() =>
                  setYear(y === "all" ? "all" : (y as 1 | 2 | 3))
                }
                style={{
                  padding: "0.25rem 0.7rem",
                  borderRadius: 999,
                  border: "1px solid #ddd",
                  background: year === y ? "#0070f3" : "transparent",
                  color: year === y ? "#fff" : "#333",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {y === "all" ? "All" : `Year ${y}`}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 13 }}>
            Subject:{" "}
            <select
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value === "" ? "" : e.target.value)
              }
              style={{ padding: "0.25rem 0.5rem", borderRadius: 6 }}
            >
              <option value="">All</option>
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: 13 }}>
            Course:{" "}
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              style={{ padding: "0.25rem 0.5rem", borderRadius: 6 }}
            >
              <option value="">Select course</option>
              {filteredCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.subject}, Year {c.yearOffered})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 8, color: "#b00020", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Register grades table */}
        <div
          style={{
            background: "#fff",
            padding: "1rem",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {loading ? (
            <p>Loading register…</p>
          ) : rows.length === 0 ? (
            <p style={{ fontSize: 13, color: "#777" }}>
              No rows to show. Choose year and course.
            </p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <th style={{ textAlign: "left", padding: 8 }}>Full name</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Grade</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.studentId} style={{ borderTop: "1px solid #f2f2f2" }}>
                    <td style={{ padding: 8 }}>{row.name}</td>
                    <td style={{ padding: 8 }}>
                      <select
                        value={row.grade ?? ""}
                        disabled={saving}
                        onChange={(e) =>
                          saveGrade(row.studentId, e.target.value)
                        }
                      >
                        <option value="">(none)</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                      </select>
                    </td>
                    <td style={{ padding: 8 }}>
                      {row.date ? new Date(row.date).toLocaleDateString() : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminRegisterGradesPage;
