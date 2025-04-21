import React, { useState } from 'react'
import { Navbar, Footer } from '../../components/index'
import { Syarat, SyaratJudul } from './Syarat'


const SyaratDanKetentuan = () => {
  const [selectedItem, setSelectedItem] = useState('1');

  const handleItemClick = (itemId) => {
    setSelectedItem(itemId);
  }

  return (
    <div>
        <Navbar />
        <div className='flex flex-col items-center gap-5 px-10 lg:px-28'>
            <h2 className='font-semibold text-2xl lg:text-4xl'>Syarat dan Ketentuan</h2>
            <div className='hidden lg:flex flex-row gap-8 min-h-72 w-full justify-center'>
                <ol className='flex flex-col max-w-64 list-decimal'>
                    {Object.keys(Syarat).map((itemId) => (
                        <li
                            key={itemId}
                            onClick={() => handleItemClick(itemId)}
                            className={`cursor-pointer py-2 px-4 transition-colors duration-300${
                                selectedItem === itemId
                                    ? 'border border-r-4 border-accent font-bold'
                                    : 'border-inactive-gray-2 border-r-2'
                            }`}
                        >
                            {SyaratJudul[itemId]}
                        </li>
                    ))}
                </ol>
                <div className='px-8 py-3 h-fit w-[60rem] rounded-md border-[1.5px] border-inactive-gray-2'>
                    <ol className='flex flex-col gap-1 list-decimal'>
                        {Syarat[selectedItem].map((point, index) => (
                            <li key={index} className='text-sm'>{point}</li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className='lg:hidden h-fit rounded-md border-[1.5px] px-4 py-3 border-inactive-gray-2'>
                {Object.keys(Syarat).map((itemId) => (
                    <div key={itemId} className='mb-6'>
                    <p className='font-semibold mb-5'>{[itemId]}. {SyaratJudul[itemId]}</p>
                    <ol className='list-decimal pl-5'>
                      {Syarat[itemId].map((point, index) => (
                        <li key={index} className='text-sm mb-1'>{point}</li>
                      ))}
                    </ol>
                  </div>
                ))}
            </div>
        </div>
        <Footer className='mt-20' />
    </div>
  )
}

export default SyaratDanKetentuan