import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../../components';
import { toast } from 'react-toastify';
import RincianPembayaran from './RincianPembayaran';

const Pembayaran = () => {
  const [lastFormData, setLastFormData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('tmp_add_reservasi');
    if (storedData) {
      setLastFormData(JSON.parse(storedData));
    }
  }, []);

  const handleInvoiceCreated = (reservationId) => {
    toast.success('Reservasi berhasil dibuat');
    localStorage.removeItem('tmp_add_reservasi');
    navigate(`/pembayaran/${reservationId}`);
  };

  return (
    <div>
      <Navbar />
      {lastFormData && (
        <RincianPembayaran formData={lastFormData} onInvoiceCreated={handleInvoiceCreated} />
      )}
      <Footer className='mt-20' />
    </div>
  );
};

export default Pembayaran;
