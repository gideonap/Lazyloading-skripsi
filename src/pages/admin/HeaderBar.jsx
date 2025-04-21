import React, { useState, useEffect } from 'react';

const HeaderBar = ({ title, searchTerm, onSearchChange }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch the username from localStorage (assuming user data is stored in localStorage as 'userData')
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData && userData.name) {
      setUsername(userData.name);
    }
  }, []); // Only run this effect once on mount

  return (
    <div className='flex flex-row w-full items-center justify-between'>
      <div className='flex flex-row gap-10'>
        <h2 className='font-semibold'>{title}</h2>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={onSearchChange}
          className='px-3 py-2 w-72 rounded-full ring-1 ring-inactive-gray-2'
        />
      </div>
      <span className='pr-10'>{username}</span>
    </div>
  );
};

export default HeaderBar;