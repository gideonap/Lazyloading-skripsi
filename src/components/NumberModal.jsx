import React, { useState } from 'react';
import Button from './Button';

const NumberModal = ({ selectedGround, onClose, onSave }) => {
  const [numberName, setNumberName] = useState('');

  const handleSave = async () => {
    if (numberName.trim()) {
      try {
        await onSave(numberName); // Pass the numberName back to the parent component
        alert('Nomor ground berhasil dibuat!'); // Show success alert
      } catch (error) {
        console.error('Error creating sub-ground:', error);
        alert('Terjadi kesalahan saat membuat nomor ground.');
      }
    } else {
      alert('Nomor ground tidak boleh kosong.');
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-md'>
        <h2 className='text-lg font-semibold mb-4'>Tambah Nomor Ground</h2>
        <div className='flex flex-col gap-5 w-96'>
            <div className='flex flex-col gap-2'>
              <span>Nama Ground</span>
              <input
                  type="text"
                  placeholder="Nomor Ground"
                  value={selectedGround}
                  readOnly
                  className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <span>Nomor Ground</span>
              <input
                  type="text"
                  placeholder="Nomor Ground 1, 2, 3, ..."
                  value={numberName}
                  onChange={(e) => setNumberName(e.target.value)}
                  className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm'
              />
            </div>
        </div>
        <div className='flex justify-end gap-3 mt-4'>
          <Button onClick={onClose} className='border-[1.5px] border-red-600 bg-primary text-red-600 hover:bg-red-600 hover:text-primary'>Batal</Button>
          <Button onClick={handleSave} className='bg-accent text-primary hover:bg-hover-green'>Simpan Perubahan</Button>
        </div>
      </div>
    </div>
  );
};

export default NumberModal;
