import React, { useState } from 'react';
import DetailKavling from './DetailKavling';
import ItemTambahan from './ItemTambahan';
import { Navbar, Footer } from '../../components/index';
import { useNavigate } from "react-router-dom";
import { getMyUserInfo } from '../../services/userService';

const Reservasi = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleNext = (data) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    if (step === 1) {
      setStep(2);
    }
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleSubmit = async (selectedItems) => {
    try {
      const token = localStorage.getItem('token');
      const userInfoResponse = await getMyUserInfo(token);
      const userInfo = userInfoResponse?.data;

      // Prepare the final data to be submitted
      const finalData = {
        jenis_pengunjung: formData.visitorType,
        tanggal_kedatangan: formData.arrivalDate,
        tanggal_kepulangan: formData.departureDate,
        keterangan: JSON.stringify({
          jumlah_pengunjung: formData.numberOfVisitor,
          nama: userInfo?.name,
          nik: userInfo?.nik,
          alamat: userInfo?.alamat,
          telepon: userInfo?.phone,
        }),
        reservasi: selectedItems, // Add selected items here
      };

      console.log('Final Reservation Data:', finalData);
      localStorage.setItem('tmp_add_reservasi', JSON.stringify(finalData));
      navigate('/kavling');
    } catch (error) {
      console.error('Error fetching user info or submitting reservation:', error);
    }
  };

  return (
    <div>
      <Navbar />
      {step === 1 && <DetailKavling onNext={handleNext} />}
      {step === 2 && <ItemTambahan onSubmit={handleSubmit} onPrev={handlePrev} />}
      <Footer className='mt-20' />
    </div>
  );
};

export default Reservasi;
