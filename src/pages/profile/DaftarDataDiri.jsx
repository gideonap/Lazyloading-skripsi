import React, { useState } from 'react';
import { Button, Navbar, Footer } from '../../components/index';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/userService';
import { toast } from 'react-toastify';

const DaftarDataDiri = () => {
  const [formData, setFormData] = useState({
    nik: '',
    alamat: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();
  const storedData = JSON.parse(localStorage.getItem('registrationData')) || {};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const dataToSend = new FormData();
    dataToSend.append('email', storedData.email);
    dataToSend.append('name', storedData.name);
    dataToSend.append('password', storedData.password);
    dataToSend.append('confirm_password', storedData.password);
    dataToSend.append('phone', formData.phoneNumber);
    dataToSend.append('nik', formData.nik);
    dataToSend.append('alamat', formData.alamat);
    
    try {
      await registerUser(dataToSend);
      localStorage.removeItem('registrationData');
      navigate('/masuk');
      toast.success('Registrasi Berhasil');
    } catch {
      console.log('Error');
      toast.error('Registrasi Gagal');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col gap-3 items-center px-10 lg:px-28">
        <div className="flex flex-col items-center">
          <h2 className="font-semibold text-2xl lg:text-4xl">Daftar</h2>
          <p className="text-secondary-gray">Lengkapi Data Diri</p>
        </div>

        <div className="flex flex-col gap-4 w-80 lg:w-[30rem]">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">NIK</label>
            <input
              type="text"
              name="nik"
              placeholder="Masukkan NIK"
              onChange={handleChange}
              value={formData.nik}
              className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Alamat (Sesuai KTP)</label>
            <input
              type="text"
              name="alamat"
              placeholder="Masukkan Alamat"
              onChange={handleChange}
              value={formData.alamat}
              className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Nomor Telepon</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Nomor yang bisa dihubungi"
              onChange={handleChange}
              value={formData.phoneNumber}
              className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
              required
            />
          </div>

          <div className="flex w-full justify-center lg:justify-end">
            <Button onClick={handleSubmit} className="w-full lg:w-fit">
              Daftar
            </Button>
          </div>
        </div>
      </div>
      <Footer className="mt-20" />
    </div>
  );
};

export default DaftarDataDiri;
