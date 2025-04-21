import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidePanel from './SidePanel';
import HeaderBar from './HeaderBar';
import { Button, ConfirmationModal } from '../../components'; 
import { updateKavlingById } from '../../services/kavlingService'; // Import the service

const UpdateKavling = () => {
    const { state } = useLocation();
    const { kavling } = state || {};
    const [price, setPrice] = useState(kavling?.harga || '');
    const [customKavlingNumber, setCustomKavlingNumber] = useState(kavling?.nomorKavling || '');
    const [isAvailable, setIsAvailable] = useState(kavling?.isAvailable || true);
    const [row, setRow] = useState(kavling?.baris || 0);
    const [column, setColumn] = useState(kavling?.kolom || 0);
    const [subGroundId, setSubGroundId] = useState(kavling?.sub_ground_id || ""); // Ensure sub ground ID is included
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    const handleCancel = () => {
        navigate('/admin/perlengkapan/kavling');
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = async () => {
        if (price && customKavlingNumber.trim()) {
            const updatedKavling = {
                baris: row,
                harga: price,
                kolom: column,
                nama: customKavlingNumber,
                sub_ground_id: subGroundId,
            };
    
            console.log('Payload:', updatedKavling); // Log the payload to check its structure
    
            try {
                await updateKavlingById(token, kavling.id, updatedKavling);
                console.log('Kavling updated successfully:', updatedKavling);
                closeModal();
                navigate('/admin/perlengkapan/kavling'); 
            } catch (error) {
                console.error('Error updating kavling:', error); // Log detailed error
                alert('Terjadi kesalahan saat memperbarui kavling.');
            }
        } else {
            alert('Harga kavling dan nomor kavling tidak boleh kosong.');
        }
    };
  

    return (
      <div className='w-screen h-screen p-10'>
        <div className='flex flex-row gap-10 h-full'>
          <SidePanel />
          <div className='flex flex-col py-3 w-full gap-8'>
            <HeaderBar title='Perlengkapan' searchTerm='' onSearchChange={() => {}} username='Admin' />
            <div className='flex flex-col gap-10'>
              <div className='flex flex-col gap-3'>
                <div className='flex flex-row w-full justify-between items-center'>
                  <span className='font-semibold'>Ubah Kavling</span>
                </div>
                <div className='w-full bg-secondary h-[1px] mt-2' />
                <form className='flex flex-col gap-4 text-xs'>
                  <div className='flex flex-col gap-2'>
                    <span>Ground</span>
                    <input
                      type="text"
                      value={kavling?.ground}
                      readOnly
                      className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm bg-gray-100'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span>Nomor Ground</span>
                    <input
                      type="text"
                      value={kavling?.nomorGround}
                      readOnly
                      className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm bg-gray-100'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span>Nomor Kavling</span>
                    <input
                      type="text"
                      placeholder="Nomor Kavling"
                      value={customKavlingNumber}
                      onChange={(e) => setCustomKavlingNumber(e.target.value)}
                      className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span>Harga Kavling</span>
                    <input
                      type="number"
                      placeholder="Harga Kavling"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span>Baris (Row)</span>
                    <input
                      type="number"
                      placeholder="Baris"
                      value={row}
                      onChange={(e) => setRow(parseInt(e.target.value, 10))}
                      className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span>Kolom (Column)</span>
                    <input
                      type="number"
                      placeholder="Kolom"
                      value={column}
                      onChange={(e) => setColumn(parseInt(e.target.value, 10))}
                      className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span>Status</span>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={isAvailable}
                        onChange={() => setIsAvailable(!isAvailable)}
                        className='sr-only peer'
                      />
                      <div className={`w-9 h-5 border-[2px] rounded-full transition-colors duration-300 ${isAvailable ? 'bg-accent border-accent' : 'bg-white border-gray-300'}`}>
                        <div className={`absolute top-1 left-1 h-3 w-3 rounded-full transition-transform duration-300 ${isAvailable ? 'translate-x-[1rem] bg-white' : 'translate-x-0 bg-gray-300'}`} />
                      </div>
                    </label>
                  </div>
                  <div className='flex justify-end gap-3 mt-4'>
                    <Button onClick={handleCancel} className='border-[1.5px] border-red-600 bg-primary text-red-600 hover:bg-red-600 hover:text-primary'>Batal</Button>
                    <Button onClick={openModal} className='bg-accent text-primary hover:bg-hover-green'>Simpan Perubahan</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {isModalOpen && (
          <ConfirmationModal
            message="Apakah anda yakin ingin menyimpan perubahan ini?"
            onConfirm={handleSave} // Execute save logic when user confirms
            onClose={closeModal}
            type='simpan'
          />
        )}
      </div>
    );
  };
  
  export default UpdateKavling;
