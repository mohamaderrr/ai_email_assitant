import React from 'react'
import EmailApp from './_compenent/EmailApp'
import MainNav from './_compenent/Navbar'
function page() {
  return ( <div>
     <MainNav/>
    <main className="flex min-h-screen flex-col items-center justify-between">
    <EmailApp />
  </main>
 
  </div>
  )
}

export default page
