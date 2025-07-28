"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
};

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    title: "",
    date: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load events from localStorage
  useEffect(() => {
    const storedEvents: Event[] = JSON.parse(localStorage.getItem("calendarEvents") || "[]");
    setEvents(storedEvents);
  }, []);

  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
  };

  const handleAddOrUpdateEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error("Please fill in both title and date.");
      return;
    }

    if (editingId) {
      // Update existing event
      const updatedEvents = events.map((event) =>
        event.id === editingId ? { ...newEvent, id: editingId } : event
      );
      saveEvents(updatedEvents);
      toast.success("Event updated successfully!");
    } else {
      // Add new event
      const eventToAdd = { ...newEvent, id: Date.now().toString() };
      const updatedEvents = [...events, eventToAdd];
      saveEvents(updatedEvents);
      toast.success("Event added successfully!");
    }

    // Reset form
    setNewEvent({ id: "", title: "", date: "", description: "" });
    setEditingId(null);
  };

  const handleEditEvent = (event: Event) => {
    setNewEvent(event);
    setEditingId(event.id);
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    saveEvents(updatedEvents);
    toast.success("Event deleted successfully!");
  };

  return (
    <main className="max-w-5xl mx-auto p-6 mt-10 space-y-8">
      {/* Header */}
      <Card className="shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold">Admin Calendar Management 📅</h1>
          <p className="text-sm mt-2">Create, edit, and manage events for students.</p>
        </CardContent>
      </Card>

      {/* Add/Edit Event Form */}
      <Card className="shadow-md">
        <CardHeader className="text-lg font-semibold text-indigo-600">
          {editingId ? "Edit Event" : "Add New Event"}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="e.g. Faculty Orientation"
            />
          </div>
          <div>
            <Label htmlFor="date">Event Date</Label>
            <Input
              id="date"
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="desc">Description (optional)</Label>
            <Input
              id="desc"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="e.g. Venue: Main Hall"
            />
          </div>
          <Button onClick={handleAddOrUpdateEvent} className="w-full">
            {editingId ? "Update Event" : "Add Event"}
          </Button>
          {editingId && (
            <Button
              variant="secondary"
              className="w-full mt-2"
              onClick={() => {
                setEditingId(null);
                setNewEvent({ id: "", title: "", date: "", description: "" });
              }}
            >
              Cancel Edit
            </Button>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Events List */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">All Events</h2>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="shadow-sm">
                <CardHeader className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    {event.description || "No description."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No events have been created yet.</p>
        )}
      </section>
    </main>
  );
}
