'use client';
import { CellContext, ColumnDef } from "@tanstack/react-table";

type Status = "pending" | "processing" | "success" | "failed";

export type Payment = {
  id: string;
  student: string;
  department: string;
  hostel: string;
  amount: number;
  status: Status;
  college: string; 
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Matric. No.",
    accessorFn: (row) => row.id,
    cell: (props: CellContext<Payment, unknown>) => {
      const id = props.getValue() as string;
      return <div className="text text-nowrap">{id}</div>;
    },
  },
  {
    accessorKey: "student",
    header: "Student Name",
    accessorFn: (row) => row.student,
    cell: (props: CellContext<Payment, unknown>) => {
      const student = props.getValue() as string;
      return <div className="text text-nowrap">{student}</div>;
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    accessorFn: (row) => row.department,
    cell: (props: CellContext<Payment, unknown>) => {
      const department = props.getValue() as string;
      return <div className="text text-nowrap">{department}</div>;
    },
  },
  {
    accessorKey: "hostel",
    header: "Hostel",
    accessorFn: (row) => row.hostel,
    cell: (props: CellContext<Payment, unknown>) => {
      const hostel = props.getValue() as string;
      return <div className="text text-nowrap">{hostel}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    accessorFn: (row) => row.amount,
    cell: (props: CellContext<Payment, unknown>) => {
      const amount = props.getValue() as number;
      return <div className="text text-nowrap">{amount}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => row.status,
    cell: (props: CellContext<Payment, unknown>) => {
      const status = props.getValue() as Status;
      return <div className="text text-nowrap">{status}</div>;
    },
  },
  {
    accessorKey: "college",
    header: "College",
    accessorFn: (row) => row.college,
    cell: (props: CellContext<Payment, unknown>) => {
      const college = props.getValue() as string;
      return <div className="text text-nowrap">{college}</div>;
    },
  },
];
