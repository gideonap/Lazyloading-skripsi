import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { LuClock4, LuCheck, LuX } from "react-icons/lu";
import { PiCopy } from "react-icons/pi";
import { Navbar, Footer, Button } from '../../components';
import { getInvoiceReservasiById } from '../../services/invoiceService'; // Import the API service
import { getMyUserInfo } from '../../services/userService'; // Import the user API service
import { getKavlingById } from '../../services/kavlingService'; // Import kavling service
import { getSubGroundById } from '../../services/subGroundService'; // Import subGround service
import { getGroundById } from '../../services/groundService'; // Import ground service
import { getPerlengkapanById } from '../../services/perlengkapanService'; // Import perlengkapan service

const Invoice = () => {
  const { id } = useParams(); // Extract the ID from the URL
  const [invoiceData, setInvoiceData] = useState(null);
  const [userData, setUserData] = useState(null); // State to store user data
  const [reservationDetails, setReservationDetails] = useState([]); // To store fetched reservation details
  const [kavlingNames, setKavlingNames] = useState(''); // To store concatenated kavling names
  const navigate = useNavigate(); // Use navigate hook

  const handleToBeranda = () => {
    navigate('/');
  }

  const handleToRiwayatPesanan = () => {
    navigate('/profil/riwayat'); // Navigate to /profil/riwayat
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.info('Text copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'menunggu_verifikasi':
        return 'Menunggu Verifikasi';
      case 'ditolak':
         return 'Ditolak';
      case 'verifikasi':
         return 'Pembayaran Berhasil';
      case 'selesai':
         return 'Selesai';
      default:
        return 'Status Tidak Diketahui';
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'menunggu_verifikasi':
        return <LuClock4 className='text-center text-5xl text-secondary' />;
      case 'ditolak':
        return <LuX className='text-center text-5xl text-secondary' />;
      case 'verifikasi':
        return <LuCheck className='text-center text-5xl text-secondary' />;
      case 'selesai':
        return <LuCheck className='text-center text-5xl text-secondary' />;
      default:
        return <LuClock4 className='text-center text-5xl text-secondary' />; // Default to LuClock4 if unknown
    }
  };

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token
        const response = await getInvoiceReservasiById(token, id); // Fetch the invoice by ID
        setInvoiceData(response.data);

        // Fetch reservation details
        const details = await Promise.all(
          response.data.reservasi.map(async (item) => {
            if (item.kavling_id) {
              const kavlingResponse = await getKavlingById(token, item.kavling_id);
              const subGroundResponse = await getSubGroundById(token, kavlingResponse.data.sub_ground_id);
              const groundResponse = await getGroundById(token, subGroundResponse.data.ground_id);
              
              const kavlingName = `${groundResponse.data.nama}${subGroundResponse.data.nama}.${kavlingResponse.data.nama}`;
              
              return {
                name: kavlingName,
                harga: kavlingResponse.data.harga,
                jumlah: item.jumlah,
                kavlingName,
              };
            } else if (item.perlengkapan_id) {
              const perlengkapanResponse = await getPerlengkapanById(token, item.perlengkapan_id);
              return {
                name: perlengkapanResponse.data.nama,
                harga: perlengkapanResponse.data.harga,
                jumlah: item.jumlah,
              };
            }
            return null;
          })
        );
        
        setReservationDetails(details.filter(Boolean));
        const kavlingNamesList = details
          .filter((item) => item.kavlingName)
          .map((item) => item.kavlingName)
          .join(', ');
        setKavlingNames(kavlingNamesList);

      } catch (error) {
        console.error('Error fetching invoice or reservation details:', error);
      }
    };

    if (id) {
      fetchInvoiceData();
    }
  }, [id]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getMyUserInfo(token);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!invoiceData || !userData || reservationDetails.length === 0) {
    return <p>Loading invoice data...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className='flex flex-col items-center gap-5 px-10 lg:px-28'>
        <div className='flex flex-col gap-3 items-center'>
          <h2 className='font-semibold text-2xl lg:text-4xl'>{getStatusText(invoiceData.status)}</h2>
          <div className={`flex ${invoiceData.status === 'menunggu_verifikasi'
            ? 'bg-accent-wait'
            : invoiceData.status === 'ditolak'
            ? 'bg-accent-error'
            : invoiceData.status === 'verifikasi' || invoiceData.status === 'selesai'
            ? 'bg-accent-2'
            : 'bg-gray-400'
          } w-fit h-fit p-4 items-center rounded-full`}>
            {getStatusIcon(invoiceData.status)}
          </div>
          <div className='flex flex-row gap-3'>
            <h2 className='text-2xl lg:text-4xl mt-2'>{invoiceData.nomor_invoice}</h2>
            <button 
              onClick={() => handleCopy(invoiceData.nomor_invoice)}
              className='flex flex-row gap-3 items-center border-[1.5px] border-secondary px-4 py-1 rounded-full hover:bg-secondary hover:text-primary'>
              <PiCopy />
              <span>Salin</span>
            </button>
          </div>
          <div>
            {invoiceData.status === 'menunggu_verifikasi' && (
              <p className="text-center text-sm lg:text-sm">
                Pembayaran anda sedang diverifikasi maksimal 1x24 jam. Silahkan hubungi admin jika status anda tidak berubah dalam 1x24 jam.
              </p>
            )}
            {invoiceData.status === 'verifikasi' && (
              <p className="text-center text-sm lg:text-sm">
                Pembayaran telah berhasil diverifikasi! Sampai jumpa di Bumi Perkemahan Bedengan.
              </p>
            )}
            {invoiceData.status === 'ditolak' && (
              <p className="text-center text-sm lg:text-sm">
                Mohon maaf, pembayaran kamu gagal. Silahkan coba lagi
              </p>
            )}
          </div>
        </div>
        <div className='w-full bg-secondary h-[1px]' />
        <div className='flex flex-col items-start gap-3 w-full lg:w-[29rem]'>
          <div className='flex flex-col gap-1'>
            <span>Pembayaran dari:</span>
            <span className='font-semibold'>{userData.name}</span>
          </div>
          <div className='flex flex-col gap-1'>
            <span>Tanggal Pembayaran:</span>
            <span className='font-semibold'>{new Date(invoiceData.created_at).toLocaleDateString()}</span>
          </div>
          <div className='flex flex-col gap-1'>
            <span>Nomor Kavling:</span>
            <span className='font-semibold'>{kavlingNames || '-'}</span>
          </div>
        </div>
        <div className='w-full bg-secondary h-[1px]' />
        <div className='lg:w-[29rem]'>
          <div className='flex flex-col gap-8'>
            <span className='text-center text-sm lg:text-base'>Rincian Pembayaran</span>
            <div className='flex flex-col gap-7 text-sm lg:text-base'>
              {/* Display reservations */}
              {reservationDetails.map((item, index) => (
                <div key={index} className='flex flex-row w-full'>
                  <span className='min-w-44 max-w-48 lg:min-w-48 lg:max-w-48 text-left'>{item.name}</span>
                  <span className='min-w-14 max-w-14 lg:min-w-40 lg:max-w-40 text-center'>{item.jumlah}x</span>
                  <span className='min-w-28 max-w-28 lg:min-w-28 lg:max-w-28 text-right'>Rp {(item.harga*item.jumlah).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className='w-full bg-secondary h-[1px]' />
            <div className='flex flex-row justify-between items-center'>
              <span>Total Pembayaran</span>
              <span className='font-semibold text-xl lg:text-3xl'>Rp {invoiceData.jumlah.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col w-full gap-2 mt-4'>
          <Button className='w-full' onClick={handleToRiwayatPesanan}>LIHAT RIWAYAT PESANAN</Button>
          <button
            onClick={handleToBeranda} 
            className='w-full bg-primary text-sm px-7 py-3 rounded-lg hover:bg-accent shadow-md text-accent hover:text-primary 
            border-[1.5px] border-accent transition-colors duration-300'
          >
            KEMBALI KE BERANDA
          </button>
        </div>
      </div>
      <Footer className='mt-20' />
    </div>
  );
}

export default Invoice;
