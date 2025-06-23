"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // import toast

type PaymentType = {
  id: string;
  label: string;
};

type Payment = {
  type: string;
  amount: number;
  status: string;
  date: string;
};

type StudentData = {
  id: string;
  student: string;
  department: string;
  hostel: string;
  college: string;
  payments: Payment[];
};

const paymentOptions: PaymentType[] = [
  { id: "tuition", label: "Tuition" },
  { id: "hostel", label: "Hostel" },
  { id: "energy", label: "Energy" },
  { id: "facility-mgt", label: "Facility MGT" },
  { id: "medicals", label: "Medicals" },
  { id: "laboratory", label: "Laboratory" },
  { id: "ict-cert", label: "ICT Certification" },
  { id: "entrepreneurship", label: "Entrepreneurship" },
  { id: "gpf", label: "GPF" },
];

export default function PaymentPage() {
  const [activePayment, setActivePayment] = useState<PaymentType | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    student: "",
    department: "",
    hostel: "",
    college: "",
    amount: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-fill student info when id changes
    if (field === "id") {
      const studentList: StudentData[] = JSON.parse(
        localStorage.getItem("studentDataList") || "[]"
      );
      const found = studentList.find((s) => s.id === value);
      if (found) {
        setFormData((prev) => ({
          ...prev,
          student: found.student,
          department: found.department,
          hostel: found.hostel,
          college: found.college,
          id: value,
        }));
      } else {
        // clear fields if no student found
        setFormData((prev) => ({
          ...prev,
          student: "",
          department: "",
          hostel: "",
          college: "",
          id: value,
        }));
      }
    }
  };

  const handlePayment = () => {
    const amount = parseFloat(formData.amount);
    if (
      !formData.id ||
      !formData.student ||
      !formData.department ||
      !formData.college ||
      isNaN(amount) ||
      amount <= 0
    ) {
      toast.error("Please fill in all required fields with valid values.");
      return;
    }

    const newPayment: Payment = {
      type: activePayment?.label || "",
      amount,
      status: "pending",
      date: new Date().toISOString(),
    };

    const prev: StudentData[] = JSON.parse(
      localStorage.getItem("studentDataList") || "[]"
    );
    const existingIndex = prev.findIndex((s) => s.id === formData.id);

    if (existingIndex !== -1) {
      // Student exists: add payment to their history
      if (!prev[existingIndex].payments) {
        prev[existingIndex].payments = [];
      }
      prev[existingIndex].payments.push(newPayment);
    } else {
      // New student
      prev.push({
        id: formData.id,
        student: formData.student,
        department: formData.department,
        hostel: formData.hostel,
        college: formData.college,
        payments: [newPayment],
      });
    }

    localStorage.setItem("studentDataList", JSON.stringify(prev));
    toast.success(`Payment of ₦${amount} for ${activePayment?.label} added!`);

    setFormData({
      id: "",
      student: "",
      department: "",
      hostel: "",
      college: "",
      amount: "",
    });
    setActivePayment(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Make a Payment</h1>

      <Carousel className="w-full">
        <CarouselContent>
          {paymentOptions.map((payment) => (
            <CarouselItem key={payment.id} className="basis-1/3 lg:basis-1/4">
              <div className="p-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Card
                      className="cursor-pointer hover:shadow-lg transition"
                      onClick={() => setActivePayment(payment)}
                    >
                      <CardContent className="flex aspect-square items-center justify-center p-6 text-xl font-semibold text-center">
                        {payment.label}
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  {activePayment?.id === payment.id && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pay for {payment.label}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Input
                          placeholder="Student ID"
                          value={formData.id}
                          onChange={(e) => handleInputChange("id", e.target.value)}
                        />
                        <Input
                          placeholder="Student Name"
                          value={formData.student}
                          onChange={(e) =>
                            handleInputChange("student", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Department"
                          value={formData.department}
                          onChange={(e) =>
                            handleInputChange("department", e.target.value)
                          }
                        />
                        <Input
                          placeholder="College"
                          value={formData.college}
                          onChange={(e) =>
                            handleInputChange("college", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Hostel (optional)"
                          value={formData.hostel}
                          onChange={(e) =>
                            handleInputChange("hostel", e.target.value)
                          }
                        />
                        <Input
                          placeholder="₦ Amount"
                          type="number"
                          value={formData.amount}
                          onChange={(e) =>
                            handleInputChange("amount", e.target.value)
                          }
                        />
                        <Button onClick={handlePayment} className="w-full">
                          Submit Payment
                        </Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="mt-6">
        <Link href="/home" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
