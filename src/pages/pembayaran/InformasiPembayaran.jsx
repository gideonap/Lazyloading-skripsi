import React from 'react';
import { Button } from '../../components';
import { toast } from 'react-toastify';

const InformasiPembayaran = ({ total, onNext }) => { // Accept the total prop
  // Function to handle copying text to the clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.info('Text copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className='flex flex-col items-center gap-3 px-10 lg:px-28'>
      <div className='flex flex-col items-center'>
        <h2 className='font-semibold'>Pembayaran</h2>
        <p className='text-secondary-gray'>Rincian Pembayaran</p>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex items-center lg:items-start flex-col lg:flex-row gap-4'>
          <div className='flex flex-col gap-4 max-w-96'>
            <div className='flex flex-col gap-4 border-[1.5px] border-secondary rounded-md px-2 py-3 lg:px-7 lg:py-6'>
              <span className='text-left w-full px-3'>Total Tagihan</span>
              <div className='w-full bg-secondary h-[1px]' />
              <div className='flex flex-row items-center'>
                <span className='w-60 text-center text-2xl font-semibold'>
                  Rp {total?.toLocaleString() || '0'}
                </span>
                <button
                  className='flex flex-row gap-1 px-6 py-2 border-[1.5px] border-secondary rounded-full hover:bg-secondary hover:text-primary transition-colors duration-300'
                  onClick={() => handleCopy(total|| '0')}
                >
                  Salin
                </button>
              </div>
            </div>

            <div className='flex flex-col gap-4 border-[1.5px] border-secondary rounded-md px-2 py-3 lg:px-7 lg:py-6'>
              <span className='px-3'>Informasi Pembayaran</span>
              <div className='w-full bg-secondary h-[1px]' />
              <ol className='flex flex-col gap-1 list-decimal px-6 lg:px-3'>
                <li>Lakukan pembayaran sesuai jumlah tagihan ke rekening tertera.</li>
                <li>Pastikan penerima atas nama <strong>YOGIK INDRA PRATAMA</strong></li>
                <li>Tunggu verifikasi dari admin Bumi Perkemahan Bedengan maksimal 1x24 jam.</li>
              </ol>
            </div>
          </div>

          {/* Rekening Section */}
          <div className='flex flex-col gap-3 lg:w-[35rem] h-fit border-[1.5px] border-secondary rounded-md px-2 py-3 lg:px-7 lg:py-6'>
            <div className='flex flex-col lg:flex-row items-center w-full justify-between'>
              <span className='text-left px-3'>Pembayaran via Transfer</span>
              <span className='px-2 py-1 lg:px-5 lg:py-2 bg-orange-400 text-sm text-primary rounded-full'>
                Menunggu Pembayaran
              </span>
            </div>
            <div className='w-full bg-secondary h-[1px]' />
            <div className='flex flex-col gap-8 items-center'>
              <span className='text-center'>
                Segera lakukan pembayaran Anda dengan mentransfer pembayaran ke rekening berikut
              </span>
              <div className='flex flex-col lg:flex-row items-center gap-2 lg:gap-0 lg:px-0'>
                <span className='w-60 text-center text-2xl font-semibold'>0190784771</span>
                <button
                  className='flex flex-row gap-1 px-6 py-2 border-[1.5px] border-secondary rounded-full hover:bg-secondary hover:text-primary transition-colors duration-300'
                  onClick={() => handleCopy('0190784771')}
                >
                  Salin
                </button>
              </div>
              <span className='flex flex-row gap-2 items-center'>
                <img src="/images/BCALogo.webp" className='h-4 w-auto' alt="" />
                AN. YOGIK INDRA PRATAMA (BANK BCA)
              </span>
            </div>
          </div>
        </div>
        <div className='w-full bg-secondary h-[1px]' />
        <Button onClick={onNext} className='w-full'>UNGGAH BUKTI PEMBAYARAN</Button>
      </div>
    </div>
  );
};

export default InformasiPembayaran;
