import React from 'react'

const DetailModal = ({ isOpen, imageUrl, title, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='flex flex-col bg-white p-5 rounded gap-4'>
        <span className='font-semibold text-lg'>{title}</span>
        <div className='flex justify-center'>
          <img src={imageUrl} alt={title} className='max-w-full max-h-96' />
        </div>
        <div className='flex justify-end'>
          <button
            className='mt-4 px-4 py-2 bg-accent hover:bg-hover-green text-white rounded shadow-md'
            onClick={onClose}
          >
            Kembali
          </button> 
        </div>
      </div>
    </div>
  )
}

export default DetailModal