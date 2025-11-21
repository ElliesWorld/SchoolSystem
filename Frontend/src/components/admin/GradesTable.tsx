// src/components/admin/GradesTable.tsx
import React from "react";
import type { GradeCourse } from "../../types";

interface GradesTableProps {
  grades: GradeCourse[];
  loading?: boolean;
}

export const GradesTable: React.FC<GradesTableProps> = ({ 
  grades, 
  loading = false 
}) => {
  if (loading) {
    return <p>Loading grades…</p>;
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 13,
      }}
    >
      <thead>
        <tr style={{ borderBottom: "1px solid #eee" }}>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Year</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Subject</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Course</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Grade</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Date</th>
        </tr>
      </thead>
      <tbody>
        {grades.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ padding: "0.75rem", textAlign: "center" }}>
              No grades yet.
            </td>
          </tr>
        ) : (
          grades.map((g) => (
            <tr key={g.id} style={{ borderTop: "1px solid #f2f2f2" }}>
              <td style={{ padding: "0.5rem" }}>{g.year}</td>
              <td style={{ padding: "0.5rem" }}>{g.course.subject}</td>
              <td style={{ padding: "0.5rem" }}>{g.course.name}</td>
              <td style={{ padding: "0.5rem" }}>{g.grade ?? ""}</td>
              <td style={{ padding: "0.5rem" }}>
                {g.date ? new Date(g.date).toLocaleDateString() : ""}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};