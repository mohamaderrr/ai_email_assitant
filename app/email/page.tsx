import React from 'react'
import EmailApp from './_compenent/EmailApp'
import MainNav from '../_component/Navbar'
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
