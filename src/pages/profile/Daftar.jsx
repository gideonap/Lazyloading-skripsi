import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Footer, Button } from '../../components/index'

const Daftar = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      alert('Mohon isi semua kolom');
    } else if (password !== confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok');
    } else {
      localStorage.setItem('registrationData', JSON.stringify({ name, email, password }));
      navigate('/daftar-data-diri');
    }
  }
  
  return (
    <div>
      <Navbar />
      <div className='flex flex-row gap-7 items-center justify-center w-full'>
        <div className='flex flex-col w-fit gap-4'>
          <div className='flex flex-col items-center'>
            <img src="/LogoPesonaBedengan.png" alt="" className='lg:hidden mb-5'/>
            <h2 className='lg:hidden font-semibold'>Daftar</h2>
            <h2 className='hidden lg:block font-semibold'>Daftar atau Buat Akun</h2>
            <p className='text-sm font-semibold text-center'>Selamat datang di Bumi Perkemahan Bedengan </p>
          </div>

          <form onSubmit={handleRegister} className='flex flex-col gap-5 px-4 lg:px-0'>
            <div className='flex flex-col gap-1'>
              <label className='font-semibold'>Nama Lengkap</label>
              <input 
                type="text"
                placeholder='Nama'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray sm:text-sm"
                required
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='font-semibold'>Email</label>
              <input 
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray sm:text-sm"
                required
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='font-semibold'>Buat Kata Sandi</label>
              <input 
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray sm:text-sm"
                required
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='font-semibold'>Konfirmasi Kata Sandi</label>
              <input 
                type="password"
                placeholder='Konfirmasi Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray sm:text-sm"
                required
              />
            </div>
            <Button type='submit' className='w-full'>Daftar</Button>
          </form>

          <div className='flex flex-col items-center'>
            <div className='flex flex-row gap-1'>
              <p className='text-sm'>Sudah punya akun?</p>
              <Link to='/masuk' className='text-sm text-blue-400 hover:text-blue-600 transition-colors duration-300'>Masuk</Link>
            </div>
          </div>
        </div>
        <img src="/images/background.JPG" alt="" className='hidden lg:block rounded-md w-[33rem] h-[40rem] object-cover'/>
      </div>
      <Footer className='mt-20'/>
    </div>
  )
}

export default Daftar