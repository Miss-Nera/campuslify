"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

type TimetableSlot = {
  id: string;
  day: string;
  time: string;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  venue: string;
};

export default function AdminTimetablePage() {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [formData, setFormData] = useState<TimetableSlot>({
    id: "",
    courseCode: "",
    courseTitle: "",
    lecturer: "",
    day: "",
    time: "",
    venue: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    const stored = localStorage.getItem("studentTimetable");
    if (stored) setTimetable(JSON.parse(stored));
  }, []);

  const handleChange = (field: keyof TimetableSlot, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (
      !formData.courseCode ||
      !formData.courseTitle ||
      !formData.day ||
      !formData.time ||
      !formData.venue ||
      !formData.lecturer
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    let updated: TimetableSlot[];
    if (editingId) {
      // Update existing class
      updated = timetable.map((entry) =>
        entry.id === editingId ? { ...formData, id: editingId } : entry
      );
      toast.success("Class updated successfully!");
    } else {
      // Add new class
      const newEntry: TimetableSlot = {
        ...formData,
        id: crypto.randomUUID(),
      };
      updated = [...timetable, newEntry];
      toast.success("Class added successfully!");
    }

    setTimetable(updated);
    localStorage.setItem("studentTimetable", JSON.stringify(updated));

    // Reset form
    setFormData({
      id: "",
      courseCode: "",
      courseTitle: "",
      lecturer: "",
      day: "",
      time: "",
      venue: "",
    });
    setEditingId(null);
  };

  const handleEdit = (entry: TimetableSlot) => {
    setFormData(entry);
    setEditingId(entry.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      id: "",
      courseCode: "",
      courseTitle: "",
      lecturer: "",
      day: "",
      time: "",
      venue: "",
    });
  };

  const handleDelete = (id: string) => {
    const updated = timetable.filter((entry) => entry.id !== id);
    setTimetable(updated);
    localStorage.setItem("studentTimetable", JSON.stringify(updated));
    toast.success("Class deleted successfully!");
  };

  return (
    <main className="max-w-5xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600">
        🗂️ Admin — Manage Timetable
      </h1>

      {/* Add/Edit Class Form */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold text-indigo-600">
          {editingId ? "Edit Class" : "Add New Class"}
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
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
          <Input
            placeholder="Lecturer"
            value={formData.lecturer}
            onChange={(e) => handleChange("lecturer", e.target.value)}
          />
          <Select
            value={formData.day}
            onValueChange={(val) => handleChange("day", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Time (e.g. 8:00 - 10:00 AM)"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
          />
          <Input
            placeholder="Venue (e.g. Room 204)"
            value={formData.venue}
            onChange={(e) => handleChange("venue", e.target.value)}
          />
          <div className="flex gap-3 md:col-span-2">
            <Button className="flex-1" onClick={handleSave}>
              {editingId ? "Update Class" : "Add Class"}
            </Button>
            {editingId && (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timetable Display */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold text-indigo-600">
          Current Timetable
        </CardHeader>
        <CardContent>
          {timetable.length > 0 ? (
            timetable.map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center border-b py-2 last:border-b-0"
              >
                <div>
                  <p className="font-semibold">
                    {entry.courseCode} — {entry.courseTitle}
                  </p>
                  <p className="text-sm text-gray-600">
                    {entry.day}, {entry.time} | {entry.venue} <br />
                    Lecturer: {entry.lecturer}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No classes added yet.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
