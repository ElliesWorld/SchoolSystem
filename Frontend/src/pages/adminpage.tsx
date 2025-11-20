// src/pages/adminpage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

type Student = {
  id: string;
  year: number;
  personNr: string | null;
  phoneNr: string | null;
  address: string | null;
  user: { email: string };
};

type StudentsResponse = {
  students: Student[];
};

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const storage = localStorage.getItem("idToken") ? localStorage : sessionStorage;
  const idToken = storage.getItem("idToken");
  const userEmail = storage.getItem("userEmail") ?? "";

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3 | "all">("all");
  const [hoveredStudent, setHoveredStudent] = useState<Student | null>(null);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

async function fetchStudents(year: 1 | 2 | 3 | "all" = "all") {
  // We don’t require a token for this school project.
  // Even if token is missing, we’ll still try to fetch,
  // and if backend returns 401 we just show empty table.
  setLoading(true);
  setError(null);

  try {
    const params =
      year === "all" ? "" : `?year=${encodeURIComponent(year.toString())}`;

    const res = await fetch(`${API_BASE_URL}/api/admin/students${params}`, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    });

    // If backend still returns 401/403, just show no students
    // instead of a red "not logged in" error.
    if (res.status === 401 || res.status === 403) {
      console.warn("Got 401/403 from /api/admin/students – showing no students.");
      setStudents([]);
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed with ${res.status}`);
    }

    const data: StudentsResponse = await res.json();
    setStudents(data.students);
  } catch (err: unknown) {
    console.error(err);
    setError(
      err instanceof Error ? err.message : "Failed to load students"
    );
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    fetchStudents("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idToken]);

  function handleLogout() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("idToken");
    sessionStorage.removeItem("userEmail");
    navigate("/loginpage");
  }

  function handleYearClick(year: 1 | 2 | 3 | "all") {
    setSelectedYear(year);
    fetchStudents(year);
  }

  async function handleCsvUpload() {
    if (!csvFile || !idToken) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await fetch(
        `${API_BASE_URL}/api/admin/students/import-csv`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Upload failed with ${res.status}`);
      }

      await fetchStudents(selectedYear);
      setCsvFile(null);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to import CSV");
    } finally {
      setUploading(false);
    }
  }

  const filteredStudents =
    selectedYear === "all"
      ? students
      : students.filter((s) => s.year === selectedYear);

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
            onClick={() => navigate("/adminmenu")}
            style={{
              border: "none",
              background: "none",
              fontSize: "1.3rem",
              cursor: "pointer",
              marginRight: 8,
            }}
            title="Back to admin menu"
          >
            ←
          </button>
          <span style={{ fontSize: "1.3rem", fontWeight: 600 }}>Admin</span>
        </div>
        <div style={{ textAlign: "right", fontSize: 14 }}>
          <div>{userEmail || "Admin"}</div>
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 16,
          }}
        >
          {/* Student table */}
          <section
            style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h2 style={{ fontSize: "1.1rem" }}>Students</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {["all", 1, 2, 3].map((year) => (
                  <button
                    key={year}
                    onClick={() =>
                      handleYearClick(
                        year === "all" ? "all" : (year as 1 | 2 | 3)
                      )
                    }
                    style={{
                      padding: "0.25rem 0.7rem",
                      borderRadius: 999,
                      border: "1px solid #ddd",
                      background:
                        selectedYear === year ? "#0070f3" : "transparent",
                      color: selectedYear === year ? "#fff" : "#333",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {year === "all" ? "All" : `Year ${year}`}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div
                style={{ marginBottom: 8, color: "#b00020", fontSize: 13 }}
              >
                {error}
              </div>
            )}

            {loading ? (
              <p>Loading students…</p>
            ) : (
              <div
                style={{
                  maxHeight: 400,
                  overflow: "auto",
                  border: "1px solid #eee",
                  borderRadius: 8,
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
                    <tr style={{ background: "#fafafa" }}>
                      <th style={{ padding: 8, textAlign: "left" }}>Full name</th>
                      <th style={{ padding: 8, textAlign: "left" }}>Email</th>
                      <th style={{ padding: 8, textAlign: "left" }}>Personal ID</th>
                      <th style={{ padding: 8, textAlign: "left" }}>Tel</th>
                      <th style={{ padding: 8, textAlign: "left" }}>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: 12, textAlign: "center" }}>
                          No students found.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s) => (
                        <tr
                          key={s.id}
                          onMouseEnter={() => setHoveredStudent(s)}
                          style={{ borderTop: "1px solid #f2f2f2", cursor: "pointer" }}
                        >
                          <td style={{ padding: 8 }}>
                            {s.user.email.split("@")[0]}
                          </td>
                          <td style={{ padding: 8 }}>{s.user.email}</td>
                          <td style={{ padding: 8 }}>{s.personNr ?? "-"}</td>
                          <td style={{ padding: 8 }}>{s.phoneNr ?? "-"}</td>
                          <td style={{ padding: 8 }}>{s.address ?? "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Hover pop-up + CSV import */}
          <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                minHeight: 150,
              }}
            >
              <h3 style={{ fontSize: "1rem", marginBottom: 8 }}>Student details</h3>
              {hoveredStudent ? (
                <div style={{ fontSize: 13 }}>
                  <p>
                    <strong>Name:</strong>{" "}
                    {hoveredStudent.user.email.split("@")[0]}
                  </p>
                  <p>
                    <strong>Email:</strong> {hoveredStudent.user.email}
                  </p>
                  <p>
                    <strong>Personal ID:</strong> {hoveredStudent.personNr ?? "-"}
                  </p>
                  <p>
                    <strong>Tel:</strong> {hoveredStudent.phoneNr ?? "-"}
                  </p>
                  <p>
                    <strong>Address:</strong> {hoveredStudent.address ?? "-"}
                  </p>
                  <p>
                    <strong>Year:</strong> {hoveredStudent.year}
                  </p>
                  {/* Edit/Delete buttons (wiring later) */}
                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: 999,
                        border: "1px solid #ccc",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: 999,
                        border: "1px solid #b00020",
                        color: "#b00020",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "#777" }}>
                  Hover over a student row to see details here.
                </p>
              )}
            </div>

            <div
              style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ fontSize: "1rem", marginBottom: 8 }}>
                Import students (Excel / CSV)
              </h3>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
                Upload a CSV exported from Excel with columns:{" "}
                <code>fullName,email,personNr,phoneNr,address,year</code>
              </p>

              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
                style={{ marginBottom: 8 }}
              />

              <button
                type="button"
                disabled={!csvFile || uploading}
                onClick={handleCsvUpload}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: 999,
                  border: "none",
                  background: !csvFile ? "#ccc" : "#0070f3",
                  color: "#fff",
                  fontSize: 13,
                  cursor:
                    csvFile && !uploading ? "pointer" : "not-allowed",
                }}
              >
                {uploading ? "Uploading…" : "Import CSV"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate("/adminregistergrades")}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: 999,
                border: "1px solid #0070f3",
                background: "#fff",
                color: "#0070f3",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Go to Register Grades
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
