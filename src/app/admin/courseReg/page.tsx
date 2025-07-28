"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type Course = {
  code: string;
  title: string;
  unit: number;
};

type StudentProfile = {
  id: string;
  fullName: string;
  matricNumber: string;
  level: string;
  department: string;
  registeredCourses?: Course[];
};

export default function AdminCourseRegistrationPage() {
  const [coursesSummary, setCoursesSummary] = useState<
    { course: Course; students: StudentProfile[] }[]
  >([]);

  useEffect(() => {
    const allProfiles: StudentProfile[] = JSON.parse(
      localStorage.getItem("studentProfiles") || "[]"
    );

    // collect all courses with registered students
    const courseMap: Record<string, { course: Course; students: StudentProfile[] }> = {};

    allProfiles.forEach((student) => {
      student.registeredCourses?.forEach((course) => {
        if (!courseMap[course.code]) {
          courseMap[course.code] = { course, students: [] };
        }
        courseMap[course.code].students.push(student);
      });
    });

    setCoursesSummary(Object.values(courseMap));
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6 mt-10 space-y-8">
      {/* Header */}
      <Card className="shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold">📘 Course Registration Overview</h1>
          <p className="text-sm mt-2">
            View how many students registered for each course and their levels.
          </p>
        </CardContent>
      </Card>

      {/* Course Summary */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">
          Registered Courses Summary
        </h2>
        <Separator className="mb-4" />

        {coursesSummary.length > 0 ? (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {coursesSummary.map(({ course, students }) => (
                <Card key={course.code} className="shadow-sm">
                  <CardHeader className="font-semibold text-indigo-700">
                    {course.code} — {course.title} ({course.unit} Units)
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium mb-2">
                      Total Students:{" "}
                      <span className="text-indigo-600 font-bold">
                        {students.length}
                      </span>
                    </p>
                    <ul className="text-sm space-y-1">
                      {students.map((student) => (
                        <li
                          key={student.id}
                          className="flex justify-between border-b pb-1"
                        >
                          <span>{student.fullName}</span>
                          <span className="text-gray-500 text-xs">
                            Level: {student.level}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-gray-500 text-sm">
            No courses have been registered yet.
          </p>
        )}
      </section>
    </main>
  );
}
