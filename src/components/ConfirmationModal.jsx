import React from 'react';
import { IoWarningOutline } from "react-icons/io5";
import { RiQuestionLine } from "react-icons/ri";

const ConfirmationModal = ({ title, message, onConfirm, onClose, type = 'hapus' }) => {
  // Determine the icon, colors, and button labels based on the modal type
  const isHapus = type === 'hapus';

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='flex flex-col items-center bg-white p-5 rounded-lg shadow-md max-w-md w-full'>
        {/* Icon */}
        <div className={`text-primary p-4 rounded-full ${isHapus ? 'bg-red-600' : 'bg-orange-600'}`}>
          {isHapus ? (
            <IoWarningOutline className='text-xl' />
          ) : (
            <RiQuestionLine className='text-xl' />
          )}
        </div>

        {/* Message */}
        <p className='mt-4 font-semibold text-center'>{message}</p>

        {/* Action Buttons */}
        <div className='mt-6 flex justify-end gap-2'>
          <button
            className={`px-4 py-2 ${isHapus ? 'bg-red-600 hover:bg-red-700' : 'bg-accent hover:bg-hover-green'} text-primary rounded shadow-md`}
            onClick={onConfirm}
          >
            {isHapus ? 'Hapus' : 'Simpan'}
          </button>
          <button
            className={`px-4 py-2 ${isHapus ? 'bg-accent hover:bg-hover-green text-primary' : 'text-red-600 border-[1.5px] border-red-600 bg-primary hover:bg-red-700 hover:text-primary'} rounded shadow-md`}
            onClick={onClose}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;