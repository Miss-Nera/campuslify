"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Student = {
  id: string;
  matric: string;
  name: string;
  ca: number;
  exam: number;
  total: number;
  grade: string;
};

type Course = {
  id: string;
  code: string;
  title: string;
  students: Student[];
};

const RESULTS_KEY = "lecturerResults";

export default function LecturerResultsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  useEffect(() => {
    // Load courses + results from localStorage
    const stored = localStorage.getItem(RESULTS_KEY);
    if (stored) {
      setCourses(JSON.parse(stored));
    } else {
      // Dummy seed data
      const dummy: Course[] = [
        {
          id: "1",
          code: "CSC101",
          title: "Introduction to Computer Science",
          students: [
            { id: "s1", matric: "CSC/001", name: "Alice Johnson", ca: 0, exam: 0, total: 0, grade: "" },
            { id: "s2", matric: "CSC/002", name: "Bob Smith", ca: 0, exam: 0, total: 0, grade: "" },
          ],
        },
        {
          id: "2",
          code: "MTH101",
          title: "Calculus I",
          students: [
            { id: "s3", matric: "MTH/005", name: "Jane Doe", ca: 0, exam: 0, total: 0, grade: "" },
          ],
        },
      ];
      setCourses(dummy);
      localStorage.setItem(RESULTS_KEY, JSON.stringify(dummy));
    }
  }, []);

  const updateScore = (courseId: string, studentId: string, field: "ca" | "exam", value: number) => {
    setCourses((prev) => {
      const updated = prev.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          students: course.students.map((s) => {
            if (s.id !== studentId) return s;

            const newStudent = {
              ...s,
              [field]: value,
            };

            // auto calculate
            const total = newStudent.ca + newStudent.exam;
            let grade = "";
            if (total >= 70) grade = "A";
            else if (total >= 60) grade = "B";
            else if (total >= 50) grade = "C";
            else if (total >= 45) grade = "D";
            else if (total >= 40) grade = "E";
            else grade = "F";

            return { ...newStudent, total, grade };
          }),
        };
      });

      localStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Select Course</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(v) => setSelectedCourseId(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCourse && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {selectedCourse.code} - {selectedCourse.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Matric No</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-center">CA (30)</th>
                    <th className="p-2 text-center">Exam (70)</th>
                    <th className="p-2 text-center">Total</th>
                    <th className="p-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCourse.students.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="p-2">{s.matric}</td>
                      <td className="p-2">{s.name}</td>
                      <td className="p-2 text-center">
                        <Input
                          type="number"
                          value={s.ca}
                          onChange={(e) => updateScore(selectedCourse.id, s.id, "ca", Number(e.target.value))}
                          className="w-20 text-center"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Input
                          type="number"
                          value={s.exam}
                          onChange={(e) => updateScore(selectedCourse.id, s.id, "exam", Number(e.target.value))}
                          className="w-20 text-center"
                        />
                      </td>
                      <td className="p-2 text-center font-semibold">{s.total}</td>
                      <td className="p-2 text-center">{s.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => toast.success("Results saved successfully!")}
                className="rounded-lg"
              >
                Save Results
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
