import React, { useState } from 'react';
import Button from './Button';
import imageCompression from 'browser-image-compression'; // Import the image compression library

const GroundModal = ({ onClose, onSave }) => {
  const [groundName, setGroundName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image
  const [compressedImage, setCompressedImage] = useState(null); // State to store the compressed image

  // Function to handle image selection and compression
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 1, // Set the max size to 1MB
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        setSelectedImage(file);
        setCompressedImage(compressedFile); // Set the compressed image
      } catch (error) {
        console.error('Error compressing the image:', error);
      }
    }
  };

  // Function to save ground with name and image
  const handleSave = () => {
    if (!groundName.trim()) {
      alert('Nama ground tidak boleh kosong.');
    } else if (!compressedImage) {
      alert('Mohon unggah gambar untuk ground.');
    } else {
      // Pass both the ground name and compressed image back to the parent component
      onSave({ groundName, image: compressedImage });
      
      // Success alert
      alert('Ground berhasil ditambahkan!');
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-md'>
        <h2 className='text-lg font-semibold mb-4'>Tambah Ground</h2>
        <div className='flex flex-col gap-3 w-96'>
          <label>Nama Ground</label>
          <input
            type="text"
            placeholder="Input nama ground A/B/C/..."
            value={groundName}
            onChange={(e) => setGroundName(e.target.value)}
            className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm'
          />

          <label>Unggah Gambar Ground</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
          />
          {selectedImage && (
            <p className="text-xs text-green-600 mt-2">File dipilih: {selectedImage.name}</p>
          )}
        </div>
        <div className='flex justify-end gap-3 mt-4'>
          <Button onClick={onClose} className='border-[1.5px] border-red-600 bg-primary text-red-600 hover:bg-red-600 hover:text-primary'>
            Batal
          </Button>
          <Button onClick={handleSave} className='bg-accent text-primary hover:bg-hover-green'>
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroundModal;
