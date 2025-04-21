import React, { useState } from 'react';
import Button from './Button';

const KavlingModal = ({ ground, groundNumber, onClose, onSave }) => {
  const [price, setPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [row, setRow] = useState(0); // Baris (Row)
  const [column, setColumn] = useState(0); // Kolom (Column)
  const [kavlingName, setKavlingName] = useState(''); // Nama (Kavling name)

  const handleSave = () => {
    const parsedPrice = parseInt(price, 10); // Ensure price is an integer

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Harga kavling harus berupa angka yang valid.');
      return;
    }

    if (kavlingName.trim()) {
      onSave({
        baris: row, // Baris (Row)
        kolom: column, // Kolom (Column)
        harga: parsedPrice, // Ensure the price is an integer
        nama: kavlingName, // Kavling name
        sub_ground_id: groundNumber, // Sub-ground ID
        status: isAvailable ? 'Available' : 'Unavailable', // Status (availability)
      });
    } else {
      alert('Nama kavling tidak boleh kosong.');
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-md'>
        <h2 className='text-lg font-semibold mb-4'>Tambah Kavling</h2>
        <div className='flex flex-col gap-5 w-96'>
          <div className='flex flex-col gap-1 text-sm'>
            <span>Ground: {ground}</span>
            <span>Nomor Ground: {groundNumber}</span>
          </div>
          <div className='flex flex-col gap-2'>
            <span>Nama Kavling</span>
            <input
              type="text"
              placeholder="Nama Kavling"
              value={kavlingName}
              onChange={(e) => setKavlingName(e.target.value)}
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
            <span>Status</span>
            {/* Toggle Switch for Status */}
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
        </div>
        <div className='flex justify-end gap-3 mt-4'>
          <Button onClick={onClose} className='border-[1.5px] border-red-600 bg-primary text-red-600 hover:bg-red-600 hover:text-primary'>Batal</Button>
          <Button onClick={handleSave} className='bg-accent text-primary hover:bg-hover-green'>Simpan Perubahan</Button>
        </div>
      </div>
    </div>
  );
};

export default KavlingModal;
