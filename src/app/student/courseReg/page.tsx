"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { StudentProfile } from "@/types";

type Course = {
  id: string;
  code: string;
  title: string;
  creditUnit: number;
};

const COURSES_KEY = "studentCourses"; // all students' registrations stored here

export default function CourseRegistrationPage() {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dummy courses (replace with admin input later)
    const dummyCourses: Course[] = [
      { id: "1", code: "CSC101", title: "Introduction to Computing", creditUnit: 3 },
      { id: "2", code: "MTH102", title: "Calculus II", creditUnit: 4 },
      { id: "3", code: "GST103", title: "Use of English", creditUnit: 2 },
      { id: "4", code: "PHY104", title: "General Physics", creditUnit: 3 },
    ];
    setAvailableCourses(dummyCourses);

    // load student profile
    const profile: StudentProfile | null = JSON.parse(
      localStorage.getItem("studentProfile") || "null"
    );
    setStudentProfile(profile);

    // load this student's saved courses
    if (profile) {
      const allRegs = JSON.parse(localStorage.getItem(COURSES_KEY) || "{}");
      const studentReg = allRegs[profile.matricNumber] || [];
      setSelectedCourses(studentReg);
    }
  }, []);

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const totalUnits = selectedCourses.reduce((sum, courseId) => {
    const course = availableCourses.find((c) => c.id === courseId);
    return sum + (course?.creditUnit || 0);
  }, 0);

  const handleSubmit = () => {
    if (!studentProfile) {
      toast.error("No student profile found.");
      return;
    }

    if (totalUnits > 24) {
      toast.error("You cannot register more than 24 credit units.");
      return;
    }

    // get all registrations
    const allRegs = JSON.parse(localStorage.getItem(COURSES_KEY) || "{}");

    // save this student's registration
    allRegs[studentProfile.matricNumber] = selectedCourses;
    localStorage.setItem(COURSES_KEY, JSON.stringify(allRegs));

    toast.success("Course registration saved successfully!");
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Course Registration Form</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #4f46e5; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f3f4f6; }
                .student-info { margin-bottom: 20px; }
                .student-info p { margin: 4px 0; }
                .signatures { margin-top: 40px; display: flex; justify-content: space-between; }
                .signature-box { text-align: center; width: 45%; }
                .signature-line { border-top: 1px solid black; margin-top: 50px; padding-top: 5px; }
              </style>
            </head>
            <body>
              ${printContents}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const registeredCourses = availableCourses.filter((course) =>
    selectedCourses.includes(course.id)
  );

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10 space-y-8">
      {/* Registration Form */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold text-indigo-600">
          Course Registration
        </CardHeader>
        <CardContent className="space-y-4">
          {availableCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div>
                <p className="font-medium text-indigo-700">
                  {course.code} — {course.title}
                </p>
                <p className="text-sm text-gray-600">
                  Credit Unit: {course.creditUnit}
                </p>
              </div>
              <Checkbox
                checked={selectedCourses.includes(course.id)}
                onCheckedChange={() => toggleCourse(course.id)}
              />
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <p className="font-semibold text-indigo-700">
              Total Credit Units: {totalUnits}
            </p>
            <Button onClick={handleSubmit}>Save Registration</Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview of Registered Courses */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold text-indigo-600">
          Registered Courses Preview
        </CardHeader>
        <CardContent>
          <div ref={printRef}>
            {studentProfile && (
              <div className="student-info">
                <h1>Course Registration Form</h1>
                <p><strong>Name:</strong> {studentProfile.fullName}</p>
                <p><strong>Matric Number:</strong> {studentProfile.matricNumber}</p>
                <p><strong>Department:</strong> {studentProfile.department}</p>
                <p><strong>Level:</strong> {studentProfile.level}</p>
              </div>
            )}
            {registeredCourses.length > 0 ? (
              <>
                <table className="w-full border-collapse border">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Course Code</th>
                      <th className="border px-4 py-2">Course Title</th>
                      <th className="border px-4 py-2">Credit Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredCourses.map((course) => (
                      <tr key={course.id}>
                        <td className="border px-4 py-2">{course.code}</td>
                        <td className="border px-4 py-2">{course.title}</td>
                        <td className="border px-4 py-2">{course.creditUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Separator className="my-3" />
                <p className="font-semibold text-indigo-700">
                  Total Units: {totalUnits}
                </p>

                {/* Signature Section */}
                <div className="signatures">
                  <div className="signature-box">
                    <div className="signature-line">Student’s Signature</div>
                  </div>
                  <div className="signature-box">
                    <div className="signature-line">HOD’s Signature</div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No courses registered yet.</p>
            )}
          </div>
          {registeredCourses.length > 0 && (
            <Button onClick={handlePrint} className="mt-4 w-full">
              Print Course Form
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
