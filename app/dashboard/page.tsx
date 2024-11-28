import React from 'react'
import MainNav from '../email/_compenent/Navbar'
function page() {
  return (
    <div>
    <MainNav/>
      <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Analytics Dashboard</h1>
      <p className="text-lg text-muted-foreground">
        View your analytics and metrics here
      </p>
    </div>
    </div>
  )
}

export default page
