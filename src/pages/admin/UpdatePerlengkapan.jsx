import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidePanel from './SidePanel';
import HeaderBar from './HeaderBar';
import { Button } from '../../components';
import { updatePerlengkapanById } from '../../services/perlengkapanService';
import imageCompression from 'browser-image-compression'; // Import for image compression

const UpdatePerlengkapan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};

  const [formData, setFormData] = useState({
    kodeBarang: '',
    jenisBarang: '',
    namaBarang: '',
    harga: '',
    stok: '',
    image: null, // New field for image
  });

  const [imagePreview, setImagePreview] = useState(null); // For showing image preview

  useEffect(() => {
    if (item) {
      const deskripsi = JSON.parse(item.deskripsi || '{}'); // Parse deskripsi as JSON
      setFormData({
        kodeBarang: deskripsi.kode || '',
        jenisBarang: item.jenis || '', // Ensure jenis is properly set from item
        namaBarang: item.nama,
        harga: item.harga,
        stok: item.stok,
        image: null, // Reset image to null
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress the image to 1MB
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      try {
        const compressedImage = await imageCompression(file, options);
        setFormData({ ...formData, image: compressedImage });

        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('Terjadi kesalahan saat mengunggah gambar');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = new FormData(); // Use FormData to send the image and other fields
    updatedData.append('nama', formData.namaBarang);
    updatedData.append(
      'deskripsi',
      JSON.stringify({
        kode: formData.kodeBarang,
      })
    );
    updatedData.append('jenis', formData.jenisBarang);
    updatedData.append('harga', parseInt(formData.harga, 10));
    updatedData.append('stok', parseInt(formData.stok, 10));

    if (formData.image) {
      updatedData.append('image', formData.image);
    }

    try {
      const token = localStorage.getItem('token');
      await updatePerlengkapanById(token, item.id, updatedData);
      alert('Perlengkapan berhasil diupdate!');
      navigate('/admin/perlengkapan');
    } catch (error) {
      console.error('Error updating perlengkapan:', error);
      alert('Terjadi kesalahan saat mengupdate perlengkapan');
    }
  };

  const handleCancel = () => {
    navigate('/admin/perlengkapan');
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
                <span className='font-semibold'>Update Perlengkapan</span>
              </div>
              <div className='w-full bg-secondary h-[1px] mt-2' />

              <form className='flex flex-col gap-4 text-xs' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-2'>
                  <label className="font-semibold">Kode Barang</label>
                  <input
                    type="text"
                    name="kodeBarang"
                    value={formData.kodeBarang}
                    onChange={handleChange}
                    className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
                    readOnly
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label className="font-semibold">Jenis Barang</label>
                  <select
                    name="jenisBarang"
                    value={formData.jenisBarang}
                    onChange={handleChange}
                    className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
                    required
                  >
                    <option value="">Pilih Jenis Barang</option>
                    <option value="tenda_paket">Tenda Paket</option>
                    <option value="tenda_non_paket">Tenda Non Paket</option>
                    <option value="item_tambahan">Item Tambahan</option>
                  </select>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className="font-semibold">Nama Barang</label>
                  <input
                    type="text"
                    name="namaBarang"
                    value={formData.namaBarang}
                    onChange={handleChange}
                    className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
                    required
                  />
                </div>

                <div className='flex flex-row w-full gap-4'>
                  <div className='flex flex-col gap-2 w-full'>
                    <label className="font-semibold">Harga</label>
                    <input
                      type="number"
                      name="harga"
                      value={formData.harga}
                      onChange={handleChange}
                      className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
                      required
                    />
                  </div>

                  <div className='flex flex-col gap-2 w-full'>
                    <label className="font-semibold">Stok</label>
                    <input
                      type="number"
                      name="stok"
                      value={formData.stok}
                      onChange={handleChange}
                      className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className="font-semibold">Unggah Gambar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
                  )}
                </div>

                <div className='flex flex-row gap-3 w-full justify-end'>
                  <Button type="button" onClick={handleCancel} className='border-[1.5px] border-red-600 bg-primary text-red-600 hover:bg-red-600 hover:text-primary'>
                    Batal
                  </Button>
                  <Button type="submit" className='bg-accent text-primary hover:bg-hover-green'>
                    Simpan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePerlengkapan;
