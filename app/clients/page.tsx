import React from 'react'
import MainNav from '../_component/Navbar'

function page() {
  return (
    <div>

   
    <MainNav/>
    <div className="container mx-auto py-10">
    <h1 className="text-4xl font-bold mb-6">Client Data</h1>
    <p className="text-lg text-muted-foreground">
      Manage your client information here
    </p>
  </div>
  </div>
  )
}

export default page
