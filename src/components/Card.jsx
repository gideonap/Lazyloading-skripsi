import React from 'react'
import { LuTent } from "react-icons/lu";
import { FaMattressPillow } from "react-icons/fa6";
import { VscTools } from "react-icons/vsc";
import { MdOutlinePeopleAlt } from "react-icons/md";


const Card = ( {onCLick, Amount, Capacity, Price, ...props} ) => {
  return (
    <div className='flex flex-col gap-5 items-center'>
      <img src="/images/background.JPG" alt="" className='h-56 w-auto object-cover' />
      <h3 className='font-semibold text-xl text-secondary'>{Amount}</h3>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-row items-center gap-4'>
          <LuTent className='text-hover-green text-2xl'/>
          <p className='text-secondary'>1 set tenda dome</p>
        </div>
        <div className='flex flex-row items-center gap-4'>
          <FaMattressPillow className='text-hover-green text-2xl'/>
          <p className='text-secondary'>Matras</p>
        </div>
        <div className='flex flex-row items-center gap-4'>
          <VscTools className='text-hover-green text-2xl'/>
          <p className='text-secondary'>Jasa bongkar pasang oleh petugas</p>
        </div>
        <div className='flex flex-row items-center gap-4'>
          <MdOutlinePeopleAlt className='text-hover-green text-2xl'/>
          <p className='text-secondary'>{Capacity}</p>
        </div>
      </div>
      <h3 className='font-semibold text-2xl text-secondary'>Rp {Price}</h3>
      <button
        type='button'
        onClick={onCLick}
        className='bg-accent text-sm text-primary px-7 py-3 rounded-lg w-fit hover:bg-hover-green shadow-md
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-300'
      >
        Pesan Sekarang
      </button>
    </div>
  )
}

export default Card