import React, { useState } from 'react'
import { Button } from '../../components/index'

const MetodePembayaran = () => {
  const [selectedMethod, setSelectedMethod] = useState('');

  const paymentMethods = [
    { id:'qris', name: 'QRIS', icon: '/images/QrisLogo.png' },
    { id:'bca_va', name: 'BCA Virtual Account', icon: '/images/BCALogo.webp' },
  ];

  const handleSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handleNextButton = () => {
    console.log("Selected Payment Method:", selectedMethod);
  };

  return (
    <div className='flex flex-col items-center gap-3 px-28'>
        <div className='flex flex-col items-center'>
            <h2 className='font-semibold'>Pembayaran</h2>
            <p className='text-secondary-gray'>Metode Pembayaran</p>
        </div>

        <div className='flex flex-col gap-4 max-w-[32rem]'>
            <div className='flex flex-row gap-4 max-w-[32rem]'>
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        onClick={() => handleSelect(method.id)}
                        className={`flex flex-col items-center justify-center p-4 w-44 h-44 transition-colors duration-300 cursor-pointer border-[1.5px] border-solid rounded-md ${
                            selectedMethod === method.id ? 'bg-accent border-accent' : 'bg-white border-inactive-gray-2'
                        }`}
                    >
                        <div className='flex items-center justify-center w-32 h-32 mb-2'>
                            <img src={method.icon} alt={method.name} className='max-w-full max-h-full object-contain' />
                        </div>
                        <span className='text-sm font-semibold text-center'>{method.name}</span>
                    </div>
                ))}
            </div>
      
            <div className='flex w-full justify-end mt-4'>
                <Button onClick={handleNextButton}>Selanjutnya</Button>
            </div>
        </div>

    </div>
  )
}

export default MetodePembayaran