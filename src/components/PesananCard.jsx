import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKavlingById } from '../services/kavlingService';
import { getSubGroundById } from '../services/subGroundService';
import { getGroundById } from '../services/groundService';

const PesananCard = ({ kodePesanan, reservasi = [], tanggalKedatangan, status, id }) => {  // Default to empty array for reservasi
  const navigate = useNavigate();
  const [kavlingNames, setKavlingNames] = useState(''); // To store concatenated kavling names

  const getStatusColor = (status) => {
    switch (status) {
      case 'verifikasi':
        return 'bg-accent';
      case 'menunggu_pembayaran':
        return 'bg-orange-500';
      case 'menunggu_verifikasi':
        return 'bg-orange-500';
      case 'selesai':
        return 'bg-accent';
      case 'ditolak':
        return 'bg-red-500';
      default:
        return 'bg-inactive-gray-2';
    }
  };

  const getDisplayStatus = (status) => {
    switch (status) {
      case 'verifikasi':
        return 'BERHASIL';
      case 'menunggu_pembayaran':
        return 'MENUNGGU PEMBAYARAN';
      case 'menunggu_verifikasi':
        return 'MENUNGGU VERIFIKASI';
      case 'selesai':
        return 'SELESAI';
      case 'ditolak':
        return 'PEMBAYARAN GAGAL';
      default:
        return 'Status Tidak Diketahui';
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case 'verifikasi':
      case 'menunggu_verifikasi':
      case 'selesai':
        return 'Lihat Detail Pesanan';
      case 'menunggu_pembayaran':
        return 'Lanjutkan Pembayaran';
      default:
        return null;
    }
  };

  const handleButtonClick = () => {
    if (status === 'verifikasi' || status === 'menunggu_verifikasi' || status === 'selesai') {
      navigate(`/invoice/${id}`);
    } else if (status === 'menunggu_pembayaran') {
      navigate(`/pembayaran/${id}`);
    }
  };

  // Fetch all kavling data for the reservations
  useEffect(() => {
    const fetchKavlingData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (reservasi && reservasi.length > 0) {
          const kavlingNamesList = await Promise.all(
            reservasi.map(async (item) => {
              if (item.kavling_id) {
                const kavlingResponse = await getKavlingById(token, item.kavling_id);
                const subGroundResponse = await getSubGroundById(token, kavlingResponse.data.sub_ground_id);
                const groundResponse = await getGroundById(token, subGroundResponse.data.ground_id);
                return `${groundResponse.data.nama}${subGroundResponse.data.nama}.${kavlingResponse.data.nama}`;
              }
              return null;
            })
          );
          setKavlingNames(kavlingNamesList.filter(Boolean).join(', ')); // Concatenate kavling names and ignore nulls
        }
      } catch (error) {
        console.error('Error fetching kavling data:', error);
      }
    };

    if (reservasi && reservasi.length > 0) {
      fetchKavlingData();
    }
  }, [reservasi]);

  const displayStatus = getDisplayStatus(status);
  const buttonText = getButtonText(status);

  return (
    <div className='flex flex-col gap-3 px-4 py-4 w-full rounded-md border-[1.5px] border-inactive-gray-2'>
      <p className={`lg:hidden w-fit px-3 py-1 rounded-full ${getStatusColor(status)} text-xs text-primary`}>{displayStatus}</p>
      <p className='text-sm'>Kode Pesanan: {kodePesanan}</p>
      <div className='flex flex-col gap-2'>
        <p className='font-semibold text-sm lg:'>Nomor Kavling: {kavlingNames || 'N/A'}</p>
        <p className='font-semibold text-sm'>Tanggal Kedatangan: {tanggalKedatangan}</p>
        <div className='flex lg:flex-row justify-between items-center'>
          <p className={`hidden lg:block px-3 py-1 rounded-full ${getStatusColor(status)} text-xs text-primary`}>{displayStatus}</p>
          {buttonText && (
            <button
              className='bg-accent text-sm text-primary px-7 py-3 rounded-lg w-full lg:w-fit hover:bg-hover-green shadow-md
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-300'
              onClick={handleButtonClick}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PesananCard;
