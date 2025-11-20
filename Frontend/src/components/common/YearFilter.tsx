// src/components/common/YearFilter.tsx
import React from "react";
import type { YearFilter as YearFilterType } from "../../types";

interface YearFilterProps {
  selectedYear: YearFilterType;
  onYearChange: (year: YearFilterType) => void;
}

export const YearFilter: React.FC<YearFilterProps> = ({
  selectedYear,
  onYearChange,
}) => {
  const years: YearFilterType[] = ["all", 1, 2, 3];

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          style={{
            padding: "0.25rem 0.7rem",
            borderRadius: 999,
            border: "1px solid #ddd",
            background: selectedYear === year ? "#0070f3" : "transparent",
            color: selectedYear === year ? "#fff" : "#333",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {year === "all" ? "All" : `Year ${year}`}
        </button>
      ))}
    </div>
  );
};