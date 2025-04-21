import React, { useState, useEffect } from 'react';
import SidePanel from './SidePanel';
import HeaderBar from './HeaderBar';
import ReservasionActionList from './ReservasionActionList';
import { getAllInvoiceReservasiAdmin } from '../../services/invoiceService'; // Import the API function

const ReservasiOnline = () => {
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
        console.log("API Response:", response);
    
        if (response?.data?.invoices) {
          // Filter for online reservations and map the fields correctly
          const onlineReservations = response.data.invoices
            .filter(invoice => invoice.tipe === 'online')
            .map(invoice => {
              const { nomor_invoice, keterangan, tanggal_kedatangan, tanggal_kepulangan, status, link_pembayaran, link_perizinan, jumlah, created_at } = invoice;
              const parsedKeterangan = JSON.parse(keterangan);
    
              return {
                id: invoice.id,
                kode: nomor_invoice,
                nama: parsedKeterangan.nama,
                jenisPengunjung: invoice.jenis_pengunjung,
                telepon: parsedKeterangan.telepon,
                jumlah: parsedKeterangan.jumlah_pengunjung,
                total: invoice.jumlah,
                tglMasuk: new Date(tanggal_kedatangan).toLocaleDateString(),
                tglKeluar: new Date(tanggal_kepulangan).toLocaleDateString(),
                nik: parsedKeterangan.nik,
                alamat: parsedKeterangan.alamat,
                buktiImage: link_pembayaran,
                perizinanImage: link_perizinan,
                totalPrice: `Rp ${invoice.total}`,
                totalHarga: invoice.total,
                status: status,
                createdAt: new Date(created_at)
              };
            })
            .sort((a, b) => b.createdAt - a.createdAt);
    
          setReservations(onlineReservations);
          console.log("Parsed Reservations:", onlineReservations); // Check the parsed data
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
        <SidePanel />
        <div className='flex flex-col py-3 w-full gap-8'>
          <HeaderBar title='Reservasi' searchTerm='' onSearchChange={() => {}} username='Admin'/>
          
          <div className='flex flex-col gap-10'>
            <div className='flex flex-col gap-3'>
              <span className='font-semibold'>Reservasi Online</span>
              <div className='w-full bg-secondary h-[1px] mt-2'/>
              <div className='flex flex-col px-2 text-xs gap-1'>
                <div className='flex flex-row font-semibold'>
                  <span className='w-12 max-w-12'>No</span>
                  <span className='w-28 max-w-28'>Kode Reservasi</span>
                  <span className='w-44 max-w-44'>Nama</span>
                  <span className='w-28 max-w-28'>Tgl Masuk</span>
                  <span className='w-28 max-w-28'>Tgl Keluar</span>
                  <span className='w-10 max-w-10 text-center'>KTP</span>
                  <span className='w-28 max-w-28 text-center'>Total</span>
                  <span className='w-10 max-w-10 text-center'>Bukti</span>
                  <span className='w-32 max-w-32 text-center'>Status</span>
                  <span className='w-28 max-w-28 text-center'>Aksi</span>
                </div>
                <div>
                  <ReservasionActionList reservations={reservations} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservasiOnline;
