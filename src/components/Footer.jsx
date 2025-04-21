import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { PiPhoneFill } from "react-icons/pi";
import { BiSolidEnvelope } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";

const Footer = ({ className }) => {

  return (
    <div className={`flex flex-col items-center gap-5 lg:gap-2 px-10 md:px-28 lg:px-28 pt-9 pb-5 ${className}`}>
      <div className='flex flex-col justify-start gap-5 lg:gap-3'>
        <div className='flex flex-col md:flex-row lg:flex-row justify-evenly gap-5 md:gap-14 lg:gap-20'>
            <div className='flex flex-col gap-2 lg:gap-4'>
              <h3 className='font-semibold text-xl'>Bumi Perkemahan Bedengan</h3>
              <div className='flex flex-col gap-8'>
                <p className='text-inactive-gray w-72'>Bumi Perkemahan Bedengan merupakan sebuah destinasi yang menawarkan camping ground dengan keindahan hutan pinus.</p>
              </div>
            </div>
            <div className='flex flex-col gap-2 lg:gap-4 text-inactive-gray'>
              <p className='text-secondary font-bold'>Link</p>
              <Link className='transition-colors hover:text-secondary duration-300' to="/">Beranda</Link>
              <Link className='transition-colors hover:text-secondary duration-300' to="/reservasi">Reservasi</Link>
              <Link className='transition-colors hover:text-secondary duration-300' to="/syarat-dan-ketentuan">Syarat & Ketentuan</Link>
            </div>
            <div className='flex flex-col gap-4 lg:gap-4 text-inactive-gray'>
              <p className='text-secondary font-bold'>Contact</p>
              <div className='flex flex-row gap-2 items-center'>
                <PiPhoneFill className='text-secondary text-xl'/>
                <p>+62 851-7227-3501</p>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <BiSolidEnvelope className='text-secondary text-xl'/>
                <p>reservasibedengan@gmail.com</p>
              </div>
              <div className='flex flex-row gap-2'>
                <FaLocationDot className='text-secondary text-xl'/>
                <p>Jl. Raya Selokerto, Selorejo, Kec. Dau, Kabupaten<br/> Malang, Jawa Timur 65151</p>
              </div>
            </div>
        </div>
        <div className='w-full'>
          <div className='flex flex-row gap-3 lg:gap-4'>
            <a href="https://www.instagram.com/buper_bedengan/">
              <FaInstagram className='text-secondary text-xl'/>
            </a>
          </div>
        </div>
      </div>
      <p className='text-inactive-gray text-center'>&copy;2024 Bumi Perkemahan Bedengan All rights reserved.</p>
    </div>
  )
}

export default Footer