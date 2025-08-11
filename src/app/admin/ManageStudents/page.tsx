"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

type StudentProfile = {
  id: string;
  fullName: string;
  matricNumber: string;
  department: string;
  level: string;
  email: string;
  gender: string;
  hostel?: string;
  dob: string;
  college: string;
};

export default function AdminManageStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [viewMode, setViewMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");

  useEffect(() => {
    const stored = localStorage.getItem("studentProfiles");
    const data: StudentProfile[] = stored ? JSON.parse(stored) : [];
    setStudents(data);
  }, []);

  const saveStudents = (data: StudentProfile[]) => {
    setStudents(data);
    localStorage.setItem("studentProfiles", JSON.stringify(data));
  };

  const handleView = (student: StudentProfile) => {
    setSelectedStudent(student);
    setViewMode(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (student: StudentProfile) => {
    setSelectedStudent(student);
    setViewMode(false);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    saveStudents(updated);
    toast.success("Student deleted successfully!");
  };

  const handleDialogSave = () => {
    if (!selectedStudent) return;

    const updated = students.map((s) =>
      s.id === selectedStudent.id ? selectedStudent : s
    );

    saveStudents(updated);
    toast.success("Student updated successfully!");
    setIsDialogOpen(false);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === "All" || s.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <main className="max-w-7xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600">
        👩‍🎓 Manage Students
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search by name or matric number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />

        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Levels</SelectItem>
            <SelectItem value="100">100 Level</SelectItem>
            <SelectItem value="200">200 Level</SelectItem>
            <SelectItem value="300">300 Level</SelectItem>
            <SelectItem value="400">400 Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredStudents.length > 0 ? (
        <Card className="shadow-md">
          <CardHeader className="font-semibold text-indigo-600">
            Registered Students
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Matric No</th>
                    <th className="p-2 border">Department</th>
                    <th className="p-2 border">Level</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-t">
                      <td className="p-2">{student.fullName}</td>
                      <td className="p-2">{student.matricNumber}</td>
                      <td className="p-2">{student.department}</td>
                      <td className="p-2">{student.level}</td>
                      <td className="p-2">{student.email}</td>
                      <td className="p-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleView(student)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-gray-500">No students found.</p>
      )}

      {/* View/Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {viewMode ? "Student Profile" : "Edit Student"}
            </DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="grid gap-4">
              {viewMode ? (
                <>
                  <p>
                    <strong>Name:</strong> {selectedStudent.fullName}
                  </p>
                  <p>
                    <strong>Matric No:</strong> {selectedStudent.matricNumber}
                  </p>
                  <p>
                    <strong>Department:</strong> {selectedStudent.department}
                  </p>
                  <p>
                    <strong>Level:</strong> {selectedStudent.level}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedStudent.email}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedStudent.gender}
                  </p>
                  <p>
                    <strong>DOB:</strong> {selectedStudent.dob}
                  </p>
                  <p>
                    <strong>College:</strong> {selectedStudent.college}
                  </p>
                  <p>
                    <strong>Hostel:</strong> {selectedStudent.hostel || "—"}
                  </p>
                </>
              ) : (
                <>
                  <Input
                    placeholder="Full Name"
                    value={selectedStudent.fullName}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        fullName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Matric Number"
                    value={selectedStudent.matricNumber}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        matricNumber: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Department"
                    value={selectedStudent.department}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        department: e.target.value,
                      })
                    }
                  />
                  <Select
                    value={selectedStudent.level}
                    onValueChange={(val) =>
                      setSelectedStudent({ ...selectedStudent, level: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 Level</SelectItem>
                      <SelectItem value="200">200 Level</SelectItem>
                      <SelectItem value="300">300 Level</SelectItem>
                      <SelectItem value="400">400 Level</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Hostel"
                    value={selectedStudent.hostel || ""}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        hostel: e.target.value,
                      })
                    }
                  />
                </>
              )}
            </div>
          )}

          <DialogFooter>
            {viewMode ? (
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            ) : (
              <Button onClick={handleDialogSave}>Save Changes</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
