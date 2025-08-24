// @/components/PasswordInput.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

type Props = Omit<React.ComponentProps<typeof Input>, "type"> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordInput({ value, onChange, ...rest }: Props) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <Input
        {...rest}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShow((s) => !s)}
        className="absolute right-1.5 top-1.5 h-7 w-7"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
