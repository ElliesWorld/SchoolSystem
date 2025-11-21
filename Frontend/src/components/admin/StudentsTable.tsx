// src/components/admin/StudentsTable.tsx
import React from "react";
import type { Student } from "../../types";

interface StudentsTableProps {
  students: Student[];
  loading?: boolean;
  onStudentHover?: (student: Student | null) => void;
  onStudentClick?: (student: Student) => void; 
  pinnedStudentId?: string; 
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  loading = false,
  onStudentHover,
  onStudentClick,
  pinnedStudentId,
}) => {
  if (loading) {
    return <p>Loading students…</p>;
  }

  return (
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
          {students.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 12, textAlign: "center" }}>
                No students found.
              </td>
            </tr>
          ) : (
            students.map((student) => {
              const isPinned = pinnedStudentId === student.id;
              
              return (
                <tr
                  key={student.id}
                  onMouseEnter={() => onStudentHover?.(student)}
                  onMouseLeave={() => onStudentHover?.(null)}
                  onClick={() => onStudentClick?.(student)} 
                  style={{
                    borderTop: "1px solid #f2f2f2",
                    cursor: "pointer",
                    background: isPinned ? "#e0f2ff" : "transparent", 
                    transition: "background 0.15s",
                  }}
                  onMouseOver={(e) => {
                    if (!isPinned) {
                      e.currentTarget.style.background = "#f8f8f8";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isPinned) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <td style={{ padding: 8 }}>
                    {isPinned && "📌 "}
                    {student.user.email.split("@")[0]}
                  </td>
                  <td style={{ padding: 8 }}>{student.user.email}</td>
                  <td style={{ padding: 8 }}>{student.personNr ?? "-"}</td>
                  <td style={{ padding: 8 }}>{student.phoneNr ?? "-"}</td>
                  <td style={{ padding: 8 }}>{student.address ?? "-"}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};