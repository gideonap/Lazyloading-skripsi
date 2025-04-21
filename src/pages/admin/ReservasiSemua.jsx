import React, { useState, useEffect } from 'react';
import SidePanel from './SidePanel';
import HeaderBar from './HeaderBar';
import ReservasionList from './ReservasionList';
import { getAllInvoiceReservasiAdmin } from '../../services/invoiceService';

const ReservasiSemua = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found.');
          return;
        }

        const response = await getAllInvoiceReservasiAdmin(token);
        if (response?.data?.invoices) {
          const parsedReservations = response.data.invoices.map(invoice => {
            const { nomor_invoice, keterangan, tanggal_kedatangan, tanggal_kepulangan, reservasi, status, tipe } = invoice;
            const parsedKeterangan = JSON.parse(keterangan);

            // Extract kavlingDetails for each reservasi
            const kavlingDetails = reservasi.map(r => r.kavling ? r.kavling : 'N/A');

            return {
              id: invoice.id,
              kode: nomor_invoice,
              nama: parsedKeterangan.nama,
              tglMasuk: new Date(tanggal_kedatangan).toLocaleDateString(),
              tglKeluar: new Date(tanggal_kepulangan).toLocaleDateString(),
              kavlingDetails: kavlingDetails.length > 0 ? kavlingDetails : ['N/A'],  // Pass the full kavling details
              jenis: tipe,
              status: status
            };
          });

          setReservations(parsedReservations);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-screen h-screen p-10'>
      <div className='flex flex-row gap-10 h-full'>
        <SidePanel/>
        <div className='flex flex-col py-3 w-full gap-8'>
          <HeaderBar title='Reservasi' searchTerm='' onSearchChange={() => {}} username='Admin'/>
          
          <div className='flex flex-col gap-10'>
            <div className='flex flex-col gap-3'>
              <span className='font-semibold'>Semua Reservasi</span>
              <div className='w-full bg-secondary h-[1px] mt-2'/>
              <div className='flex flex-col px-2 text-sm gap-1'>
                <div className='flex flex-row font-semibold'>
                  <span className='w-14 max-w-14'>No</span>
                  <span className='w-32 max-w-32'>Kode Reservasi</span>
                  <span className='w-56 max-w-56'>Nama</span>
                  <span className='w-28 max-w-28'>Tgl Masuk</span>
                  <span className='w-28 max-w-28'>Tgl Keluar</span>
                  <span className='w-20 max-w-20'>Kavling</span>
                  <span className='w-32 max-w-32'>Jenis Reservasi</span>
                  <span className='w-32 max-w-32'>Status</span>
                </div>
                <div>
                  <ReservasionList reservations={reservations} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservasiSemua;
