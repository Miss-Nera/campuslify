"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const EVENTS_KEY = "calendarEvents";
const localizer = momentLocalizer(moment);

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: string;
  description?: string;
};

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");

 useEffect(() => {
  const stored = localStorage.getItem(EVENTS_KEY);
  if (stored) {
    try {
      const parsed: CalendarEvent[] = JSON.parse(stored);

      setEvents(
        parsed.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }))
      );
    } catch (err) {
      console.error("Failed to parse events from localStorage", err);
    }
  }
}, []);

  const saveEvents = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(newEvents));
  };

  const addEvent = () => {
    if (!title || !date) {
      toast.error("Title and Date are required!");
      return;
    }
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title,
      start: new Date(date),
      end: new Date(date),
      category,
      description,
    };
    const updated = [...events, newEvent];
    saveEvents(updated);
    setTitle("");
    setDate("");
    setCategory("general");
    setDescription("");
    toast.success("Event added successfully!");
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#4f46e5"; // default indigo
    if (event.category === "food") backgroundColor = "#16a34a"; 
    if (event.category === "health") backgroundColor = "#0000F";
    if (event.category === "exams") backgroundColor = "#ea580c"; 
    if (event.category === "Urgent") backgroundColor = "#dc2626";
    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        padding: "2px",
        color: "white",
      },
    };
  };

  return (
    <div className="p-6 space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Event</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="exams">Exams</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Button onClick={addEvent}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />

      <div className="mt-4 space-x-2">
        <Badge className="bg-indigo-600">General</Badge>
        <Badge className="bg-green-600">Food</Badge>
        <Badge className="bg-blue-600">Health</Badge>
        <Badge className="bg-orange-600">Exams</Badge>
        <Badge className="bg-red-600">Urgent</Badge>
      </div>
    </div>
  );
}
