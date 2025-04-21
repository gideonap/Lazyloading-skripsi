import React from 'react';

const KavlingAdd = ({ kavlings, onAddKavling }) => {
  // Group kavlings by 'baris'
  const groupedKavlings = kavlings.reduce((acc, kavling) => {
    acc[kavling.baris] = acc[kavling.baris] || [];
    acc[kavling.baris].push(kavling);
    return acc;
  }, {});

  return (
    <div className='flex flex-col gap-3 items-center w-full rounded-md border-[1.5px] px-10 py-7 border-inactive-gray-2'>
      {/* Map over the grouped kavlings by 'baris' */}
      {Object.entries(groupedKavlings).map(([baris, kavlingRow]) => (
        <div key={baris} className='flex gap-2'>
          {/* Sort kavlings by 'kolom' for each 'baris' */}
          {kavlingRow.sort((a, b) => a.kolom - b.kolom).map((kavling, kavlingIndex) => (
            <div
              key={kavlingIndex}
              className={`flex flex-col items-center justify-center w-12 h-12 ${kavling.isAvailable ? 'bg-accent-2' : 'bg-red-500'} rounded-lg text-secondary cursor-pointer p-1`}
            >
              {/* Display kavling details */}
              <span className='text-xs font-semibold'>{kavling.ground}{kavling.nomorGround}.{kavling.nomorKavling}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Single Add Kavling button */}
      <div
        className='flex items-center justify-center w-12 h-12 border-[1px] border-inactive-gray bg-primary text-secondary rounded-lg cursor-pointer'
        onClick={() => onAddKavling(null)} // Passing null indicates adding a new row
      >
        +
      </div>
    </div>
  );
};

export default KavlingAdd;
