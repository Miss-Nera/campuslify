"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Types
type Course = {
  id: string;
  code: string;
  title: string;
  level: string;
  semester: string;
};

const COURSES_KEY = "courses";

export default function AdminCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Omit<Course, "id">>({
    code: "",
    title: "",
    level: "",
    semester: "",
  });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(COURSES_KEY);
    if (stored) {
      setCourses(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  }, [courses]);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  // Add or update course
  const handleSubmit = () => {
    if (!newCourse.code || !newCourse.title || !newCourse.level || !newCourse.semester) {
      toast.error("All fields are required");
      return;
    }

    if (editingCourseId) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourseId ? { ...c, ...newCourse } : c
        )
      );
      toast.success("Course updated");
      setEditingCourseId(null);
    } else {
      const id = crypto.randomUUID();
      setCourses([...courses, { id, ...newCourse }]);
      toast.success("Course added");
    }

    setNewCourse({ code: "", title: "", level: "", semester: "" });
  };

  // Edit course
  const handleEdit = (course: Course) => {
    setNewCourse({
      code: course.code,
      title: course.title,
      level: course.level,
      semester: course.semester,
    });
    setEditingCourseId(course.id);
  };

  // Delete course
  const handleDelete = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    toast.success("Course deleted");
  };

  // Handle bulk CSV upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

    const newCourses: Course[] = lines.map((line) => {
      const [code, title, level, semester] = line.split(",");
      return {
        id: crypto.randomUUID(),
        code: code?.trim() || "",
        title: title?.trim() || "",
        level: level?.trim() || "",
        semester: semester?.trim() || "",
      };
    });

    setCourses((prev) => [...prev, ...newCourses]);
    toast.success("Courses uploaded");
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingCourseId ? "Edit Course" : "Add Course"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label>Course Code</Label>
            <Input name="code" value={newCourse.code} onChange={handleChange} />
          </div>
          <div>
            <Label>Course Title</Label>
            <Input name="title" value={newCourse.title} onChange={handleChange} />
          </div>
          <div>
            <Label>Level</Label>
            <Input name="level" value={newCourse.level} onChange={handleChange} />
          </div>
          <div>
            <Label>Semester</Label>
            <Input name="semester" value={newCourse.semester} onChange={handleChange} />
          </div>
          <Button onClick={handleSubmit}>
            {editingCourseId ? "Update Course" : "Add Course"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
          />
          <p className="text-sm text-gray-500 mt-2">
            Format: <code>CODE, TITLE, LEVEL, SEMESTER</code>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses yet</p>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Level</th>
                  <th className="p-2">Semester</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-t">
                    <td className="p-2">{course.code}</td>
                    <td className="p-2">{course.title}</td>
                    <td className="p-2">{course.level}</td>
                    <td className="p-2">{course.semester}</td>
                    <td className="p-2 space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(course)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
