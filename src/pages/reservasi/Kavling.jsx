import React, { useEffect, useState } from 'react';
import { Navbar, Footer, Button, KavlingLayout } from '../../components';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { getAllGround } from '../../services/groundService';
import { getAllSubGrounds } from '../../services/subGroundService';
import { getAllKavling, getKavlingByTgl } from '../../services/kavlingService';

const Kavling = () => {
  const navigate = useNavigate();
  const [lastFormData, setLastFormData] = useState({});
  const [groundData, setGroundData] = useState([]);
  const [subGroundData, setSubGroundData] = useState([]);
  const [selectedGround, setSelectedGround] = useState('');
  const [selectedSubGround, setSelectedSubGround] = useState('');
  const [selectedKavlings, setSelectedKavlings] = useState([]); // Holds multiple selected kavlings
  const [selectedGroundImage, setSelectedGroundImage] = useState(''); // Holds the selected ground's image link
  const token = localStorage.getItem('token');

  useEffect(() => {
    const _lastFormData = localStorage.getItem('tmp_add_reservasi');
    if (!_lastFormData) {
      navigate('/reservasi');
    } else {
      setLastFormData(JSON.parse(_lastFormData));
    }

    // Fetch grounds when component mounts
    fetchGrounds();
  }, [navigate]);

  const fetchGrounds = async () => {
    const response = await getAllGround(token);
    setGroundData(response.data);
  };

  const fetchSubGrounds = async (groundId) => {
    const response = await getAllSubGrounds(token, groundId);
    setSubGroundData(response.data);
  };

  const fetchKavlings = async (groundId, subGroundId) => {
    const lastFormData = JSON.parse(localStorage.getItem('tmp_add_reservasi'));
    const { tanggal_kedatangan, tanggal_kepulangan } = lastFormData;

    const response = await getKavlingByTgl(token, tanggal_kedatangan, tanggal_kepulangan);
    const groundKey = Object.keys(response.data).find((key) =>
      Object.values(response.data[key]).flat(2).some((kavling) => kavling.ground_id === groundId)
    );

    if (!groundKey) {
      console.error(`Ground with ID "${groundId}" not found in response.`);
      return [];
    }

    const kavlingsBySubGround = Object.keys(response.data[groundKey]).find((key) =>
      response.data[groundKey][key].flat(2).some((kavling) => kavling.sub_ground_id === subGroundId)
    );

    if (!kavlingsBySubGround) {
      console.error(`Sub Ground "${subGroundId}" not found for Ground "${groundKey}".`);
      return [];
    }

    const flattenedKavlings = response.data[groundKey][kavlingsBySubGround].flat(2);
    return flattenedKavlings;
  };

  const handleGroundChange = (e) => {
    const selectedGroundId = e.target.value;
    setSelectedGround(selectedGroundId);

    // Get the image link for the selected ground
    const selectedGroundObj = groundData.find((ground) => ground.id === selectedGroundId);
    if (selectedGroundObj) {
      setSelectedGroundImage(selectedGroundObj.image_link || ''); // Set image link if available
    }

    fetchSubGrounds(selectedGroundId);
    setSelectedSubGround(''); 
    setSelectedKavlings([]); 
  };

  const handleSubGroundChange = (e) => {
    const selectedSubGroundId = e.target.value;
    setSelectedSubGround(selectedSubGroundId);
  };

  const getTotalPrice = () => {
    return selectedKavlings.reduce((total, kavling) => total + (kavling.harga || 0), 0);
  };

  const getSelectedKavlingNames = () => {
    return selectedKavlings
      .map(kavling => `${kavling.ground}${kavling.nomorGround}.${kavling.nomorKavling}`)
      .join(', ');
  };

  const handleSubmit = () => {
    const updatedFormData = {
      ...lastFormData,
      reservasi: [
        ...lastFormData.reservasi,
        ...selectedKavlings.map(kavling => ({
          kavling_id: kavling.id,
          name: `Kavling ${kavling.ground}${kavling.nomorGround}.${kavling.nomorKavling}`, // Add the kavling name here
          harga: kavling.harga,
          jumlah: 1
        }))
      ]
    };
  
    console.log('Updated Form Data:', updatedFormData);
    localStorage.setItem('tmp_add_reservasi', JSON.stringify(updatedFormData));
  
    navigate('/pembayaran');
  };
  
  return (
    <div>
      <Navbar />
      <div className='flex flex-col items-center gap-6 px-10 lg:px-28'>
        <h2 className='font-semibold text-2xl lg:text-4xl'>Pilih Kavling</h2>
        
        {/* Display Ground Image */}
        {selectedGroundImage ? (
          <img src={selectedGroundImage} alt="Selected Ground" className='lg:h-96 rounded-lg' />
        ) : (
          <img src="/images/PetaBedengan.jpeg" alt="petaBedengan" className='lg:h-96 rounded-lg' />
        )}

        {/* Ground Selection */}
        <div className='flex flex-col gap-4 lg:w-[40rem]'>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-2 w-full'>
              <label className='font-semibold'>Pilih Ground</label>
              <select
                value={selectedGround}
                onChange={handleGroundChange}
                className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2'
                required
              >
                <option value=''>Pilih Ground</option>
                {groundData.map((ground) => (
                  <option key={ground.id} value={ground.id}>
                    {ground.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* SubGround Selection */}
            <div className='flex flex-col gap-2 w-full'>
              <label className='font-semibold'>Pilih Nomor Ground</label>
              <select
                value={selectedSubGround}
                onChange={handleSubGroundChange}
                className='block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2'
                required
                disabled={!selectedGround} // Disable until ground is selected
              >
                <option value=''>Pilih Nomor Ground</option>
                {subGroundData.map((subGround) => (
                  <option key={subGround.id} value={subGround.id}>
                    {subGround.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Kavling Selection */}
            <div className='flex flex-col gap-2'>
              <label className='font-semibold'>Pilih Kavling</label>
              <KavlingLayout
                groundId={selectedGround}
                subGroundId={selectedSubGround}
                selectedKavlings={selectedKavlings}
                setSelectedKavlings={setSelectedKavlings}
                fetchKavlings={fetchKavlings}
              />
            </div>

            {/* Kavling Status Legend */}
            <div className='flex flex-row gap-4 justify-center w-full'>
              <div className='flex flex-row gap-1 items-center'>
                <div className='p-[0.5rem] bg-accent-2 rounded-full' />
                <p className='text-sm'>Tersedia</p>
              </div>
              <div className='flex flex-row gap-1 items-center'>
                <div className='p-[0.5rem] bg-accent rounded-full' />
                <p className='text-sm'>Terpilih</p>
              </div>
              <div className='flex flex-row gap-1 items-center'>
                <div className='p-[0.5rem] bg-red-700 rounded-full' />
                <p className='text-sm'>Tidak Tersedia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Harga */}
        <div className='flex flex-col gap-3'>
          <h3 className='text-xl font-semibold'>Detail Harga Kavling</h3>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row'>
              <p className='w-28 max-w-28'>Kavling</p>
              <p>: {getSelectedKavlingNames() || '-'}</p>
            </div>
            <div className='flex flex-row'>
              <p className='w-28 max-w-28'>Harga</p> 
              <p>: Rp {getTotalPrice().toLocaleString()}</p>
            </div>
          </div>
          <span className='text-gray-500 text-sm max-w-[41rem]'>Perhatian: Harga yang tertera hanya harga untuk reservasi kavling, pembayaran tiket masuk wilayah Bedengan dapat dilakukan secara offline di lokasi saat check-in.</span>
        </div>

        {/* Next Button */}
        <div className='flex flex-row w-full justify-end'>
          <Button onClick={handleSubmit}>Selanjutnya</Button>
        </div>
      </div>
      <Footer className='mt-20' />
    </div>
  );
};

export default Kavling;
