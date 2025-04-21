import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidePanel from './SidePanel';
import HeaderBar from './HeaderBar';
import ItemPerlengkapanList from './ItemPerlengkapanList';
import { getAllPerlengkapan } from '../../services/perlengkapanService'; // Assuming this fetches all perlengkapan

const TendaNonPaket = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getAllPerlengkapan(token);

        // Filter the items where jenis is 'tenda_non_paket'
        const tendaNonPaketItems = response.data.filter(item => item.jenis === 'tenda_non_paket');

        setItems(tendaNonPaketItems);
      } catch (error) {
        console.error('Error fetching perlengkapan:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteSuccess = (id) => {
    setItems((prevItems) => prevItems.filter(item => item.id !== id));
  };
  
  const handleAddItem = () => {
    navigate('/admin/perlengkapan/tambah');
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
                <span className='font-semibold'>Tenda Non Paket</span>
                <button onClick={handleAddItem} className='px-3 py-2 bg-accent text-primary text-sm shadow-md rounded-md hover:bg-hover-green'>
                  Tambah Perlengkapan
                </button>
              </div>
              <div className='w-full bg-secondary h-[1px] mt-2' />
              <div className='flex flex-col px-2 text-xs gap-1'>
                <div className='flex flex-row font-semibold'>
                  <span className='w-12 max-w-12'>No</span>
                  <span className='w-28 max-w-28'>Kode Barang</span>
                  <span className='w-64 max-w-64'>Nama</span>
                  <span className='w-28 max-w-28'>Harga</span>
                  <span className='w-28 max-w-28'>Stok</span>
                  <span className='w-28 max-w-28'>Aksi</span>
                </div>
                <div>
                  {items.length > 0 ? (
                    <ItemPerlengkapanList items={items} onDeleteSuccess={handleDeleteSuccess}/>
                  ) : (
                    <p>Tidak ada data untuk Tenda Non Paket.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TendaNonPaket;
