import React, { useState, useEffect } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../../components';
import { getKavlingById } from '../../services/kavlingService';
import { getSubGroundById } from '../../services/subGroundService';
import { getGroundById } from '../../services/groundService';
import { deleteInvoiceReservasiById } from '../../services/invoiceService';
import { toast } from 'react-toastify';

const OffReservationActionList = ({ reservations }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [kavlingNamesList, setKavlingNamesList] = useState({});

  const navigate = useNavigate();

  const openDeleteModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setSelectedReservation(null);
    setIsDeleteModalOpen(false);
  };

  const handleEdit = (reservation) => {
    navigate('/admin/reservasi/offline/update', { state: { reservation } });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await deleteInvoiceReservasiById(token, id);
      if (response?.message === 'success') {
        toast.success('Reservasi berhasil dihapus');
      } else {
        toast.error('Gagal menghapus reservasi');
      }
    } catch (error) {
      toast.error('Gagal menghapus reservasi');
      console.error('Error approving reservation:', error);
    }
    console.log(`Delete reservation with ID: ${id}`);
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

  useEffect(() => {
    const fetchKavlingData = async () => {
      try {
        const token = localStorage.getItem('token');
        const fetchedNames = {};

        await Promise.all(
          reservations.map(async (reservation) => {
            // Extract kavling IDs and fetch their names
            const kavlingNames = await Promise.all(
              reservation.kavlingDetails
                .split(', ') // Assume kavlingDetails is a string of IDs, separated by commas
                .filter(kavlingId => kavlingId) // Filter out invalid or empty kavlingIds
                .map(async (kavlingId) => {
                  try {
                    // Step 1: Fetch kavling details by ID
                    const kavlingResponse = await getKavlingById(token, kavlingId);
                    const kavlingData = kavlingResponse.data;

                    // Step 2: Fetch sub-ground details using sub_ground_id
                    const subGroundResponse = await getSubGroundById(token, kavlingData.sub_ground_id);
                    const subGroundData = subGroundResponse.data;

                    // Step 3: Fetch ground details using ground_id
                    const groundResponse = await getGroundById(token, subGroundData.ground_id);
                    const groundData = groundResponse.data;

                    // Construct the full kavling name as {groundName}{subGroundName}.{kavlingName}
                    return `${groundData.nama}${subGroundData.nama}.${kavlingData.nama}`;
                  } catch (error) {
                    console.error(`Error fetching data for kavling_id ${kavlingId}:`, error);
                    return 'Error'; // Return error if fetching fails
                  }
                })
            );
            // Join all valid kavling names with commas and store them for this reservation
            fetchedNames[reservation.id] = kavlingNames.filter(name => name !== 'Error').join(', ');
          })
        );

        setKavlingNamesList(fetchedNames); // Store the fetched kavling names
      } catch (error) {
        console.error('Error fetching kavling data:', error);
      }
    };

    if (reservations.length > 0) {
      fetchKavlingData();
    }
  }, [reservations]);

  return (
    <div className='flex flex-col gap-1'>
      {reservations.map((reservation, index) => {
        const { kode, nama, tglKeluar, tglMasuk, status, jenisPembayaran } = reservation;

        // Get the kavling name from the fetched kavlingNamesList
        const kavlingName = kavlingNamesList[reservation.id] || 'Loading...';

        return (
          <div className='flex flex-row text-xs items-center' key={reservation.id}>
            <span className='w-12 max-w-12'>{index + 1}</span>
            <span className='w-28 max-w-28'>{kode}</span>
            <span className='w-44 max-w-44'>{nama || 'Unknown'}</span>
            <span className='w-28 max-w-28'>{new Date(tglMasuk).toLocaleDateString()}</span>
            <span className='w-28 max-w-28'>{new Date(tglKeluar).toLocaleDateString()}</span>
            {/* Display the kavling name */}
            <span className='w-14 max-w-14 text-center'>{kavlingName}</span>
            <span className='flex items-center justify-center w-32 max-w-32'>
              <span className={`w-fit px-2 py-1 rounded-full ${jenisPembayaran === 'cash' ? 'bg-selesai' : 'bg-berlangsung'}`}>
                {jenisPembayaran || 'N/A'}
              </span>
            </span>
            <span className='flex flex-row items-center justify-center gap-4 w-32 max-w-32'>
              <div
                className={`w-2 h-2 rounded-full ${
                  status === 'ditolak'
                    ? 'bg-ditolak'
                    : status === 'verifikasi'
                    ? 'bg-berlangsung'
                    : status === 'selesai'
                    ? 'bg-selesai'
                    : 'bg-menunggu'
                }`}
              />
              {formatStatus(status)}
            </span>
            <span className='w-28 max-w-28 text-center flex items-center justify-center gap-1'>
              <button
                className='flex items-center justify-center w-6 h-6 bg-selesai text-white rounded'
                onClick={() => handleEdit(reservation)}
              >
                <FaPen />
              </button>
              <button
                className='flex items-center justify-center w-6 h-6 bg-ditolak text-white rounded'
                onClick={() => openDeleteModal(reservation)}
              >
                <FaTrash />
              </button>
            </span>
          </div>
        );
      })}

      {isDeleteModalOpen && (
        <ConfirmationModal
          title="Delete Reservation"
          message={`Apakah anda yakin untuk menghapus reservasi dengan kode ${selectedReservation?.nomor_invoice}?`}
          onConfirm={() => handleDelete(selectedReservation.id)}
          onClose={closeModals}
          type='hapus'
        />
      )}
    </div>
  );
};

export default OffReservationActionList;
