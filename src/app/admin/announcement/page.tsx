"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type Announcement = {
  id: string;
  title: string;
  message: string;
  category: string;
  audience: string;
  image?: string;
  createdAt: string;
};

const STORAGE_KEY = "announcements";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("General");
  const [audience, setAudience] = useState("All");
  const [image, setImage] = useState<string | null>(null);

  // Load announcements from localStorage when page loads
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAnnouncements(JSON.parse(stored));
    }
  }, []);

  // Save announcements to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
  }, [announcements]);

  const handleAddAnnouncement = () => {
    if (!title || !message) return;

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title,
      message,
      category,
      audience,
      image: image || undefined,
      createdAt: new Date().toISOString(),
    };

    setAnnouncements([newAnnouncement, ...announcements]);

    // Reset form
    setTitle("");
    setMessage("");
    setCategory("General");
    setAudience("All");
    setImage(null);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Post New Announcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Write your announcement..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded p-2"
            >
              <option>General</option>
              <option>Exams</option>
              <option>Health</option>
              <option>Food</option>
              <option>Events</option>
            </select>

            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="border rounded p-2"
            >
              <option>All</option>
              <option>100 Level</option>
              <option>200 Level</option>
              <option>300 Level</option>
              <option>400 Level</option>
            </select>
          </div>

          <Input type="file" accept="image/*" onChange={handleImageUpload} />

          <Button onClick={handleAddAnnouncement}>Post</Button>
        </CardContent>
      </Card>

      {/* Announcements list */}
      <div className="grid gap-4 md:grid-cols-2">
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <Card key={a.id} className="relative">
              <CardHeader>
                <CardTitle>{a.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge>{a.category}</Badge>
                  <Badge variant="outline">{a.audience}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{a.message}</p>
                {a.image && (
                  <Image
                    src={a.image}
                    alt="Announcement image"
                    width={400}
                    height={250}
                    className="rounded-lg"
                  />
                )}
                <div className="text-sm text-gray-500 mt-2">
                  {new Date(a.createdAt).toLocaleString()}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleDelete(a.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
