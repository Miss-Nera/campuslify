"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Student {
  matricNumber: string;
  fullName: string;
  department: string;
  course?: string;
  test?: number;
  assignment?: number;
  exam?: number;
  attendance?: number;
  total?: number;
  grade?: string;
}

const RESULTS_KEY = "studentResults";

export default function LecturerResultsPage() {
  const [students, setStudents] = useState<Student[]>([
    {
      matricNumber: "MAT001",
      fullName: "John Doe",
      department: "Computer Science",
    },
    {
      matricNumber: "MAT002",
      fullName: "Jane Smith",
      department: "Mathematics",
    },
  ]);

  // handle score or course update
  const handleChange = (
    index: number,
    field: keyof Student,
    value: string
  ) => {
    const updated = [...students];
    const student = updated[index];

    if (field === "course") {
      student.course = value;
    } else if (
      field === "test" ||
      field === "assignment" ||
      field === "exam" ||
      field === "attendance"
    ) {
      student[field] = value === "" ? undefined : Number(value);
    }

    // recalc total + grade if any score exists
    const total =
      (student.test ?? 0) +
      (student.assignment ?? 0) +
      (student.exam ?? 0) +
      (student.attendance ?? 0);

    if (
      student.test !== undefined ||
      student.assignment !== undefined ||
      student.exam !== undefined ||
      student.attendance !== undefined
    ) {
      student.total = total;

      if (total >= 70) student.grade = "A";
      else if (total >= 60) student.grade = "B";
      else if (total >= 50) student.grade = "C";
      else if (total >= 45) student.grade = "D";
      else if (total >= 40) student.grade = "E";
      else student.grade = "F";
    }

    setStudents(updated);
  };

  const handleSave = () => {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(students));
    alert("Results saved successfully!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lecturer Result Entry</h1>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Matric Number</th>
            <th className="p-2 border">Full Name</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Course</th>
            <th className="p-2 border">Test</th>
            <th className="p-2 border">Assignment</th>
            <th className="p-2 border">Exam</th>
            <th className="p-2 border">Attendance</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.matricNumber} className="text-center">
              <td className="border p-2">{student.matricNumber}</td>
              <td className="border p-2">{student.fullName}</td>
              <td className="border p-2">{student.department}</td>
              <td className="border p-2">
                <Input
                  value={student.course || ""}
                  onChange={(e) =>
                    handleChange(index, "course", e.target.value)
                  }
                  placeholder="Enter course"
                />
              </td>
              <td className="border p-2">
                <Input
                  type="number"
                  value={student.test ?? ""}
                  onChange={(e) =>
                    handleChange(index, "test", e.target.value)
                  }
                />
              </td>
              <td className="border p-2">
                <Input
                  type="number"
                  value={student.assignment ?? ""}
                  onChange={(e) =>
                    handleChange(index, "assignment", e.target.value)
                  }
                />
              </td>
              <td className="border p-2">
                <Input
                  type="number"
                  value={student.exam ?? ""}
                  onChange={(e) =>
                    handleChange(index, "exam", e.target.value)
                  }
                />
              </td>
              <td className="border p-2">
                <Input
                  type="number"
                  value={student.attendance ?? ""}
                  onChange={(e) =>
                    handleChange(index, "attendance", e.target.value)
                  }
                />
              </td>
              <td className="border p-2">{student.total ?? "-"}</td>
              <td className="border p-2">{student.grade ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button className="mt-4" onClick={handleSave}>
        Save Results
      </Button>
    </div>
  );
}
