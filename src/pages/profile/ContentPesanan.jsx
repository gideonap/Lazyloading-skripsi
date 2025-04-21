import React, { useEffect, useState } from 'react';
import { PesananCard } from '../../components';
import { getAllInvoiceReservasi } from '../../services/invoiceService';

const ContentPesanan = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getAllInvoiceReservasi(token);
        const invoices = response.data;

        const filteredInvoices = invoices.filter(invoice => 
          ['menunggu_verifikasi', 'menunggu_pembayaran', 'verifikasi'].includes(invoice.status)
        );
        
        const formattedOrders = filteredInvoices.map((invoice) => ({
          kodePesanan: invoice.nomor_invoice,
          reservasi: invoice.reservasi,
          tanggalKedatangan: new Date(invoice.tanggal_kedatangan).toLocaleDateString('id-ID'),
          status: invoice.status,
          id: invoice.id,
        }));

        setOrders(formattedOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className='flex flex-col gap-5 w-full items-center lg:items-start'>
      <h2 className='font-semibold'>Pesanan</h2>
      <div className='flex flex-col gap-7 lg:gap-5 w-full'>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <PesananCard
              key={index}
              kodePesanan={order.kodePesanan}
              reservasi={order.reservasi}
              tanggalKedatangan={order.tanggalKedatangan}
              status={order.status}
              id={order.id}
            />
          ))
        ) : (
          <p>Tidak ada pesanan ditemukan.</p>
        )}
      </div>
    </div>
  );
};

export default ContentPesanan;
