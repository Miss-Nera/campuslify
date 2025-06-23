"use client";

import React, { useState, useEffect } from "react";
import { GeneralTable, Actions, Search } from "@/app/components/general-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EntryDialog } from "../add";

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
  amount: number; // latest payment amount
  status: string;
  college: string;
  payments: PaymentEntry[];
};

// Define a type for the table row data, excluding payments array
type TableRowData = {
  id: string;
  student: string;
  department: string;
  hostel: string;
  amount: string; // formatted amount for display
  status: string;
  college: string;
};

const LOCAL_STORAGE_KEY = "studentDataList";

const DEFAULT_DATA: StudentInfo[] = [
  {
    id: "Su22201001T",
    student: "Ochogwu Oche",
    department: "Computer Science",
    hostel: "Barnabas Hostel",
    amount: 120000,
    status: "pending",
    college: "CICT",
    payments: [{ type: "Tuition", amount: 120000, date: "2024-10-01" }],
  },
  {
    id: "Su22201002T",
    student: "Momoh Oluwaferanmi Emmanuel",
    department: "Computer Science",
    hostel: "Male Annex",
    amount: 180000,
    status: "processing",
    college: "CICT",
    payments: [{ type: "Hostel", amount: 180000, date: "2024-11-20" }],
  },
   {
    id: "Su22201004",
    student: "Akpabio Esther Thompson",
    department: "Computer Science",
    hostel: "Faith",
    amount: 100000,
    status: "processing",
    college: "CICT",
    payments: [{ type: "Hostel", amount: 100000, date: "2024-11-20" }],
  },
   {
    id: "SU201027D",
    student: "Martin Chinwe Catherine",
    department: "Computer Science",
    hostel: "Female annex",
    amount: 240000,
    status: "success",
    college: "CICT",
    payments: [{ type: "Hostel", amount: 240000, date: "2024-11-20" }],
  },
   {
    id: "SU22945001",
    student: "Toviho Elade-Ebi",
    department: "Law",
    hostel: "new",
    amount: 140000,
    status: "failed",
    college: "law",
    payments: [{ type: "Hostel", amount: 140000, date: "2024-11-20" }],
  },

];

const StudentPage: React.FC = () => {
  const [data, setData] = useState<StudentInfo[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<StudentInfo | null>(null);
  const [historyItem, setHistoryItem] = useState<StudentInfo | null>(null); // For payment history dialog

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
      setData(DEFAULT_DATA);
    } else {
      setData(JSON.parse(stored));
    }
  }, []);

  const saveDataToLocalStorage = (updated: StudentInfo[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setData(updated);
  };

  const handleSave = (item: StudentInfo, isEdit: boolean) => {
    const newPayment: PaymentEntry = {
      type: "Manual entry",
      amount: item.amount,
      date: new Date().toISOString(),
    };

    if (!isEdit) {
      const exists = data.find((entry) => entry.id === item.id);
      if (exists) {
        // Update existing student, append payment
        const updated = data.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                amount: item.amount, // update current amount
                status: item.status,
                payments: [...(entry.payments || []), newPayment],
              }
            : entry
        );
        saveDataToLocalStorage(updated);
      } else {
        // Add new student with first payment
        const newStudent: StudentInfo = {
          ...item,
          payments: [newPayment],
        };
        saveDataToLocalStorage([...data, newStudent]);
      }
    } else {
      // Editing existing student
      const updated = data.map((entry) => (entry.id === item.id ? item : entry));
      saveDataToLocalStorage(updated);
    }

    setDialogOpen(false);
    setEditItem(null);
    setSelectedRows([]);
  };

  const handleEdit = () => {
    if (selectedRows.length !== 1) {
      alert("Please select exactly one row to edit.");
      return;
    }
    const itemToEdit = data.find((entry) => entry.id === selectedRows[0]) || null;
    if (!itemToEdit) {
      alert("Selected item not found.");
      return;
    }
    setEditItem(itemToEdit);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    const updated = data.filter((item) => !selectedRows.includes(item.id));
    saveDataToLocalStorage(updated);
    setSelectedRows([]);
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const header = [
    { key: "id", label: "ID" },
    { key: "student", label: "Student Name" },
    { key: "department", label: "Department" },
    { key: "hostel", label: "Hostel" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  // Map filtered data into TableRowData (exclude payments)
const tableData: TableRowData[] = filteredData.map(({ payments, ...rest }) => {
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  return {
    ...rest,
    amount: totalAmount.toLocaleString(), // e.g., "120,000"
  };
});

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Students</h1>

      <GeneralTable
        data={{
          header,
          items: tableData,
        }}
        selectableRows
        selectedRows={selectedRows}
        onRowSelect={handleSelectRow}
      >
        <Search>
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[400px] text-sm"
          />
        </Search>
        <Actions>
          <div className="flex gap-2">
            <Button
              className="bg-white hover:bg-white text-black"
              onClick={() => {
                setEditItem(null);
                setDialogOpen(true);
              }}
            >
              Add
            </Button>
            <Button
              className="bg-white hover:bg-white text-black"
              onClick={handleEdit}
              disabled={selectedRows.length !== 1}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={selectedRows.length === 0}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                if (selectedRows.length !== 1) {
                  alert("Please select exactly one row to view payment history.");
                  return;
                }
                const selectedStudent = data.find(
                  (student) => student.id === selectedRows[0]
                );
                if (!selectedStudent) {
                  alert("Selected student not found.");
                  return;
                }
                setHistoryItem(selectedStudent);
              }}
              disabled={selectedRows.length !== 1}
            >
              View Payment History
            </Button>
          </div>
        </Actions>
      </GeneralTable>

      {dialogOpen && (
        <EntryDialog
          initialData={editItem || undefined}
          open={dialogOpen}
          setOpen={setDialogOpen}
          onSave={handleSave}
        />
      )}

      {/* Payment History Dialog */}
      {historyItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setHistoryItem(null)}
        >
          <div
            className="bg-white p-6 rounded-md max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Payment History for {historyItem.student}
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">Type</th>
                  <th className="border-b p-2">Amount</th>
                  <th className="border-b p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {historyItem.payments.length > 0 ? (
                  historyItem.payments.map((p, idx) => (
                    <tr key={idx}>
                      <td className="border-b p-2">{p.type}</td>
                      <td className="border-b p-2">
                        ₦{p.amount.toLocaleString()}
                      </td>
                      <td className="border-b p-2">
                        {new Date(p.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-2 text-center text-gray-500 italic"
                    >
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-4 text-right">
              <Button onClick={() => setHistoryItem(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentPage;
