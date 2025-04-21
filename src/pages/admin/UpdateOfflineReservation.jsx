import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidePanel from './SidePanel';
import HeaderBar from './HeaderBar';
import OfflineFormStep from './OfflineFormStep';
import OfflineItemStep from './OfflineItemStep';
import OfflinePaymentStep from './OfflinePaymentStep';

const UpdateOfflineReservation = () => {
  const { state } = useLocation(); // Get data passed from previous page
  const { reservation } = state || {}; // Destructure the reservation data

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    visitorType: '',
    name: '',
    phoneNumber: '',
    tentType: '',
    quantity: '',
    kavling: '',
    arrivalDate: '',
    departureDate: '',
    metodePembayaran: '',
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (reservation) {
      setFormData({
        visitorType: reservation.visitorType || '',
        name: reservation.nama || '',
        phoneNumber: reservation.phoneNumber || '',
        tentType: reservation.tentType || '',
        quantity: reservation.quantity || '',
        kavling: reservation.kavling || '',
        arrivalDate: formatDateForInput(reservation.tglMasuk) || '',
        departureDate: formatDateForInput(reservation.tglKeluar) || '',
        metodePembayaran: reservation.jenisPembayaran || '',
      });
      setSelectedItems(reservation.selectedItems || []);
    }
  }, [reservation]);

  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleCancel = () => {
    navigate('/admin/reservasi/offline');
  };

  const handleSave = () => {
    console.log('Updated Reservation Data:', formData);
    console.log('Updated Selected Items:', selectedItems);
    alert('Reservasi berhasil diperbarui!');
    navigate('/admin/reservasi/offline');
  };

  const updatePaymentMethod = (method) => {
    setFormData((prevData) => ({ ...prevData, metodePembayaran: method }));
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
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
                <span className='font-semibold'>Ubah Reservasi Offline</span>
              </div>
              <div className='w-full bg-secondary h-[1px] mt-2' />

              {currentStep === 1 && (
                <OfflineFormStep 
                  formData={formData} 
                  setFormData={setFormData} 
                  onCancel={handleCancel} 
                  goToNextStep={goToNextStep} 
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
                  onCancel={handleCancel} 
                  onSave={handleSave} 
                  updatePaymentMethod={updatePaymentMethod} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOfflineReservation;
