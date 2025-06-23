'use client'

// import { PieChart, } from 'lucide-react'
import { Piechart } from '@/components/piechart'
import { Barchart } from '@/components/ui/barchart'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import CreateAccomation from './create'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { jsx } from 'react/jsx-runtime'
const Accomodation = () => {
  const [showAccomodationForm, setShowAccomodationForm] = useState(false)
  console.log(showAccomodationForm)

  const handleShowCreateAccomodtion = () => {
    setShowAccomodationForm(!showAccomodationForm)
  }

  return (

    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-md">
          <Button onClick={() => handleShowCreateAccomodtion()}>
            {
               !showAccomodationForm ? 'Create accomodation' : 'Cancel'
            }
          </Button>
          {
            !showAccomodationForm ? (
              <Card className='mt-3'>
                <CardHeader>
                  ACCOMODATION
                </CardHeader>
                <CardContent>
                  <p> <small>we offer a variety of various hostel of good standard</small></p>
                </CardContent>
              </Card>
            ) : (
              <div className="">
                <CreateAccomation />
              </div>
            )
          }
        </div>
        <div className="bg-white p-4 rounded-md">
          <Barchart />
        </div>
        <div className="bg-white p-4 rounded-md">
          <Piechart />
        </div>
      </div>
    </div>
  )
}
export default Accomodation
