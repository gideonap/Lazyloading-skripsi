import React from 'react'
import { Navbar, Footer } from '../../components/index'
import { Link } from 'react-router-dom'

const ComingSoon = () => {
  return (
    <div>
        <Navbar/>
        <div className='flex flex-col gap-7 w-full py-80 items-center'>
            <h1 className='font-bold'>Coming Soon!!</h1>
            <Link className='bg-accent text-sm text-primary px-7 py-3 rounded-lg w-fit hover:bg-hover-green shadow-md
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-300' to="/">Beranda</Link>
        </div>
        <Footer/>
    </div>
  )
}

export default ComingSoon