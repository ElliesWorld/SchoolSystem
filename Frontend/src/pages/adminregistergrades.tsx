// src/pages/adminregistergrades.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

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
  const storage = localStorage.getItem("idToken")
    ? localStorage
    : sessionStorage;
  const idToken = storage.getItem("idToken");

  const [year, setYear] = useState<1 | 2 | 3 | "all">("all");
  const [subject, setSubject] = useState<string | "">("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [rows, setRows] = useState<RegisterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch real courses from backend
  useEffect(() => {
    async function fetchCourses() {
      if (!idToken) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/courses`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to fetch courses");
        }

        const data = await res.json();
        setCourses(data.courses);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Failed to load courses");
      }
    }

    fetchCourses();
  }, [idToken]);

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#e0f2fe, #f9fafb)", // soft blue background
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Open Sans", sans-serif',
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "#0f172a",
          color: "#f9fafb",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => navigate("/adminmenu")}
            style={{
              border: "none",
              background: "none",
              fontSize: "1.3rem",
              cursor: "pointer",
              marginRight: 4,
              color: "#e5e7eb",
            }}
            title="Back to admin menu"
          >
            ←
          </button>
          <span
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            Register Grades
          </span>
        </div>
      </header>

      <main style={{ padding: "2.5rem 2rem" }}>
        {/* Filters */}
        <div
          style={{
            margin: "0 auto 1.5rem",
            maxWidth: 960,
            background: "#ffffff",
            borderRadius: 18,
            padding: "1rem 1.25rem",
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "#4b5563" }}>
            Year:
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["all", 1, 2, 3].map((y) => (
              <button
                key={y}
                onClick={() =>
                  setYear(y === "all" ? "all" : (y as 1 | 2 | 3))
                }
                style={{
                  padding: "0.3rem 0.9rem",
                  borderRadius: 999,
                  border:
                    year === y ? "1px solid #0ea5e9" : "1px solid #e5e7eb",
                  background: year === y ? "#0ea5e9" : "#ffffff",
                  color: year === y ? "#ffffff" : "#111827",
                  fontSize: 12,
                  cursor: "pointer",
                  boxShadow:
                    year === y
                      ? "0 6px 16px rgba(14, 165, 233, 0.35)"
                      : "none",
                }}
              >
                {y === "all" ? "All" : `Year ${y}`}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "#4b5563",
            }}
          >
            <span>Subject:</span>
            <select
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value === "" ? "" : e.target.value)
              }
              style={{
                padding: "0.3rem 0.6rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 13,
              }}
            >
              <option value="">All</option>
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "#4b5563",
            }}
          >
            <span>Course:</span>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              style={{
                padding: "0.3rem 0.6rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 13,
                minWidth: 180,
              }}
            >
              <option value="">
                {subject ? "Select course" : "Select subject and course"}
              </option>
              {filteredCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.subject}, Year {c.yearOffered})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div
            style={{
              margin: "0 auto 12px",
              maxWidth: 960,
              color: "#b91c1c",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* Register grades table */}
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            background: "#ffffff",
            padding: "1.2rem 1.4rem",
            borderRadius: 18,
            boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
          }}
        >
          {loading ? (
            <p style={{ fontSize: 14 }}>Loading register…</p>
          ) : rows.length === 0 ? (
            <div
              style={{
                padding: "1.5rem 1rem",
                borderRadius: 16,
                border: "1px dashed #cbd5f5",
                background: "#f9fafb",
                textAlign: "center",
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>📋</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                No rows to show
              </div>
              <div>Choose a year and course to start registering grades.</div>
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    background: "#f1f5f9",
                  }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      padding: 8,
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Full name
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 8,
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Grade
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 8,
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.studentId}
                    style={{
                      borderTop: "1px solid #f1f5f9",
                      background:
                        index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    <td style={{ padding: 8 }}>{row.name}</td>
                    <td style={{ padding: 8 }}>
                      <select
                        value={row.grade ?? ""}
                        disabled={saving}
                        onChange={(e) =>
                          saveGrade(row.studentId, e.target.value)
                        }
                        style={{
                          padding: "0.2rem 0.4rem",
                          borderRadius: 6,
                          border: "1px solid #d1d5db",
                          fontSize: 13,
                        }}
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
                      {row.date
                        ? new Date(row.date).toLocaleDateString()
                        : ""}
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
