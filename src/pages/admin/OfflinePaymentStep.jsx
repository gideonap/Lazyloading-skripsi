import React, { useState, useEffect } from 'react';
import { Button, PaymentRow } from '../../components';

const OfflinePaymentStep = ({ items = [], kavlings = [], formData = {}, onCancel, onSave, updatePaymentMethod }) => {
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setPaymentMethod(selectedMethod);
    updatePaymentMethod(selectedMethod);
  };

  // Calculate the number of days between arrival and departure, handle undefined values
  const calculateDaysSpent = () => {
    if (!formData.arrivalDate || !formData.departureDate) {
      console.warn('Arrival or departure date is missing');
      return 1; // Default to 1 day if dates are missing
    }

    const arrivalDate = new Date(formData.arrivalDate);
    const departureDate = new Date(formData.departureDate);

    if (isNaN(arrivalDate.getTime()) || isNaN(departureDate.getTime())) {
      console.warn('Invalid arrival or departure date');
      return 1; // Return 1 day if invalid dates
    }

    const timeDifference = Math.abs(departureDate - arrivalDate);
    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return days || 1; // Default to 1 day if calculation fails
  };

  const daysSpent = calculateDaysSpent();

  // Calculate total price for kavlings and items, multiplying items by daysSpent
  const calculateTotal = () => {
    const kavlingTotal = kavlings.reduce((total, kavling) => total + (kavling.harga || 0), 0) * daysSpent;
    const itemTotal = items.reduce((total, item) => total + (item.harga || 0) * (item.jumlah || 0) * daysSpent, 0); // Multiply items by daysSpent
    return kavlingTotal + itemTotal;
  };

  useEffect(() => {
    console.log('Items in PaymentStep:', items);
    console.log('Kavlings in PaymentStep:', kavlings);
    console.log('FormData in PaymentStep:', formData);
  }, [items, kavlings, formData]);

  return (
    <div>
      <div className='flex flex-col items-center'>
        <h2 className='font-semibold'>Pembayaran</h2>
        <p className='text-secondary-gray'>Rincian Pembayaran (x{daysSpent} days)</p>
      </div>

      <div className='flex flex-col gap-8 items-center'>
        <div className='flex flex-col gap-7'>
          {/* Display kavling payments */}
          {kavlings.length > 0 ? (
            kavlings.map((kavling, index) => (
              <PaymentRow
                key={index}
                name={`Kavling ${kavling.ground}${kavling.nomorGround}.${kavling.nomorKavling}`}
                quantity={daysSpent}
                price={kavling.harga * daysSpent || 0}
              />
            ))
          ) : (
            <p>No kavlings selected</p>
          )}

          {/* Display item payments */}
          {items.length > 0 ? (
            items.map((item, index) => (
              <PaymentRow
                key={index}
                name={`${item.nama}`}  // Display item name here
                quantity={item.jumlah || 0}
                price={(item.harga || 0) * (item.jumlah || 0)}  // Display the individual price without daysSpent multiplier here
              />
            ))
          ) : (
            <p>No items selected</p>
          )}
        </div>

        <div className='w-full bg-secondary h-[1px]' />
        <div className='flex flex-row justify-between items-center w-[29rem]'>
          <span>Total Pembayaran</span>
          <span className='font-semibold text-3xl'>Rp {calculateTotal().toLocaleString()}</span>
        </div>
        <div className='w-full bg-secondary h-[1px]' />

        <div className='flex flex-col w-full mt-4'>
          <span className='font-semibold mb-2'>Metode Pembayaran</span>
          <div className='flex gap-4'>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='paymentMethod'
                value='Cash'
                checked={paymentMethod === 'Cash'}
                onChange={handlePaymentMethodChange}
                className='form-radio'
              />
              Cash
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='paymentMethod'
                value='Transfer'
                checked={paymentMethod === 'Transfer'}
                onChange={handlePaymentMethodChange}
                className='form-radio'
              />
              Transfer
            </label>
          </div>
        </div>

        <div className='flex justify-end w-full mt-4 gap-5'>
          <Button onClick={onCancel} className='border-[1.5px] border-red-600 bg-primary text-red-600 hover:bg-red-600 hover:text-primary'>Batal</Button>
          <Button onClick={onSave}>Simpan</Button>
        </div>
      </div>
    </div>
  );
};

export default OfflinePaymentStep;
