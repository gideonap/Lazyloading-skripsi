import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the navigate hook
import { Button, PaymentRow } from '../../components';
import { createInvoiceReservasi } from '../../services/invoiceService'; // Import your createInvoiceReservasi API call

// Modal Component for Terms and Conditions
const TermsModal = ({ onClose, onAgree }) => {
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);

  const handleAgree = () => {
    if (checkbox1 && checkbox2) {
      onAgree();
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-md shadow-md max-w-lg w-full'>
        <h3 className='text-lg text-center font-semibold mb-4'>Syarat dan Ketentuan</h3>
        <div className='flex flex-col gap-5'>
          <p className='text-center'>
            Pengunjung diharapkan membaca syarat dan ketentuan yang telah tertera pada halaman <strong>Syarat dan Ketentuan</strong> sebelum melanjutkan pembayaran.
          </p>

          <div className='w-full bg-secondary h-[1px]' />

          <div className='flex flex-col gap-2 mb-4'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={checkbox1}
                onChange={() => setCheckbox1(!checkbox1)}
                className='mr-2'
              />
              Saya telah membaca dan memahami syarat dan ketentuan yang berlaku
            </label>

            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={checkbox2}
                onChange={() => setCheckbox2(!checkbox2)}
                className='mr-2'
              />
              Saya menyetujui syarat dan ketentuan yang berlaku
            </label>
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button onClick={onClose} className=''>
            Batal
          </Button>
          <Button
            onClick={handleAgree}
            disabled={!checkbox1 || !checkbox2}
            className={`bg-${!checkbox1 || !checkbox2 ? 'gray-400' : 'accent'} text-primary`}
          >
            Setuju
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main RincianPembayaran Component
const RincianPembayaran = ({ formData, onInvoiceCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate hook

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAgree = async () => {
    const requestBody = {
      jenis_pengunjung: formData.jenis_pengunjung,
      tanggal_kedatangan: formData.tanggal_kedatangan,
      tanggal_kepulangan: formData.tanggal_kepulangan,
      keterangan: formData.keterangan,
      reservasi: formData.reservasi.map((item) => {
        if (item.kavling_id) {
          return { kavling_id: item.kavling_id, jumlah: item.jumlah };
        } else if (item.perlengkapan_id) {
          return { perlengkapan_id: item.perlengkapan_id, jumlah: item.jumlah };
        }
        return null; // Safety check
      }).filter(Boolean),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await createInvoiceReservasi(token, requestBody);
      const reservationId = response.data.id;

      console.log('Invoice created successfully', response);

      // Trigger the onInvoiceCreated function to navigate to the next route
      onInvoiceCreated(reservationId);
    } catch (error) {
      console.error('Failed to create invoice:', error);
      // Handle error (e.g., show toast or alert)
    }
  };

  // Calculate the number of days between arrival and departure
  const calculateDaysSpent = () => {
    const arrivalDate = new Date(formData.tanggal_kedatangan);
    const departureDate = new Date(formData.tanggal_kepulangan);
    const timeDifference = Math.abs(departureDate - arrivalDate);
    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return days || 1; // Default to 1 if calculation fails
  };

  const daysSpent = calculateDaysSpent();

  // Calculate total price for kavlings and items
  const calculateTotal = () => {
    const total = formData.reservasi.reduce((sum, item) => sum + (item.harga * item.jumlah || 0), 0);
    return total * daysSpent;
  };

  useEffect(() => {
    console.log('FormData in RincianPembayaran:', formData);
  }, [formData]);

  return (
    <div className='flex flex-col items-center gap-3 px-28'>
      <div className='flex flex-col items-center'>
        <h2 className='font-semibold'>Pembayaran</h2>
        <p className='text-secondary-gray'>Rincian Pembayaran (x{daysSpent} hari)</p>
      </div>

      <div className='flex flex-col gap-8 items-center'>
        <div className='flex flex-col gap-7'>
          {/* Display reservasi payments */}
          {formData.reservasi.length > 0 ? (
            formData.reservasi.map((item, index) => (
              <PaymentRow
                key={index}
                name={item.kavling_id ? `${item.name}` : `${item.nama}`} // Display kavling or item name
                quantity={item.jumlah}
                price={item.harga * item.jumlah || 0}
              />
            ))
          ) : (
            <p>No items selected</p>
          )}
        </div>

        <div className='w-full bg-secondary h-[1px]' />

        <div className='flex flex-row justify-between items-center w-full'>
          <span className='text-sm lg:text-base'>Total Pembayaran</span>
          <span className='font-semibold text-lg lg:text-3xl'>Rp {calculateTotal().toLocaleString()}</span>
        </div>

        <Button className='w-full' onClick={openModal}>
          Selanjutnya
        </Button>
      </div>

      {isModalOpen && (
        <TermsModal onClose={closeModal} onAgree={handleAgree} />
      )}
    </div>
  );
};

export default RincianPembayaran;
