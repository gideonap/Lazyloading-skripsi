import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import imageCompression from 'browser-image-compression';
import { updateInvoiceReservasiFiles } from '../../services/invoiceService'; // Import the API function
import { toast } from 'react-toastify';

const UnggahBuktiPembayaranKelompok = ({ invoiceId }) => {
  const [selectedSuratFile, setSelectedSuratFile] = useState(null);
  const [selectedBuktiFile, setSelectedBuktiFile] = useState(null);
  const [compressedSuratFile, setCompressedSuratFile] = useState(null);
  const [compressedBuktiFile, setCompressedBuktiFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Function to handle file compression and selection
  const handleFileUpload = async (event, setFile, setCompressedFile) => {
    const file = event.target.files[0];

    if (file) {
      const options = {
        maxSizeMB: 1,
        useWebWorker: true,
      };

      try {
        const compressedImage = await imageCompression(file, options);
        setFile(file);
        setCompressedFile(compressedImage);
      } catch (error) {
        console.error('Error compressing the image:', error);
        toast.error('Gagal memproses gambar.');
      }
    }
  };

  // Function to handle the actual upload to the server
  const handleUpload = async () => {
    if (compressedSuratFile && compressedBuktiFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('pembayaran', compressedBuktiFile); // Key should match API documentation
      formData.append('perizinan', compressedSuratFile);  // Key should match API documentation

      try {
        const token = localStorage.getItem('token');
        await updateInvoiceReservasiFiles(token, invoiceId, formData);
        toast.success('Bukti pembayaran dan surat keterangan acara berhasil diunggah!');
        navigate(`/invoice/${invoiceId}`);
      } catch (error) {
        console.error('Error uploading files:', error);
        toast.error('Gagal mengunggah bukti pembayaran dan surat keterangan.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className='flex flex-col items-center gap-3 px-10 lg:px-28'>
      <div className='flex flex-col items-center'>
        <h2 className='font-semibold'>Pembayaran</h2>
        <p className='text-secondary-gray'>Unggah Bukti Pembayaran</p>
      </div>

      <div className='flex flex-col gap-4 w-full'>
        <div className='flex flex-col gap-4 border-[1.5px] border-secondary rounded-md px-7 py-6'>
          <span className='text-left px-4'>Ketentuan Bukti Pembayaran</span>
          <div className='w-full bg-secondary h-[1px]' />
          <div className='flex flex-col lg:flex-row w-full'>
            <div className='flex flex-col gap-4 lg:w-[50%] px-4'>
              <ul className='px-4'>
                <li className='text-accent font-bold list-disc'>Tanggal/Waktu Pembayaran</li>
                <li className='list-none'>Contoh: 14/05 23:59:01</li>
              </ul>
              <ul className='px-4'>
                <li className='text-accent font-bold list-disc'>Status Berhasil</li>
                <li className='list-none'>Contoh: BERHASIL</li>
              </ul>
            </div>
            <div className='flex flex-col gap-4 lg:w-[50%] px-4'>
              <ul className='px-4'>
                <li className='text-accent font-bold list-disc'>Detail Penerima</li>
                <li className='list-none'>Contoh: YOGIK INDRA PRATAMA</li>
              </ul>
              <ul className='px-4'>
                <li className='text-accent font-bold list-disc'>Jumlah Transfer</li>
                <li className='list-none'>Contoh: Rp 80.000</li>
              </ul>
            </div>
          </div>
          <div>
            <p className='text-accent font-bold'>Keterangan Tambahan</p>
            <p>
              Bagi pendaftar kelompok/acara, silahkan mengunggah <strong>surat keterangan acara</strong> beserta <strong>bukti pembayaran</strong> pada kolom file di bawah ini!
            </p>
          </div>
        </div>

        {/* Surat Keterangan Upload Section */}
        <div className='flex flex-col gap-1'>
          <label className="font-semibold">Upload Surat Keterangan Acara</label>
          <label className='text-xs'>(Maks 2MB, format JPEG/PNG)</label>
          <Button onClick={() => document.getElementById('suratKeteranganInput').click()}>
            Pilih Surat Keterangan
          </Button>
          <input
            id='suratKeteranganInput'
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={(e) => handleFileUpload(e, setSelectedSuratFile, setCompressedSuratFile)}
            required
          />
          {selectedSuratFile && <p className="text-xs text-green-600 mt-2">File dipilih: {selectedSuratFile.name}</p>}
        </div>

        {/* Bukti Pembayaran Upload Section */}
        <div className='flex flex-col gap-1'>
          <label className="font-semibold">Upload Bukti Pembayaran</label>
          <label className='text-xs'>(Maks 2MB, format JPEG/PNG)</label>
          <Button onClick={() => document.getElementById('buktiPembayaranInput').click()}>
            Pilih Bukti Pembayaran
          </Button>
          <input
            id='buktiPembayaranInput'
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={(e) => handleFileUpload(e, setSelectedBuktiFile, setCompressedBuktiFile)}
            required
          />
          {selectedBuktiFile && <p className="text-xs text-green-600 mt-2">File dipilih: {selectedBuktiFile.name}</p>}
        </div>

        {/* Upload Button with disabled state */}
        <Button
          className={`w-full ${(!compressedSuratFile || !compressedBuktiFile) ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent'}`}
          onClick={handleUpload}
          disabled={!compressedSuratFile || !compressedBuktiFile || isUploading}
        >
          {isUploading ? 'Mengunggah...' : 'Unggah Bukti Transfer'}
        </Button>
      </div>
    </div>
  );
};

export default UnggahBuktiPembayaranKelompok;
