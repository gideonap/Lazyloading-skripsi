import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidePanel from './SidePanel';
import HeaderBar from './HeaderBar';
import PerlengkapanList from './PerlengkapanList';
import { getAllPerlengkapan } from '../../services/perlengkapanService';

const PerlengkapanAdmin = () => {
  const [perlengkapan, setPerlengkapan] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getAllPerlengkapan(token);
        setPerlengkapan(response.data);
      } catch (error) {
        console.error('Error fetching perlengkapan:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    navigate('/admin/perlengkapan/tambah');
  };

  const handleDeleteSuccess = (deletedId) => {
    // Filter out the deleted item from the state
    setPerlengkapan(perlengkapan.filter(item => item.id !== deletedId));
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
                <span className='font-semibold'>Semua Perlengkapan</span>
                <button onClick={handleAddItem} className='px-3 py-2 bg-accent text-primary text-sm shadow-md rounded-md hover:bg-hover-green'>
                  Tambah Perlengkapan
                </button>
              </div>
              <div className='w-full bg-secondary h-[1px] mt-2' />

              <div className='flex flex-col px-2 text-xs gap-1'>
                <div className='flex flex-row font-semibold'>
                  <span className='w-12 max-w-12'>No</span>
                  <span className='w-28 max-w-28'>Kode Barang</span>
                  <span className='w-44 max-w-44'>Nama</span>
                  <span className='w-28 max-w-28'>Harga</span>
                  <span className='w-28 max-w-28'>Stok</span>
                  <span className='w-28 max-w-28 text-center'>Jenis</span>
                  <span className='w-28 max-w-28 text-center'>Aksi</span>
                </div>

                {perlengkapan.length > 0 ? (
                  <PerlengkapanList perlengkapan={perlengkapan} onDeleteSuccess={handleDeleteSuccess} />
                ) : (
                  <div className='text-center py-4'>
                    Tidak ada data.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerlengkapanAdmin;
