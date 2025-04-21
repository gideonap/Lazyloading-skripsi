import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaXmark, FaCheck } from "react-icons/fa6";
import { DetailModal } from '../../components';
import { toast } from 'react-toastify';
import { rejectInvoiceReservasi, verifyInvoiceReservasi } from '../../services/invoiceService';

const ReservasionActionList = ({ reservations }) => {
  const [selectedReservation, setSelectedReservation] = useState(null); // Store selected reservation details
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const navigate = useNavigate();

  const openModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const openImageModal = (imageUrl, title) => {
    setSelectedImage(imageUrl);
    setModalTitle(title);
    setIsImageModalOpen(true);
  };
  
  const closeImageModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setIsModalOpen(false);
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await verifyInvoiceReservasi(token, id);
      if (response?.message === 'success') {
        toast.success('Reservation approved successfully');
      } else {
        toast.error('Failed to approve reservation');
      }
    } catch (error) {
      toast.error('Failed to approve reservation');
      console.error('Error approving reservation:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await rejectInvoiceReservasi(token, id);
      if (response?.message === 'success') {
        toast.success('Reservation rejected successfully');
      } else {
        toast.error('Failed to reject reservation');
      }
    } catch (error) {
      toast.error('Failed to reject reservation');
      console.error('Error rejecting reservation:', error);
    }
  };

  const openDetailPage = (reservation) => {
    if (reservation.jenisPengunjung === 'individu') {
      navigate('/admin/reservasi/online/detail', { state: { reservation } });
    } else if (reservation.jenisPengunjung === 'kelompok') {
      navigate('/admin/reservasi/online/detail-kelompok', { state: { reservation } });
    }
    console.log(`Open detail for reservation with ID: ${reservation.id}`);
  };

  const formatStatus = (status) => {
    if (status === 'menunggu_pembayaran') {
      return 'Pembayaran';
    } else if (status === 'menunggu_verifikasi') {
      return 'Verifikasi';
    } else if (status === 'verifikasi') {
      return 'Berlangsung';
    }
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className='flex flex-col gap-1'>
      {reservations.map((reservation, index) => (
        <div className='flex flex-row text-xs items-center' key={reservation.id}>
          <span className='w-12 max-w-12'>{index + 1}</span>
          <span className='w-28 max-w-28'>{reservation.kode}</span>
          <span className='w-44 max-w-44'>{reservation.nama}</span>
          <span className='w-28 max-w-28'>{reservation.tglMasuk}</span>
          <span className='w-28 max-w-28'>{reservation.tglKeluar}</span>

          {/* NIK & Alamat Button */}
          <span className='flex items-center justify-center w-10 max-w-10 text-center'>
            <button
              className='flex items-center justify-center w-6 h-6 bg-berlangsung text-white rounded'
              onClick={() => openModal(reservation)}
            >
              <MdOutlineRemoveRedEye />
            </button>
          </span>

          {/* Total Price */}
          <span className='w-28 max-w-28 text-center'>
            Rp {reservation.total}
          </span>

          {/* Bukti Button */}
          <span className='flex items-center justify-center w-10 max-w-10 text-center'>
            <button
              className='flex items-center justify-center w-6 h-6 bg-berlangsung text-white rounded'
              onClick={() => openImageModal(reservation.buktiImage, 'Bukti Pembayaran')}
            >
              <MdOutlineRemoveRedEye />
            </button>
          </span>

          {/* Status */}
          <span className='flex flex-row items-center justify-center gap-4 w-32 max-w-32'>
            <div
              className={`w-2 h-2 rounded-full ${
                reservation.status === 'ditolak'
                  ? 'bg-ditolak'
                  : reservation.status === 'verifikasi'
                  ? 'bg-berlangsung'
                  : reservation.status === 'Selesai'
                  ? 'bg-selesai'
                  : 'bg-menunggu'
              }`}
            />
            {formatStatus(reservation.status)}
          </span>

          {/* Action Buttons */}
          <span className='w-28 max-w-28 text-center flex items-center justify-center gap-1'>
            <button
              className='flex items-center justify-center w-6 h-6 bg-berlangsung text-white rounded'
              onClick={() => openDetailPage(reservation)}
            >
              <MdOutlineRemoveRedEye />
            </button>
            <button
              className='flex items-center justify-center w-6 h-6 bg-selesai text-white rounded'
              onClick={() => handleApprove(reservation.id)}
            >
              <FaCheck />
            </button>
            <button
              className='flex items-center justify-center w-6 h-6 bg-ditolak text-white rounded'
              onClick={() => handleReject(reservation.id)}
            >
              <FaXmark />
            </button>
          </span>
        </div>
      ))}

      {/* Image Modal */}
      <DetailModal
        isOpen={isImageModalOpen}
        imageUrl={selectedImage}
        title={modalTitle}
        onClose={closeImageModal}
      />
      {/* Modal for NIK & Alamat */}
      {isModalOpen && selectedReservation && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
        <div className='flex flex-col bg-white p-5 rounded gap-4 w-96'>
          <span className='font-semibold text-lg'>Data Diri</span>
          <div className='flex flex-col gap-2'>
            <p>
              <strong>NIK:</strong> {selectedReservation?.nik || 'N/A'}
            </p>
            <p>
              <strong>Alamat:</strong> {selectedReservation?.alamat || 'N/A'}
            </p>
          </div>
          <div className='flex justify-end'>
            <button
              className='mt-4 px-4 py-2 bg-accent hover:bg-hover-green text-white rounded shadow-md'
              onClick={closeModal}
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ReservasionActionList;
