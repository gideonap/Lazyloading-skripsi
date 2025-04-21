import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MdOutlinePersonOutline } from "react-icons/md";
import { RiFileList2Line } from "react-icons/ri";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { Navbar, Footer, Button } from '../../components/index'
import ContentProfil from './ContentProfil';
import ContentPesanan from './ContentPesanan';
import ContentRiwayat from './ContentRiwayat';

const Profil = () => {
  const { '*': subroute } = useParams();
  const renderContent = () => {
    switch (subroute) {
      case 'pesanan':
        return <ContentPesanan />;
      case 'riwayat':
        return <ContentRiwayat />;
      default:
        return <ContentProfil />;
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex flex-row justify-center gap-6 px-10 lg:px-28'>
        <ol className='hidden lg:flex flex-col items-start pt-3 min-w-64 gap-6 border-r-[1.5px] border-inactive-gray-2'>
          <li className={`flex flex-row gap-2 items-center cursor-pointer transition-colors duration-300 ${subroute === '' ? 'font-bold border-r-4 border-accent w-full' : ''}`}>
            <Link to="/profil" className="flex flex-row gap-2 items-center">
              <MdOutlinePersonOutline className='text-lg'/>
              Profil
            </Link>
          </li>
          <li className={`flex flex-row gap-2 items-center cursor-pointer transition-colors duration-300 ${subroute === 'pesanan' ? 'font-bold border-r-4 border-accent w-full' : ''}`}>
            <Link to="/profil/pesanan" className="flex flex-row gap-2 items-center">
              <RiFileList2Line className='text-lg'/>
              Pesanan
            </Link>
          </li>
          <li className={`flex flex-row gap-2 items-center cursor-pointer transition-colors duration-300 ${subroute === 'riwayat' ? 'font-bold border-r-4 border-accent w-full' : ''}`}>
            <Link to="/profil/riwayat" className="flex flex-row gap-2 items-center">
              <PiClockCounterClockwiseBold className='text-lg'/>
              Riwayat Pesanan
            </Link>
          </li>
        </ol>
        {renderContent()}
      </div>
      <Footer className='mt-20' />
    </div>
  )
}

export default Profil