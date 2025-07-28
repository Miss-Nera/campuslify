"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Announcement = {
  id: number;
  title: string;
  message: string;
  date: string;
  category: string;
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    category: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("announcements");
    if (stored) setAnnouncements(JSON.parse(stored));
  }, []);

  const saveAnnouncements = (updated: Announcement[]) => {
    setAnnouncements(updated);
    localStorage.setItem("announcements", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (!form.title || !form.message || !form.category) {
      toast.error("All fields are required!");
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: form.title,
      message: form.message,
      category: form.category,
      date: new Date().toISOString(),
    };

    const updated = [newAnnouncement, ...announcements];
    saveAnnouncements(updated);

    setForm({ title: "", message: "", category: "" });
    toast.success("Announcement posted successfully!");
  };

  const handleDelete = (id: number) => {
    const updated = announcements.filter((a) => a.id !== id);
    saveAnnouncements(updated);
    toast.success("Announcement deleted.");
  };

  return (
    <main className="max-w-5xl mx-auto p-6 mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        📢 Manage Announcements
      </h1>

      {/* Form */}
      <Card className="p-4 shadow-md">
        <h2 className="font-semibold text-lg mb-3">Post a New Announcement</h2>
        <div className="space-y-3">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <Input
            placeholder="Category (e.g., Urgent, Event, Health)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Button className="w-full" onClick={handleAdd}>
            Post Announcement
          </Button>
        </div>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No announcements have been posted yet.
          </p>
        ) : (
          announcements.map((ann) => (
            <Card
              key={ann.id}
              className="shadow-sm hover:shadow-md transition relative"
            >
              <CardHeader className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{ann.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(ann.date).toDateString()}
                  </p>
                </div>
                <Badge variant="outline">{ann.category}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {ann.message}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-3"
                  onClick={() => handleDelete(ann.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
