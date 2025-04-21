import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import imageCompression from 'browser-image-compression';
import SidePanel from './SidePanel';
import HeaderBar from './HeaderBar';
import { Button } from '../../components';
import { toast } from 'react-toastify';
import { createPerlengkapan } from '../../services/perlengkapanService';

const AddPerlengkapan = () => {
  const [formData, setFormData] = useState({
    kodeBarang: '',
    jenisBarang: '',
    namaBarang: '',
    harga: '',
    stok: '',
    image: null,
  });

  const [compressedImage, setCompressedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const generatedKodeBarang = `P${nanoid(3).toUpperCase()}`;
    setFormData((prevData) => ({ ...prevData, kodeBarang: generatedKodeBarang }));
  }, []);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files.length > 0) {
      const imageFile = files[0];
      
      const options = {
        maxSizeMB: 1,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(imageFile, options);
        setCompressedImage(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('Terjadi kesalahan saat mengompresi gambar.');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('nama', formData.namaBarang);
    formDataToSend.append('deskripsi', JSON.stringify({ kode: formData.kodeBarang }));
    formDataToSend.append('harga', parseInt(formData.harga, 10));
    formDataToSend.append('stok', parseInt(formData.stok, 10));
    formDataToSend.append('jenis', formData.jenisBarang);

    if (compressedImage) {
      formDataToSend.append('image', compressedImage);
    }

    const token = localStorage.getItem('token');

    try {
      await createPerlengkapan(token, formDataToSend);
      toast.success('Perlengkapan berhasil ditambahkan!');
      navigate('/admin/perlengkapan');
    } catch (error) {
      console.error('Error creating perlengkapan:', error);
      toast.error('Terjadi kesalahan saat menambahkan perlengkapan');
    }
  };

  const handleCancel = () => {
    setFormData({
      kodeBarang: `P${nanoid(3).toUpperCase()}`, // Reset kodeBarang on cancel
      jenisBarang: '',
      namaBarang: '',
      harga: '',
      stok: '',
      image: null,
    });
    setCompressedImage(null); // Reset compressed image
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
                <span className='font-semibold'>Tambah Perlengkapan</span>
              </div>
              <div className='w-full bg-secondary h-[1px] mt-2' />

              <form className='flex flex-col gap-4 text-xs' onSubmit={handleSubmit} encType="multipart/form-data">
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
                    <option value="tenda_paket">tenda_paket</option>
                    <option value="tenda_non_paket">tenda_non_paket</option>
                    <option value="item_tambahan">item_tambahan</option>
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
                  <label className="font-semibold">Foto Barang</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
                    accept="image/*"
                    required
                  />
                  {compressedImage && (
                    <p className="text-xs text-green-500 mt-1">
                      Gambar terkompresi berhasil dipilih ({(compressedImage.size / 1024).toFixed(2)} KB)
                    </p>
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

export default AddPerlengkapan;
