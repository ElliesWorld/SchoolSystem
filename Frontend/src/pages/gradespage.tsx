// src/pages/gradespage.tsx
import React, { useEffect, useState } from "react";
import { PageContainer, AppHeader, PageMain } from "../components/layout";
import { Card, YearFilter, ErrorMessage } from "../components/common";
import { GradesTable } from "../components/admin";
import { useAuth } from "../hooks/useAuth";
import { studentService } from "../services/studentService";
import type { GradeCourse, YearFilter as YearFilterType } from "../types";

const GradesPage: React.FC = () => {
  const { userEmail, logout } = useAuth();

  const [grades, setGrades] = useState<GradeCourse[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<GradeCourse[]>([]);
  const [selectedYear, setSelectedYear] = useState<YearFilterType>("all");
  const [selectedSubject, setSelectedSubject] = useState<string | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGrades();
  }, []);

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

  async function fetchGrades() {
    setLoading(true);
    setError(null);

    try {
      const data = await studentService.fetchGrades();
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

  const subjects = Array.from(
    new Set(grades.map((g) => g.course.subject))
  ).sort();

  return (
    <PageContainer>
      <AppHeader
        title="Grades"
        userEmail={userEmail || "Student"}
        onLogout={logout}
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
    <h2 style={{ marginBottom: 12 }}>My Grades</h2>

    {/* Filters */}
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <YearFilter
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

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

    <ErrorMessage message={error} />

    <Card>
      <GradesTable grades={filteredGrades} loading={loading} />
    </Card>
  </div>
</PageMain>

    </PageContainer>
  );
};

export default GradesPage;