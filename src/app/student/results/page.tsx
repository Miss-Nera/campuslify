"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CourseResult = {
  id: string;
  courseCode: string;
  courseTitle: string;
  creditUnit: number;
  grade: string; // A-F
  semester: string; // "First Semester", "Second Semester"
};

export default function ResultsPage() {
  const [results, setResults] = useState<CourseResult[]>([]);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [semesterGpa, setSemesterGpa] = useState<Record<string, number>>({});
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  useEffect(() => {
    const storedResults: CourseResult[] = JSON.parse(
      localStorage.getItem("studentResults") || "[]"
    );
    const sorted = [...storedResults].sort((a, b) =>
      a.semester.localeCompare(b.semester)
    );
    setResults(sorted);

    if (sorted.length > 0) {
      calculateGpa(sorted);
      // Default to latest semester
      const latestSemester = sorted[sorted.length - 1].semester;
      setSelectedSemester(latestSemester);
    }
  }, []);

  const gradePoints: Record<string, number> = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
    F: 0,
  };

  const calculateGpa = (data: CourseResult[]) => {
    let totalPoints = 0;
    let totalUnits = 0;
    const semesterTotals: Record<string, { points: number; units: number }> = {};

    data.forEach((course) => {
      const gp = gradePoints[course.grade] * course.creditUnit;
      totalPoints += gp;
      totalUnits += course.creditUnit;

      if (!semesterTotals[course.semester]) {
        semesterTotals[course.semester] = { points: 0, units: 0 };
      }
      semesterTotals[course.semester].points += gp;
      semesterTotals[course.semester].units += course.creditUnit;
    });

    setCgpa(totalUnits > 0 ? totalPoints / totalUnits : null);

    const semesterGpaCalc: Record<string, number> = {};
    for (const sem in semesterTotals) {
      semesterGpaCalc[sem] =
        semesterTotals[sem].units > 0
          ? semesterTotals[sem].points / semesterTotals[sem].units
          : 0;
    }
    setSemesterGpa(semesterGpaCalc);
  };

  // Filtered results based on semester selection
  const filteredResults =
    selectedSemester === "all"
      ? results
      : results.filter((course) => course.semester === selectedSemester);

  const semesters = Array.from(new Set(results.map((r) => r.semester)));

  return (
    <main className="max-w-5xl mx-auto p-6 mt-10 space-y-8">
      {/* Header */}
      <Card className="shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold">📖 Results & CGPA</h1>
          <p className="text-sm mt-2">
            Track your academic performance semester by semester.
          </p>
        </CardContent>
      </Card>

      {/* CGPA Section */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold text-indigo-600">
          Cumulative GPA
        </CardHeader>
        <CardContent>
          {cgpa !== null ? (
            <p
              className={`text-2xl font-bold ${
                cgpa >= 4
                  ? "text-green-600"
                  : cgpa >= 3
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {cgpa.toFixed(2)}
            </p>
          ) : (
            <p className="text-gray-500">No results available yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Per-Semester GPA */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold text-indigo-600">
          Semester GPA Breakdown
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.keys(semesterGpa).length > 0 ? (
            Object.entries(semesterGpa).map(([semester, gpa]) => (
              <div
                key={semester}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium">{semester}</span>
                <span className="font-semibold text-indigo-700">
                  {gpa.toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No semester GPAs calculated yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Results List with Filter */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-indigo-600">
            Course Results
          </h2>
          <Select
            onValueChange={setSelectedSemester}
            value={selectedSemester}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="mb-4" />
        {filteredResults.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredResults.map((course) => (
                <Card key={course.id} className="shadow-sm">
                  <CardHeader className="flex justify-between items-center">
                    <span className="font-semibold text-indigo-700">
                      {course.courseCode} — {course.courseTitle}
                    </span>
                    <Badge
                      variant={
                        course.grade === "A" || course.grade === "B"
                          ? "default"
                          : course.grade === "C"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {course.grade}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600">
                    <p>
                      <strong>Semester:</strong> {course.semester}
                    </p>
                    <p>
                      <strong>Credit Units:</strong> {course.creditUnit}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-gray-500 text-sm">
            No course results for this semester.
          </p>
        )}
      </section>

      {/* Grade Legend */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold text-indigo-600">
          Grading System
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              <strong>A:</strong> Excellent (5.0)
            </li>
            <li>
              <strong>B:</strong> Very Good (4.0)
            </li>
            <li>
              <strong>C:</strong> Good (3.0)
            </li>
            <li>
              <strong>D:</strong> Fair (2.0)
            </li>
            <li>
              <strong>E:</strong> Pass (1.0)
            </li>
            <li>
              <strong>F:</strong> Fail (0.0)
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
