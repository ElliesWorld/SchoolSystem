// src/pages/grades.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

type GradeCourse = {
  id: string;
  grade: string | null;
  year: number;
  date: string | null;
  course: {
    id: string;
    name: string;
    subject: string;
    yearOffered: number;
  };
};

type GradesResponse = {
  grades: GradeCourse[];
};

const GradesPage: React.FC = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<GradeCourse[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<GradeCourse[]>([]);
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3 | "all">("all");
  const [selectedSubject, setSelectedSubject] = useState<string | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storage = localStorage.getItem("idToken") ? localStorage : sessionStorage;
  const idToken = storage.getItem("idToken");
  const userEmail = storage.getItem("userEmail") ?? "";

async function fetchGrades() {
  setLoading(true);
  setError(null);

  try {
    const res = await fetch(`${API_BASE_URL}/api/me/grades`, {
      headers: idToken
        ? { Authorization: `Bearer ${idToken}` }
        : {}, // no header if no token
    });

    // If the backend still uses auth and returns 401/403,
    // we just show an empty table (no red error).
    if (res.status === 401 || res.status === 403) {
      console.warn("Got 401/403 from /api/me/grades – showing no grades.");
      setGrades([]);
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed with ${res.status}`);
    }

    const data: GradesResponse = await res.json();
    setGrades(data.grades);
  } catch (err: unknown) {
    console.error(err);
    setError(
      err instanceof Error ? err.message : "Failed to load grades"
    );
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    fetchGrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute subject list & filtered rows
  useEffect(() => {
    let result = grades;

    if (selectedYear !== "all") {
      result = result.filter((g) => g.year === selectedYear);
    }

    if (selectedSubject !== "all") {
      result = result.filter((g) => g.course.subject === selectedSubject);
    }

    setFilteredGrades(result);
  }, [grades, selectedYear, selectedSubject]);

  const subjects = Array.from(
    new Set(grades.map((g) => g.course.subject))
  ).sort();

  function handleLogout() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("idToken");
    sessionStorage.removeItem("userEmail");
    navigate("/loginpage");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f4" }}>
      {/* Top bar with back arrow */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <button
          onClick={() => navigate("/loginpage")}
          style={{
            border: "none",
            background: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          title="Back to login"
        >
          ←
        </button>
        <div style={{ textAlign: "right", fontSize: 14 }}>
          <div>{userEmail || "Student"}</div>
          <button
            onClick={handleLogout}
            style={{
              border: "none",
              background: "none",
              color: "#0070f3",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: "1.5rem 2rem" }}>
        <h2 style={{ marginBottom: 12 }}>Grades</h2>

        {/* Year filter + subject dropdown */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {["all", 1, 2, 3].map((year) => (
              <button
                key={year}
                type="button"
                onClick={() =>
                  setSelectedYear(year === "all" ? "all" : (year as 1 | 2 | 3))
                }
                style={{
                  padding: "0.3rem 0.8rem",
                  borderRadius: 999,
                  border: "1px solid #ddd",
                  background: selectedYear === year ? "#0070f3" : "#fff",
                  color: selectedYear === year ? "#fff" : "#333",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {year === "all" ? "All" : `Year ${year}`}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 13 }}>
            Subject:{" "}
            <select
              value={selectedSubject}
              onChange={(e) =>
                setSelectedSubject(
                  e.target.value === "all" ? "all" : e.target.value
                )
              }
              style={{ padding: "0.25rem 0.5rem", borderRadius: 6 }}
            >
              <option value="all">All subjects</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 12, color: "#b00020", fontSize: 13 }}>
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading grades…</p>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Year
                  </th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Subject
                  </th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Course
                  </th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Grade
                  </th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ padding: "0.75rem", textAlign: "center" }}
                    >
                      No grades yet.
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map((g) => (
                    <tr key={g.id} style={{ borderTop: "1px solid #f2f2f2" }}>
                      <td style={{ padding: "0.5rem" }}>{g.year}</td>
                      <td style={{ padding: "0.5rem" }}>
                        {g.course.subject}
                      </td>
                      <td style={{ padding: "0.5rem" }}>{g.course.name}</td>
                      <td style={{ padding: "0.5rem" }}>
                        {/* if grade is null → empty, as per spec */}
                        {g.grade ?? ""}
                      </td>
                      <td style={{ padding: "0.5rem" }}>
                        {g.date ? new Date(g.date).toLocaleDateString() : ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default GradesPage;
