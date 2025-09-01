"use client";

import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search,Plus, SlidersHorizontal, ArrowUpDown, UserPlus, Trash } from "lucide-react";
import { StudentProfile } from "@/types";

// ---------------- Types ----------------
export type Gender = "male" | "female";
export type Student = { id: string; name: string; gender: Gender};
export type Room = {
  id: string;
  name: string; // e.g., SR 1
  capacity: number;
  price: number; // price per bed/room (adjust as needed)
  gender: Gender; // typically inherits hostel gender
  occupants: Student[];
};
export type RoomType = { name: string; count: number; capacity: number; price: number };
export type Hostel = { id: string; name: string; gender: Gender; roomTypes: RoomType[]; rooms: Room[] };

// ---------------- Constants ----------------
const HOSTELS_KEY = "hostelsData";

// ---------------- Small UI Helpers ----------------
const GenderBadge: React.FC<{ gender: Gender }> = ({ gender }) => (
  <Badge
    variant="secondary"
    className={
      gender === "male"
        ? "bg-blue-100 text-blue-700 border border-blue-200"
        : gender === "female"
        ? "bg-pink-100 text-pink-700 border border-pink-200"
        : "bg-green-100 text-green-700 border border-green-200"
    }
  >
    {gender}
  </Badge>
);

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

