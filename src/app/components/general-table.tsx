import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

type TableRowData = {
  id: string;
  [key: string]: string | number | undefined; // values could be string or number or undefined
};

type Header = {
  key: string;
  label: React.ReactNode; // Could be string or React element
};

type Data = {
  header: Header[];
  items: TableRowData[];
};

type Props = {
  data: Data;
  selectableRows?: boolean;
  selectedRows?: string[];
  onRowSelect?: (id: string) => void;
  onRowClick?: (item: TableRowData) => void;
  children?: React.ReactNode;
};

export const GeneralTable: React.FC<Props> = ({
  data,
  selectableRows = false,
  selectedRows = [],
  onRowSelect,
  onRowClick,
  children,
}) => {
  let SearchComponent: React.ReactElement | null = null;
  let ActionsComponent: React.ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === Search) SearchComponent = child;
    else if (child.type === Actions) ActionsComponent = child;
  });

  return (
    <div className="rounded-md border">
      <div className="flex justify-between items-center px-4 py-2">
        {SearchComponent}
        {ActionsComponent}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {selectableRows && <TableHead>Select</TableHead>}
            {data.header.map((head) => (
              <TableHead key={head.key}>{head.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length > 0 ? (
            data.items.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className="cursor-pointer"
              >
                {selectableRows && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => onRowSelect?.(item.id)}
                    />
                  </TableCell>
                )}
                {data.header.map((head) => (
                  <TableCell key={`${head.key}-${item.id}`}>
                    {item[head.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={data.header.length + (selectableRows ? 1 : 0)}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export const Search: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const Actions: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
