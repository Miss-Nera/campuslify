import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from "next/link";

const CreateAccomodation = () => {
  return (
    <div className="space-y-6"> 
      <div className="grid gap-4 max-w-md mt-3">
        <Input type="text" placeholder="First name" />
        <Input type="text" placeholder="Middle name" />
        <Input type="text" placeholder="Last name" />
        <Input type="text" placeholder="Department" />
        <Input type="text" placeholder="Matric Number" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
      <div className="bg-white p-1 m-2rounded-md">
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select a College" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>College</SelectLabel>
                <SelectItem value="CICT">CICT</SelectItem>
                <SelectItem value="CMSS">CMSS</SelectItem>
                <SelectItem value="HUMANITIES">HUMANITIES</SelectItem>
                <SelectItem value="CBMAS">CBMAS</SelectItem>
                <SelectItem value="COE">COE</SelectItem>
                <SelectItem value="LAW">LAW</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white p-1 m-2rounded-md">
          <Select>
          <SelectTrigger className="w-40">
              <SelectValue placeholder="Select a Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gender</SelectLabel>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
      <div className="bg-white p-1 m-2rounded-md">
          <Select>
          <SelectTrigger className="w-40">
              <SelectValue placeholder="Select a Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Level</SelectLabel>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
                <SelectItem value="300">300</SelectItem>
                <SelectItem value="400">400</SelectItem>
                <SelectItem value="500">500</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white p-1 m-2rounded-md">
          <Select>
          <SelectTrigger className="w-40">
              <SelectValue placeholder="Select a Hostel" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Hostel</SelectLabel>
                <SelectItem value="Faith">Faith</SelectItem>
                <SelectItem value="barnabas">Barnabas</SelectItem>
                <SelectItem value="male annex">Male annex</SelectItem>
                <SelectItem value="female annex">Female annex</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button>
        <Link href='/home/accomodation'>
          <div className="">Submit</div>
        </Link>
      </Button>
    </div>
  );
};

export default CreateAccomodation;
