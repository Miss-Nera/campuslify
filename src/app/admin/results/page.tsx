"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

type ResultEntry = {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseTitle: string;
  grade: string;
  level: string;
};

export default function AdminResultsPage() {
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ResultEntry>({
    id: "",
    studentId: "",
    studentName: "",
    courseCode: "",
    courseTitle: "",
    grade: "",
    level: "",
  });

  const grades = ["A", "B", "C", "D", "E", "F"];
  const levels = ["100", "200", "300", "400"];

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("studentResults");
    if (stored) setResults(JSON.parse(stored));
  }, []);

  // Save to localStorage
  const saveResults = (data: ResultEntry[]) => {
    setResults(data);
    localStorage.setItem("studentResults", JSON.stringify(data));
  };

  const handleChange = (field: keyof ResultEntry, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.studentId || !formData.studentName || !formData.courseCode || !formData.courseTitle || !formData.grade || !formData.level) {
      toast.error("Please fill all fields.");
      return;
    }

    if (editingId) {
      // Update existing record
      const updated = results.map((res) =>
        res.id === editingId ? { ...formData, id: editingId } : res
      );
      saveResults(updated);
      setEditingId(null);
      toast.success("Result updated successfully!");
    } else {
      // Add new record
      const newEntry: ResultEntry = { ...formData, id: crypto.randomUUID() };
      const updated = [...results, newEntry];
      saveResults(updated);
      toast.success("Result added successfully!");
    }

    // Reset form
    setFormData({
      id: "",
      studentId: "",
      studentName: "",
      courseCode: "",
      courseTitle: "",
      grade: "",
      level: "",
    });
  };

  const handleEdit = (entry: ResultEntry) => {
    setFormData(entry);
    setEditingId(entry.id);
  };

  const handleDelete = (id: string) => {
    const updated = results.filter((res) => res.id !== id);
    saveResults(updated);
    toast.success("Result deleted successfully!");
  };

  return (
    <main className="max-w-5xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600">📊 Admin — Manage Results</h1>

      {/* Add/Edit Form */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold text-indigo-600">
          {editingId ? "Edit Result" : "Add New Result"}
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Student ID"
            value={formData.studentId}
            onChange={(e) => handleChange("studentId", e.target.value)}
          />
          <Input
            placeholder="Student Name"
            value={formData.studentName}
            onChange={(e) => handleChange("studentName", e.target.value)}
          />
          <Input
            placeholder="Course Code (e.g. CSC101)"
            value={formData.courseCode}
            onChange={(e) => handleChange("courseCode", e.target.value)}
          />
          <Input
            placeholder="Course Title"
            value={formData.courseTitle}
            onChange={(e) => handleChange("courseTitle", e.target.value)}
          />
          <Select value={formData.grade} onValueChange={(val) => handleChange("grade", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formData.level} onValueChange={(val) => handleChange("level", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((lvl) => (
                <SelectItem key={lvl} value={lvl}>{lvl} Level</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-full md:col-span-2" onClick={handleSubmit}>
            {editingId ? "Update Result" : "Add Result"}
          </Button>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold text-indigo-600">
          All Results
        </CardHeader>
        <CardContent>
          {results.length > 0 ? (
            results.map((res) => (
              <div
                key={res.id}
                className="flex justify-between items-center border-b py-2 last:border-b-0"
              >
                <div>
                  <p className="font-semibold">
                    {res.studentName} ({res.studentId}) — {res.courseCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    {res.courseTitle} | Grade: {res.grade} | Level: {res.level}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(res)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(res.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No results recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
