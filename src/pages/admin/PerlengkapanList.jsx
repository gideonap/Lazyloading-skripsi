import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaTrash } from "react-icons/fa6";
import { ConfirmationModal } from '../../components';
import { deletePerlengkapanById } from '../../services/perlengkapanService';

const PerlengkapanList = ({ perlengkapan, onDeleteSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleEdit = (item) => {
    navigate('/admin/perlengkapan/update', { state: { item } });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await deletePerlengkapanById(token, id);
      alert('Perlengkapan berhasil dihapus!');
      onDeleteSuccess(id);
      closeModal();
    } catch (error) {
      console.error('Error deleting perlengkapan:', error);
      alert('Terjadi kesalahan saat menghapus perlengkapan');
    }
  };

  const parseDeskripsi = (deskripsi) => {
    try {
      return JSON.parse(deskripsi); // Parse deskripsi as JSON
    } catch (error) {
      console.error('Error parsing deskripsi:', error);
      return {}; // Return empty object if parsing fails
    }
  };

  return (
    <div className='flex flex-col gap-1'>
      {perlengkapan.map((item, index) => {
        const deskripsi = parseDeskripsi(item.deskripsi); // Parse deskripsi for each item
        return (
          <div className='flex flex-row text-xs items-center' key={item.id}>
            <span className='w-12 max-w-12'>{index + 1}</span>
            <span className='w-28 max-w-28'>{deskripsi.kode}</span> {/* Access kode from deskripsi */}
            <span className='w-44 max-w-44'>{item.nama}</span>
            <span className='w-28 max-w-28'>{item.harga}</span>
            <span className='w-28 max-w-28'>{item.stok}</span>
            <span className='w-28 max-w-28 text-center'>
              <span className={`w-fit px-4 py-1 rounded-full ${item.jenis === 'tenda_paket' ? 'bg-accent-2' : 'bg-accent-3'}`}>
                {item.jenis} {/* Access jenis from deskripsi */}
              </span>
            </span>

            {/* Action Buttons */}
            <span className='w-28 max-w-28 text-center flex items-center justify-center gap-1'>
              <button
                className='flex items-center justify-center w-6 h-6 bg-selesai text-white rounded'
                onClick={() => handleEdit(item)}
              >
                <FaPen />
              </button>
              <button
                className='flex items-center justify-center w-6 h-6 bg-ditolak text-white rounded'
                onClick={() => openDeleteModal(item)}
              >
                <FaTrash />
              </button>
            </span>
          </div>
        );
      })}

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal
          title="Delete Item"
          message={`Apakah anda yakin untuk menghapus ${selectedItem?.nama}?`}
          onConfirm={() => handleDelete(selectedItem.id)}
          onClose={closeModal}
          type='hapus'
        />
      )}
    </div>
  );
};

export default PerlengkapanList;
