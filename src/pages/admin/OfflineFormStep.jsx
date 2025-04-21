import React, { useState, useEffect } from 'react';
import { Button, SelectKavling } from '../../components';

const OfflineFormStep = ({
  formData,
  setFormData,
  selectedKavlings,
  setSelectedKavlings,
  onCancel,
  goToNextStep,
  fetchGrounds,
  fetchSubGrounds,
  fetchKavlings
}) => {
  const [groundData, setGroundData] = useState([]);
  const [subGroundData, setSubGroundData] = useState([]);
  const [minArrivalDate, setMinArrivalDate] = useState('');
  const [minDepartureDate, setMinDepartureDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const oneDaysFromToday = new Date();
    oneDaysFromToday.setDate(today.getDate() + 1);

    setMinArrivalDate(today.toISOString().split('T')[0]); // Format YYYY-MM-DD
    setMinDepartureDate(oneDaysFromToday.toISOString().split('T')[0]);
  }, []);

  // Fetch Grounds on component mount
  useEffect(() => {
    const loadGrounds = async () => {
      const grounds = await fetchGrounds(); // Fetch all grounds from service
      setGroundData(grounds);
    };
    loadGrounds();
  }, [fetchGrounds]);

  // Handle change in ground and fetch sub-grounds based on selected ground
  const handleGroundChange = async (e) => {
    const selectedGroundId = e.target.value;
    setFormData({ ...formData, groundId: selectedGroundId, subGroundId: '' }); // Reset sub-ground when ground changes
    const subGrounds = await fetchSubGrounds(selectedGroundId); // Fetch sub-grounds
    setSubGroundData(subGrounds);
  };

  const handleSubGroundChange = async(e) => {
    const selectedSubGroundId = e.target.value;
    setFormData({ ...formData, subGroundId: selectedSubGroundId });
    if (formData.arrivalDate && formData.departureDate) {
      // Fetch kavlings only if both arrival and departure dates are selected
      const kavlings = await fetchKavlings(formData.groundId, selectedSubGroundId);
      setSelectedKavlings(kavlings);
    } else {
      console.error("Please select both arrival and departure dates");
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className='flex flex-col gap-4 text-xs'>
      {/* Visitor Type */}
      <div className='flex flex-col gap-2'>
        <label className="font-semibold">Jenis Pengunjung</label>
        <select
          name="visitorType"
          onChange={handleFormChange}
          value={formData.visitorType}
          className="block appearance-none px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
        >
          <option value="">Pilih</option>
          <option value="individu">Pribadi</option>
          <option value="kelompok">Instansi</option>
        </select>
      </div>

      {/* Visitor Details */}
      <div className='flex flex-row gap-5'>
        <div className='flex flex-col gap-2 w-full'>
          <label className="font-semibold">Nama</label>
          <input
            type="text"
            name="name"
            onChange={handleFormChange}
            value={formData.name}
            className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <label className="font-semibold">Nomor Telepon</label>
          <input
            type="tel"
            name="phoneNumber"
            onChange={handleFormChange}
            value={formData.phoneNumber}
            className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
          />
        </div>
      </div>

      {/* Quantity */}
      <div className='flex flex-col gap-2'>
        <label className="font-semibold">Jumlah</label>
        <input
          type="number"
          name="quantity"
          onChange={handleFormChange}
          value={formData.quantity}
          className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
        />
      </div>

      {/* Arrival and Departure Dates */}
      <div className='flex flex-row gap-5'>
        <div className='flex flex-col gap-2 w-full'>
          <label className="font-semibold">Tanggal Kedatangan</label>
          <input
            type="date"
            name="arrivalDate"
            onChange={handleFormChange}
            value={formData.arrivalDate}
            min={minArrivalDate}
            className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
          />
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <label className="font-semibold">Tanggal Kepulangan</label>
          <input
            type="date"
            name="departureDate"
            onChange={handleFormChange}
            value={formData.departureDate}
            min={minDepartureDate}
            className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
          />
        </div>
      </div>

      {/* Ground Selection */}
      <div className='flex flex-col gap-2 w-full'>
        <label className="font-semibold">Ground</label>
        <select
          value={formData.groundId}
          onChange={handleGroundChange}
          className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2"
          required
        >
          <option value="">Pilih Ground</option>
          {groundData.map((ground) => (
            <option key={ground.id} value={ground.id}>{ground.nama}</option>
          ))}
        </select>
      </div>

      {/* SubGround Selection */}
      <div className='flex flex-col gap-2 w-full'>
        <label className="font-semibold">Nomor Ground</label>
        <select
          value={formData.subGroundId}
          onChange={handleSubGroundChange}
          className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2"
          required
          disabled={!formData.groundId} // Disable until ground is selected
        >
          <option value="">Pilih Nomor Ground</option>
          {subGroundData.map((subGround) => (
            <option key={subGround.id} value={subGround.id}>{subGround.nama}</option>
          ))}
        </select>
      </div>

      {/* Kavling Selection */}
      <div className='flex flex-col gap-2'>
        <label className="font-semibold">Pilih Kavling</label>
        <SelectKavling
          groundId={formData.groundId}
          subGroundId={formData.subGroundId}
          selectedKavlings={selectedKavlings}
          setSelectedKavlings={setSelectedKavlings}
          fetchKavlings={fetchKavlings}
        />
      </div>

      {/* Action Buttons */}
      <div className='flex flex-row gap-3 w-full justify-end'>
        <Button onClick={onCancel} className='border-[1.5px] border-red-600 bg-primary text-red-600 hover:bg-red-600 hover:text-primary'>Batal</Button>
        <Button onClick={goToNextStep}>Selanjutnya</Button>
      </div>
    </form>
  );
};

export default OfflineFormStep;