// ---------------- Main Component ----------------
export default function AdminAccommodationDashboard() {
  // Data
  const [hostels, setHostels] = useState<Hostel[]>([]);

  // UI State
  // const [sidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | Gender>("all");
  const [sortOption, setSortOption] = useState<"studentsDesc" | "studentsAsc" | "occupancyDesc" | "occupancyAsc">(
    "studentsDesc"
  );

  // Modals
  const [showHostelModal, setShowHostelModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);
  const [formHostelName, setFormHostelName] = useState("");
  const [formHostelGender, setFormHostelGender] = useState<Gender>("male");

  const [showRoomTypeModal, setShowRoomTypeModal] = useState(false);
  const [roomHostel, setRoomHostel] = useState<Hostel | null>(null);
  const [roomTypeName, setRoomTypeName] = useState("");
  const [roomTypeCount, setRoomTypeCount] = useState(1);
  const [roomTypeCapacity, setRoomTypeCapacity] = useState(1);
  const [roomTypePrice, setRoomTypePrice] = useState(0);

  const [roomsModalHostel, setRoomsModalHostel] = useState<Hostel | null>(null);
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all");
  const [roomAvailabilityFilter, setRoomAvailabilityFilter] = useState<"all" | "available" | "full">("all");

  // Load / Save
  useEffect(() => {
    const data = localStorage.getItem(HOSTELS_KEY);
    if (data) {
      try {
        const parsed: Hostel[] = JSON.parse(data);
        // normalize to avoid undefined arrays
        const normalized = parsed.map(h => ({
          ...h,
          roomTypes: Array.isArray(h.roomTypes) ? h.roomTypes : [],
          rooms: Array.isArray(h.rooms) ? h.rooms : [],
        }));
        setHostels(normalized);
      } catch {
        setHostels([]);
      }
    }
  }, []);

  const persist = (updated: Hostel[]) => {
    setHostels(updated);
    localStorage.setItem(HOSTELS_KEY, JSON.stringify(updated));
  };
  // Delete hostel
  const deleteHostel = (id: string) => {
    const updated = hostels.filter(h => h.id !== id);
    persist(updated);
    toast.success("Hostel deleted");
  };

  // Delete room
  const deleteRoom = (hostelId: string, roomId: string) => {
    const updated = hostels.map(h =>
      h.id === hostelId ? { ...h, rooms: h.rooms.filter(r => r.id !== roomId) } : h
    );
    persist(updated);
    toast.success("Room deleted");
  };


  // Derived stats
  const stats = useMemo(() => {
    const totalRooms = hostels.reduce((s, h) => s + (h.rooms?.length || 0), 0);
    const totalStudents = hostels.reduce((s, h) => s + h.rooms.reduce((ss, r) => ss + r.occupants.length, 0), 0);
    const totalCapacity = hostels.reduce((s, h) => s + h.rooms.reduce((ss, r) => ss + r.capacity, 0), 0);
    const occupancy = totalCapacity ? Math.round((totalStudents / totalCapacity) * 100) : 0;
    return { totalHostels: hostels.length, totalRooms, totalStudents, occupancy };
  }, [hostels]);

  // Filtered & Sorted Hostels
  const filtered = useMemo(() => {
    const list = hostels
      .filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(h => (genderFilter === "all" ? true : h.gender === genderFilter));

    const score = (h: Hostel) => {
      const st = h.rooms.reduce((s, r) => s + r.occupants.length, 0);
      const cap = h.rooms.reduce((s, r) => s + r.capacity, 0);
      const occ = cap ? st / cap : 0;
      return { st, occ };
    };

    return [...list].sort((a, b) => {
      const A = score(a);
      const B = score(b);
      switch (sortOption) {
        case "studentsAsc":
          return A.st - B.st;
        case "studentsDesc":
          return B.st - A.st;
        case "occupancyAsc":
          return A.occ - B.occ;
        case "occupancyDesc":
          return B.occ - A.occ;
        default:
          return 0;
      }
    });
  }, [hostels, searchTerm, genderFilter, sortOption]);

  // Actions: Hostels
  const openEditHostel = (h: Hostel) => {
    setEditingHostel(h);
    setFormHostelName(h.name);
    setFormHostelGender(h.gender);
    setShowHostelModal(true);
  };
  const openCreateHostel = () => {
  setEditingHostel(null);
  setFormHostelName("");
  setFormHostelGender("male");
  setShowHostelModal(true);
};

  const saveHostel = () => {
    if (!formHostelName.trim()) return toast.error("Hostel name is required");

    if (editingHostel) {
      const updated = hostels.map(h =>
        h.id === editingHostel.id ? { ...h, name: formHostelName.trim(), gender: formHostelGender } : h
      );
      persist(updated);
      toast.success("Hostel updated");
    } else {
      const newHostel: Hostel = {
        id: uuidv4(),
        name: formHostelName.trim(),
        gender: formHostelGender,
        roomTypes: [],
        rooms: [],
      };
      persist([...hostels, newHostel]);
      toast.success("Hostel created");
    }
        setShowHostelModal(false);
  };

  // Actions: Room Types / Rooms
  const openAddRoomType = (h: Hostel) => {
    setRoomHostel(h);
    setRoomTypeName("");
    setRoomTypeCount(1);
    setRoomTypeCapacity(1);
    setRoomTypePrice(0);
    setShowRoomTypeModal(true);
  };

  const saveRoomType = () => {
    if (!roomHostel) return;
    if (!roomTypeName.trim() || roomTypeCount < 1 || roomTypeCapacity < 1 || roomTypePrice < 0) {
      return toast.error("Please provide valid room type details");
    }

    const newRooms: Room[] = Array.from({ length: roomTypeCount }, (_, i) => ({
      id: uuidv4(),
      name: `${roomTypeName.trim()} ${i + 1}`,
      capacity: roomTypeCapacity,
      price: roomTypePrice,
      gender: roomHostel.gender,
      occupants: [],
    }));

    const updated = hostels.map(h =>
      h.id === roomHostel.id
        ? {
            ...h,
            roomTypes: [...(h.roomTypes || []), { name: roomTypeName.trim(), count: roomTypeCount, capacity: roomTypeCapacity, price: roomTypePrice }],
            rooms: [...(h.rooms || []), ...newRooms],
          }
        : h
    );

    persist(updated);
    setShowRoomTypeModal(false);
    toast.success(`${roomTypeCount} ${roomTypeName} room(s) created`);
  };

  // Assign student (first-come, first-served)
  const assignStudent = (hostelId: string, roomId: string) => {
    const studentName = prompt("Enter student name");
    const studentGenderInput = prompt("Enter student gender (male/female)");
    const studentGender = (studentGenderInput || "").toLowerCase() as Student["gender"];
    if (!studentName || (studentGender !== "male" && studentGender !== "female")) return;

    const updated = hostels.map(h => {
      if (h.id !== hostelId) return h;
      const rooms = h.rooms.map(r => {
        if (r.id !== roomId) return r;
        if (r.occupants.length >= r.capacity) {
          toast.error("Room is full. Choose another.");
          return r;
        }
        return { ...r, occupants: [...r.occupants, { id: uuidv4(), name: studentName.trim(), gender: studentGender }] };
      });
      return { ...h, rooms };
    });

    persist(updated);
    toast.success(`${studentName} assigned`);
  };

  // Rooms Modal helpers
  const openRoomsModal = (h: Hostel) => {
    setRoomsModalHostel(h);
    setRoomTypeFilter("all");
    setRoomAvailabilityFilter("all");
  };

  const roomsForModal = useMemo(() => {
    if (!roomsModalHostel) return [] as Room[];
    return roomsModalHostel.rooms
      .filter(r => (roomTypeFilter === "all" ? true : r.name.startsWith(roomTypeFilter)))
      .filter(r =>
        roomAvailabilityFilter === "all"
          ? true
          : roomAvailabilityFilter === "available"
          ? r.occupants.length < r.capacity
          : r.occupants.length >= r.capacity
      );
  }, [roomsModalHostel, roomTypeFilter, roomAvailabilityFilter]);

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    
      {/* Main */}
      <main className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Accommodation Dashboard</h1>
            <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200">Admin</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search hostels..." className="pl-8 w-64"/>
            </div>
            <select
              className="border rounded px-2 py-2 bg-white dark:bg-gray-800"
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value as "all" | Gender)}
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select
              className="border rounded px-2 py-2 bg-white dark:bg-gray-800"
              value={sortOption}
              onChange={e => setSortOption(e.target.value as typeof sortOption)}
            >
              <option value="studentsDesc">Students ↓</option>
              <option value="studentsAsc">Students ↑</option>
              <option value="occupancyDesc">Occupancy ↓</option>
              <option value="occupancyAsc">Occupancy ↑</option>
            </select>
            <Button onClick={openCreateHostel} className="gap-2"><Plus className="w-4 h-4"/> Add Hostel</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total Hostels</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{stats.totalHostels}</CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total Rooms</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{stats.totalRooms}</CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total Students</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{stats.totalStudents}</CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Overall Occupancy</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold">{stats.occupancy}%</div>
                <div className="flex-1"><ProgressBar value={stats.occupancy} /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-6" />

        {/* Hostel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(h => {
            const students = h.rooms.reduce((s, r) => s + r.occupants.length, 0);
            const capacity = h.rooms.reduce((s, r) => s + r.capacity, 0);
            const occ = capacity ? Math.round((students / capacity) * 100) : 0;

            return (
              <motion.div key={h.id} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{h.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <GenderBadge gender={h.gender} />
                        <span>{h.rooms.length} rooms</span>
                        <span>•</span>
                        <span>{students} students</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditHostel(h)}>Edit</Button>
                      <Button variant="secondary" size="sm" onClick={() => openAddRoomType(h)} className="gap-1"><Plus className="w-4 h-4"/> Room Type</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ProgressBar value={occ} />
                    <div className="text-sm text-gray-500">{occ}% occupancy</div>
                    <div className="flex gap-2">
                      <Button variant="default" className="gap-2" onClick={() => openRoomsModal(h)}>
                        <SlidersHorizontal className="w-4 h-4" /> View Rooms
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={() => openAddRoomType(h)}>
                        <Plus className="w-4 h-4" /> Add Rooms
                      </Button>
                    </div>
                    <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => deleteHostel(h.id)}>
                      <Trash className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Create / Edit Hostel */}
      <Dialog open={showHostelModal} onOpenChange={setShowHostelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHostel ? "Edit Hostel" : "Create Hostel"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 mt-2">
            <Input placeholder="Hostel Name" value={formHostelName} onChange={e => setFormHostelName(e.target.value)} />
            <select
              className="border rounded px-2 py-2 bg-white dark:bg-gray-800"
              value={formHostelGender}
              onChange={e => setFormHostelGender(e.target.value as Gender)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setShowHostelModal(false)}>Cancel</Button>
            <Button onClick={saveHostel}>{editingHostel ? "Save Changes" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Room Type */}
      <Dialog open={showRoomTypeModal} onOpenChange={setShowRoomTypeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Room Type</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 mt-2">
            <Input placeholder="Type (e.g., SR, ER, Deluxe)" value={roomTypeName} onChange={e => setRoomTypeName(e.target.value)} />
            <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Number of Rooms</label>
              <Input
                type="number"
                min={1}
                value={roomTypeCount}
                onChange={(e) => setRoomTypeCount(Number(e.target.value))}
                placeholder="e.g. 5"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Capacity</label>
              <Input
                type="number"
                min={1}
                value={roomTypeCapacity}
                onChange={(e) => setRoomTypeCapacity(Number(e.target.value))}
                placeholder="e.g. 2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Price</label>
              <Input
                type="number"
                min={0}
                value={roomTypePrice}
                onChange={(e) => setRoomTypePrice(Number(e.target.value))}
                placeholder="e.g. 50000"
              />
            </div>
          </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setShowRoomTypeModal(false)}>Cancel</Button>
            <Button onClick={saveRoomType}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rooms Modal */}
      <Dialog open={!!roomsModalHostel} onOpenChange={() => setRoomsModalHostel(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Rooms — {roomsModalHostel?.name}</DialogTitle>
          </DialogHeader>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              className="border rounded px-2 py-2 bg-white dark:bg-gray-800"
              value={roomTypeFilter}
              onChange={e => setRoomTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {Array.from(new Set((roomsModalHostel?.rooms || []).map(r => r.name.split(" ")[0]))).map(rt => (
                <option key={rt} value={rt}>{rt}</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-2 bg-white dark:bg-gray-800"
              value={roomAvailabilityFilter}
              onChange={e => setRoomAvailabilityFilter(e.target.value as "all" | "available" | "full")}
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="full">Full</option>
            </select>
            <Badge variant="secondary" className="ml-auto gap-1">
              <ArrowUpDown className="w-3 h-3"/> Sorted by {sortOption.includes("students") ? "students" : "occupancy"}
            </Badge>
          </div>

          <ScrollArea className="h-[480px] mt-4 pr-2">
            {roomsForModal.length === 0 ? (
              <div className="text-sm text-gray-500">No rooms match the selected filters.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomsForModal.map(room => {
                  const occ = Math.round((room.occupants.length / room.capacity) * 100);
                  const isFull = room.occupants.length >= room.capacity;
                  return (
                    <Card key={room.id} className={"relative overflow-hidden " + (isFull ? "border-red-300" : "") }>
                      {isFull && (
                        <div className="absolute inset-0 bg-red-50/60 dark:bg-red-900/20 pointer-events-none" />
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-base font-semibold">{room.name}</CardTitle>
                          <GenderBadge gender={room.gender} />
                        </div>
                        <div className="text-xs text-gray-500">₦{room.price.toLocaleString()}</div>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => roomsModalHostel && deleteRoom(roomsModalHostel.id, room.id)}
                        >
                          <Trash className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {room.occupants.length}/{room.capacity} occupied
                        </div>
                        <ProgressBar value={occ} />
                        <div className="flex gap-2">
                          <Button size="sm" className="gap-2" onClick={() => assignStudent(roomsModalHostel!.id, room.id)}>
                            <UserPlus className="w-4 h-4"/> Assign
                          </Button>
                          <OccupantsButton occupants={room.occupants} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------- Subcomponent: Occupants Button & Modal ----------------
const OccupantsButton: React.FC<{ occupants: Student[] }> = ({ occupants }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<StudentProfile | null>(null);

  // Load student profiles from localStorage
  const [students, setStudents] = useState<StudentProfile[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem("students");
    if (raw) {
      try {
        setStudents(JSON.parse(raw));
      } catch {
        setStudents([]);
      }
    }
  }, []);

  const getFullProfile = (id: string) => {
    return students.find(s => s.id === id) || null;
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        View Occupants ({occupants.length})
      </Button>

      {/* Occupants list modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Occupants</DialogTitle>
          </DialogHeader>
          {occupants.length === 0 ? (
            <div className="text-sm text-gray-500">No students assigned.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Emergency contact</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {occupants.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell className="capitalize">{s.gender}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelected(getFullProfile(s.id))}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Profile modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.fullName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p><strong>Matric:</strong> {selected.matricNumber}</p>
                <p><strong>Email:</strong> {selected.email}</p>
                <p><strong>Phone:</strong> {selected.phone}</p>
                <p><strong>DOB:</strong> {selected.dob}</p>
                <p><strong>Gender:</strong> {selected.gender}</p>

                <h3 className="font-semibold mt-3">Accommodation</h3>
                <p>
                  {selected.accommodation?.hostelName} — {selected.accommodation?.roomName}
                </p>

                <h3 className="font-semibold mt-3">Payments</h3>
                {selected.payments?.length ? (
                  <ul className="list-disc list-inside">
                    {selected.payments.map(p => (
                      <li key={p.id}>
                        {p.type} — ₦{p.amount} ({p.status}) on {p.date}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No payments recorded</p>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setSelected(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
