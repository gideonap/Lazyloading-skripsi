import React from 'react';

const PaymentRow = ({ name, quantity, price }) => {
  return (
    <div className='flex flex-row w-full text-sm lg:text-base'>
      <span className='min-w-44 max-w-48 lg:min-w-48 lg:max-w-48 text-left'>{name || 'Unknown Item'}</span>
      <span className='min-w-14 max-w-14 lg:min-w-40 lg:max-w-40 text-center'>{quantity > 0 ? `${quantity}x` : '0x'}</span>
      <span className='min-w-28 max-w-28 lg:min-w-28 lg:max-w-28 text-right'>
        {price ? `Rp ${price.toLocaleString()}` : 'N/A'}
      </span>
    </div>
  );
};

export default PaymentRow;
