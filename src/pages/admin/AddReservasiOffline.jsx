import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidePanel from './SidePanel';
import HeaderBar from './HeaderBar';
import { toast } from 'react-toastify';
import OfflineFormStep from './OfflineFormStep';
import OfflineItemStep from './OfflineItemStep';
import OfflinePaymentStep from './OfflinePaymentStep';
import { getAllGround } from '../../services/groundService';
import { getAllSubGrounds } from '../../services/subGroundService';
import { getAllKavling, getKavlingByTgl } from '../../services/kavlingService';
import { createInvoiceReservasi } from '../../services/invoiceService'; // Import API service

const AddReservasiOffline = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    visitorType: '',
    name: '',
    phoneNumber: '',
    quantity: '',
    groundId: '',
    subGroundId: '',
    arrivalDate: '',
    departureDate: '',
    metodePembayaran: ''
  });

  const [selectedKavlings, setSelectedKavlings] = useState([]); // Selected kavlings
  const [selectedItems, setSelectedItems] = useState([]); // Holds item.id and jumlah

  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Get token for authorization

  // Define the goToNextStep function to advance the step
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  // Handle the API call when saving the reservation
  const handleSave = async () => {
    // Prepare the payload
    const payload = {
      jenis_pengunjung: formData.visitorType,
      tanggal_kedatangan: formData.arrivalDate,
      tanggal_kepulangan: formData.departureDate,
      keterangan: JSON.stringify({
        nama: formData.name,
        nomor_telepon: formData.phoneNumber,
        jumlah: formData.quantity,
        jenis_pembayaran: formData.metodePembayaran
      }),
      reservasi: [
        ...selectedKavlings.map((kavling) => ({
          kavling_id: kavling.id,
          jumlah: 1
        })),
        ...selectedItems.map((item) => ({
          perlengkapan_id: item.id,
          jumlah: item.jumlah
        }))
      ]
    };

    try {
      const response = await createInvoiceReservasi(token, payload); // API call
      console.log('Reservation successfully created:', response);
      console.log(payload);
      toast.success('Reservasi berhasil disimpan!');
      // Navigate back to the reservations page after a successful save
      navigate('/admin/reservasi/offline');
    } catch (error) {
      console.log(payload)
      console.error('Error saving reservation:', error);
      toast.error('Gagal membuat reservasi offline');
      // Handle error case (e.g., display an error message)
    }
  };

  const handleCancel = () => {
    setFormData({
      visitorType: '',
      name: '',
      phoneNumber: '',
      quantity: '',
      groundId: '',
      subGroundId: '',
      arrivalDate: '',
      departureDate: '',
      metodePembayaran: ''
    });
    setSelectedKavlings([]);
    setSelectedItems([]);
    navigate('/admin/reservasi/offline');
  };

  const fetchGrounds = async () => {
    const response = await getAllGround(token);
    return response.data;
  };

  const fetchSubGrounds = async (groundId) => {
    const response = await getAllSubGrounds(token, groundId);
    return response.data;
  };

  const fetchKavlings = async (groundId, subGroundId) => {
    const { arrivalDate, departureDate } = formData;
    const response = await getKavlingByTgl(token, arrivalDate, departureDate);
    console.log('Kavling API response:', response.data);

    const groundKey = Object.keys(response.data).find((key) =>
      Object.values(response.data[key])
        .flat(2)
        .some((kavling) => kavling.ground_id === groundId)
    );

    if (!groundKey) {
      console.error(`Ground with ID "${groundId}" not found in response.`);
      console.log('Available Ground Keys:', Object.keys(response.data));
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

  return (
    <div className='w-screen h-screen p-10'>
      <div className='flex flex-row gap-10 h-full'>
        <SidePanel />
        <div className='flex flex-col py-3 w-full gap-8'>
          <HeaderBar title='Reservasi' searchTerm='' onSearchChange={() => {}} username='Admin' />

          <div className='flex flex-col gap-10'>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-row w-full justify-between items-center'>
                <span className='font-semibold'>Tambah Reservasi Offline</span>
              </div>
              <div className='w-full bg-secondary h-[1px] mt-2' />
              {currentStep === 1 && (
                <OfflineFormStep
                  formData={formData}
                  setFormData={setFormData}
                  selectedKavlings={selectedKavlings}
                  setSelectedKavlings={setSelectedKavlings}
                  onCancel={handleCancel}
                  goToNextStep={goToNextStep} 
                  fetchGrounds={fetchGrounds}
                  fetchSubGrounds={fetchSubGrounds}
                  fetchKavlings={fetchKavlings}
                />
              )}
              {currentStep === 2 && (
                <OfflineItemStep
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  onCancel={handleCancel}
                  goToNextStep={goToNextStep}
                />
              )}
              {currentStep === 3 && (
                <OfflinePaymentStep
                  items={selectedItems}
                  kavlings={selectedKavlings}
                  formData={formData}
                  onCancel={handleCancel}
                  onSave={handleSave}
                  updatePaymentMethod={(method) => setFormData({ ...formData, metodePembayaran: method })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReservasiOffline;
