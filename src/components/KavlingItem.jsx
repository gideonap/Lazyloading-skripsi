import React, { useState } from 'react'

const KavlingItem = ({ rows, onItemClick, className = '' }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClick = (item) => {
    setSelectedItem(item);
    onItemClick(item);
  };

  return (
    <div className={`flex flex-col gap-3 items-center w-fit ${className} rounded-md border-[1.5px] px-10 py-7 border-inactive-gray-2`}>
      {rows.map((row, rowIndex) => (
        <ol key={rowIndex} className='flex flex-row gap-4 text-secondary cursor-pointer'>
          {row.map((item, itemIndex) => (
            <li
              key={itemIndex}
              onClick={() => handleClick(item)}
              className={`p-3 w-12 max-w-12 h-12 max-h-12 rounded-lg cursor-pointer text-center ${
                selectedItem === item ? 'bg-accent text-white' : 'bg-accent-2 text-secondary'
              }`}
            >
              {item}
            </li>
          ))}
        </ol>
      ))}
    </div>
  )
}

export default KavlingItem