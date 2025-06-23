"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentEntry = {
  type: string;
  amount: number;
  date: string;
};

type StudentInfo = {
  id: string;
  student: string;
  department: string;
  hostel: string;
  amount: number;
  status: string;
  college: string;
  payments: PaymentEntry[];
};

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  initialData?: StudentInfo | null;
  onSave: (item: StudentInfo, isEdit: boolean) => void;
}

export function EntryDialog({ open, setOpen, initialData, onSave }: Props) {
  const [form, setForm] = useState({
    id: "",
    student: "",
    department: "",
    hostel: "",
    amount: "",
    status: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        student: initialData.student,
        department: initialData.department,
        hostel: initialData.hostel,
        amount: String(initialData.amount),
        status: initialData.status,
      });
    } else {
      setForm({
        id: "",
        student: "",
        department: "",
        hostel: "",
        amount: "",
        status: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setForm({ ...form, status: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { id, student, department, hostel, amount, status } = form;

    if (!id || !student || !department || !hostel || !amount || !status) {
      alert("Please fill in all fields.");
      return;
    }

    const payment: PaymentEntry = {
      type: "Manual Entry",
      amount: Number(amount),
      date: new Date().toISOString(),
    };

    const item: StudentInfo = {
      id,
      student,
      department,
      hostel,
      amount: Number(amount),
      status,
      college: "CICT",
      payments: [payment],
    };

    onSave(item, !!initialData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Payment" : "Add Payment"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the student's payment record."
              : "Enter a new payment for the student."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Matric Number</Label>
            <Input
              name="id"
              value={form.id}
              onChange={handleChange}
              disabled={!!initialData}
            />
          </div>
          <div>
            <Label>Full Name</Label>
            <Input name="student" value={form.student} onChange={handleChange} />
          </div>
          <div>
            <Label>Department</Label>
            <Input name="department" value={form.department} onChange={handleChange} />
          </div>
          <div>
            <Label>Hostel</Label>
            <Input name="hostel" value={form.hostel} onChange={handleChange} />
          </div>
          <div>
            <Label>Amount</Label>
            <Input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">{initialData ? "Update" : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
