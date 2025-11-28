// src/pages/adminpage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, AppHeader, PageMain } from "../components/layout";
import { Card, YearFilter, ErrorMessage, Button } from "../components/common";
import { StudentsTable } from "../components/admin";
import { useAuth } from "../hooks/useAuth";
import { adminService } from "../services/adminService";
import type { Student, YearFilter as YearFilterType } from "../types";
import { ROUTES } from "../constants";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedYear, setSelectedYear] = useState<YearFilterType>("all");
  const [hoveredStudent, setHoveredStudent] = useState<Student | null>(null);
  const [pinnedStudent, setPinnedStudent] = useState<Student | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents("all");
  }, []);

  async function fetchStudents(year: YearFilterType) {
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.fetchStudents(year);
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

  function handleYearChange(year: YearFilterType) {
    setSelectedYear(year);
    fetchStudents(year);
  }

  async function handleCsvUpload() {
    if (!csvFile) return;

    setUploading(true);
    setError(null);

    try {
      await adminService.importStudentsCsv(csvFile);
      await fetchStudents(selectedYear);
      setCsvFile(null);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to import CSV");
    } finally {
      setUploading(false);
    }
  }

  function handleStudentClick(student: Student) {
    if (pinnedStudent?.id === student.id) {
      setPinnedStudent(null);
    } else {
      setPinnedStudent(student);
    }
  }

  // 🔹 Edit the pinned student (simple prompts)
  async function handleEditPinnedStudent() {
    if (!pinnedStudent) return;

    try {
      const newPersonNr =
        window.prompt("Personal ID:", pinnedStudent.personNr ?? "") ?? "";
      const newPhone =
        window.prompt("Tel:", pinnedStudent.phoneNr ?? "") ?? "";
      const newAddress =
        window.prompt("Address:", pinnedStudent.address ?? "") ?? "";
      const yearInput =
        window.prompt("Year (1–3):", String(pinnedStudent.year)) ?? "";
      const newYear = Number(yearInput);

      if (!newYear || newYear < 1 || newYear > 3) {
        alert("Year must be 1, 2, or 3");
        return;
      }

      await adminService.updateStudent(pinnedStudent.id, {
        personNr: newPersonNr || null,
        phoneNr: newPhone || null,
        address: newAddress || null,
        year: newYear,
      });

      // Refresh list & pinned student
      await fetchStudents(selectedYear);
      const updated = students.find((s) => s.id === pinnedStudent.id);
      if (updated) setPinnedStudent(updated);
    } catch (err: unknown) {
      console.error(err);
      alert(
        err instanceof Error ? err.message : "Failed to update student"
      );
    }
  }

  // 🔹 Delete the pinned student
  async function handleDeletePinnedStudent() {
    if (!pinnedStudent) return;

    const confirmDelete = window.confirm(
      `Delete student ${pinnedStudent.user.email}? This will remove their record permanently.`
    );
    if (!confirmDelete) return;

    try {
      await adminService.deleteStudent(pinnedStudent.id);
      setPinnedStudent(null);
      await fetchStudents(selectedYear);
    } catch (err: unknown) {
      console.error(err);
      alert(
        err instanceof Error ? err.message : "Failed to delete student"
      );
    }
  }

  const filteredStudents =
    selectedYear === "all"
      ? students
      : students.filter((s) => s.year === selectedYear);

  const displayedStudent = pinnedStudent || hoveredStudent;

  return (
    <PageContainer>
      <AppHeader
        title="Admin"
        userEmail={userEmail || "Admin"}
        onLogout={logout}
        showBackButton
        backRoute={ROUTES.ADMIN_MENU}
      />

      <PageMain>
        <div
          style={{
            minHeight: "calc(100vh - 70px)",
            background: "linear-gradient(#E0F2FE, #F9FAFB)",
            padding: "2rem 1.5rem",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 20,
              alignItems: "flex-start",
            }}
          >
            {/* Student table */}
            <Card
              title="👥 Students"
              actions={
                <YearFilter
                  selectedYear={selectedYear}
                  onYearChange={handleYearChange}
                />
              }
            >
              <ErrorMessage message={error} />
              <StudentsTable
                students={filteredStudents}
                loading={loading}
                onStudentHover={setHoveredStudent}
                onStudentClick={handleStudentClick}
                pinnedStudentId={pinnedStudent?.id}
              />
            </Card>

            {/* Sidebar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Student details */}
              <Card
                title="👤 Student details"
                style={{ minHeight: 170 }}
                actions={
                  pinnedStudent && (
                    <button
                      onClick={() => setPinnedStudent(null)}
                      style={{
                        border: "none",
                        background: "none",
                        color: "#0070f3",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      ✕ Unpin
                    </button>
                  )
                }
              >
                {displayedStudent ? (
                  <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                    <p>
                      <strong>Name:</strong>{" "}
                      {displayedStudent.user.email.split("@")[0]}
                    </p>
                    <p>
                      <strong>Email:</strong> {displayedStudent.user.email}
                    </p>
                    <p>
                      <strong>Personal ID:</strong>{" "}
                      {displayedStudent.personNr ?? "-"}
                    </p>
                    <p>
                      <strong>Tel:</strong> {displayedStudent.phoneNr ?? "-"}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {displayedStudent.address ?? "-"}
                    </p>
                    <p>
                      <strong>Year:</strong> {displayedStudent.year}
                    </p>

                    {pinnedStudent && (
                      <div
                        style={{
                          marginTop: 12,
                          display: "flex",
                          gap: 8,
                        }}
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleEditPinnedStudent}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={handleDeletePinnedStudent}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#777",
                      lineHeight: 1.5,
                    }}
                  >
                    Hover over a student to preview their details, or click a
                    row to pin a student here for editing.
                  </p>
                )}
              </Card>

              {/* CSV import */}
              <Card title="📥 Import students (Excel / CSV)">
                <p
                  style={{
                    fontSize: 13,
                    color: "#555",
                    marginBottom: 10,
                    lineHeight: 1.5,
                  }}
                >
                  Import students from a CSV file. Make sure your file has these
                  columns:{" "}
                  <code style={{ fontSize: 11 }}>
                    fullName, email, personNr, phoneNr, address, year
                  </code>
                  .
                </p>

                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
                  style={{
                    marginBottom: 10,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                />

                <Button
                  size="md"
                  variant="primary"
                  disabled={!csvFile}
                  loading={uploading}
                  onClick={handleCsvUpload}
                >
                  Import CSV
                </Button>
              </Card>

              <Button
                variant="secondary"
                onClick={() => navigate(ROUTES.ADMIN_REGISTER_GRADES)}
              >
                Go to Register Grades
              </Button>
            </div>
          </div>
        </div>
      </PageMain>
    </PageContainer>
  );
};

export default AdminPage;
