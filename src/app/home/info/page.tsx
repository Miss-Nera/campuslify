import React from 'react'
import { Textarea } from "@/components/ui/textarea"

export function TextareaDemo() {
  return <Textarea placeholder="Type your message here." />
}

const InformationPage = () => {
  return (
    <div className="relative min-h-screen bg-[url('/app.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <h1 className="text-white text-4xl font-bold mb-6 text-center">
          Tell us a bit about yourself
        </h1>
        <div className="w-full max-w-md">
          <TextareaDemo />
        </div>
      </div>
    </div>
  )
}

export default InformationPage
