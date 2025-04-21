import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { Button } from '../../components/index';

const DetailKavling = ({ onNext }) => {
  const [formData, setFormData] = useState({
    visitorType: '',
    numberOfVisitor: '',
    arrivalDate: '',
    departureDate: '',
  });

  const [minArrivalDate, setMinArrivalDate] = useState('');
  const [minDepartureDate, setMinDepartureDate] = useState('');
  const [maxDepartureDate, setMaxDepartureDate] = useState('');

  useEffect(() => {
    // Calculate the date three days from today for the arrival date minimum
    const today = new Date();
    today.setDate(today.getDate() + 3); // Add 3 days to today's date
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setMinArrivalDate(formattedDate);
  }, []);

  useEffect(() => {
    if (formData.arrivalDate) {
      // Calculate the minimum and maximum departure dates based on the selected arrival date
      const arrival = new Date(formData.arrivalDate);

      // Minimum departure date is one day after arrival
      const minDeparture = new Date(arrival);
      minDeparture.setDate(arrival.getDate() + 1);
      const formattedMinDeparture = minDeparture.toISOString().split('T')[0];
      setMinDepartureDate(formattedMinDeparture);

      // Maximum departure date is two days after arrival
      const maxDeparture = new Date(arrival);
      maxDeparture.setDate(arrival.getDate() + 2);
      const formattedMaxDeparture = maxDeparture.toISOString().split('T')[0];
      setMaxDepartureDate(formattedMaxDeparture);
    }
  }, [formData.arrivalDate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = [];

    if (!formData.visitorType) {
      errors.push('Jenis Pengunjung harus dipilih.');
    }
    if (!formData.numberOfVisitor) {
      errors.push('Jumlah pengunjung harus diisi.');
    }
    if (!formData.arrivalDate) {
      errors.push('Tanggal Kedatangan harus diisi.');
    }
    if (!formData.departureDate) {
      errors.push('Tanggal Kepulangan harus diisi.');
    }

    return errors;
  };

  const handleNext = () => {
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n\n'));
    } else {
      onNext(formData); // No tentType is included anymore
    }
  };

  return (
    <div className='flex flex-col gap-3 items-center px-10 lg:px-28'>
      <div className='flex flex-col items-center'>
        <h2 className='font-semibold text-2xl lg:text-4xl'>Reservasi</h2>
        <p className='text-secondary-gray'>Detail Kavling</p>
      </div>

      <div className='flex flex-col w-72 lg:w-[30rem] gap-4 lg:max-w-[32rem]'>
        <div className='flex flex-col gap-2'>
          <label className="font-semibold">Jenis Pengunjung</label>
          <div className='relative'>
            <select
              name="visitorType"
              onChange={handleChange}
              value={formData.visitorType}
              className="block appearance-none px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
              required
            >
              <option>Pilih</option>
              <option value="individu">Pribadi</option>
              <option value="kelompok">Instansi</option>
            </select>
            <span className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
              <IoIosArrowDown />
            </span>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className="font-semibold">Jumlah</label>
          <input
            type="number"
            name="numberOfVisitor"
            onChange={handleChange}
            value={formData.numberOfVisitor}
            className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
            required
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className="font-semibold">Tanggal Kedatangan</label>
          <input
            type="date"
            name="arrivalDate"
            onChange={handleChange}
            value={formData.arrivalDate}
            min={minArrivalDate} // Set the minimum date to three days from today
            className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
            required
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className="font-semibold">Tanggal Kepulangan</label>
          <input
            type="date"
            name="departureDate"
            onChange={handleChange}
            value={formData.departureDate}
            min={minDepartureDate} // Set based on the arrival date
            max={maxDepartureDate} // Set based on the arrival date
            className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 sm:text-sm"
            required
            disabled={!formData.arrivalDate} // Disable until arrival date is selected
          />
        </div>

        <div className='flex w-full justify-center lg:justify-end'>
          <Button onClick={handleNext} className='w-full lg:w-fit'>Selanjutnya</Button>
        </div>
      </div>
    </div>
  );
};

export default DetailKavling;
