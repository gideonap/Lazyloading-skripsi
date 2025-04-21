import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/index';
import { getMyUserInfo, updateUser, logoutUser } from '../../services/userService';
import { toast } from 'react-toastify';

const ContentProfil = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    nik: '',
    alamat: '',
  });
  const [originalUserInfo, setOriginalUserInfo] = useState(null); // Store the original data
  const [loading, setLoading] = useState(true); // For showing a loading state
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getMyUserInfo(token);
        const data = response.data;

        const userData = {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          nik: data.nik || '', // Include nik
          alamat: data.alamat || '', // Include alamat
        };

        setUserInfo(userData);
        setOriginalUserInfo(userData); // Store the original data
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err); // Debugging the error
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      setError('No token available. Please log in.');
      setLoading(false);
    }
  }, [token]);

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name: userInfo.name,
      phone: userInfo.phone,
      nik: userInfo.nik, // Add nik
      alamat: userInfo.alamat, // Add alamat
    };

    try {
      await updateUser(updatedData, token); // Send `name`, `phone`, `nik`, and `alamat`
      toast.success('Profil berhasil diperbarui');
    } catch (err) {
      console.error('Error updating profile:', err.response ? err.response.data : err);
      setError('Error updating profile');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('No token found, please log in again.');
      navigate('/masuk');
      return;
    }

    try {
      await logoutUser(token);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');

      navigate('/masuk');
      toast.success('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.response?.data?.message || 'Logout failed, please try again.');
    }
  };

  const isUserInfoChanged = () => {
    return (
      userInfo.name !== originalUserInfo?.name ||
      userInfo.email !== originalUserInfo?.email ||
      userInfo.phone !== originalUserInfo?.phone ||
      userInfo.nik !== originalUserInfo?.nik || // Check nik
      userInfo.alamat !== originalUserInfo?.alamat // Check alamat
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='flex flex-col gap-5 w-full items-center lg:items-start'>
      <h2 className='font-semibold'>Profil</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-full'>
        <div className='flex flex-col gap-5 border-[1.5px] border-inactive-gray-2 px-5 py-3 rounded-md'>
          <div className='flex flex-col gap-3'>
            <label className='font-medium'>Nama (Sesuai KTP)</label>
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              placeholder='Nama sesuai KTP'
              className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 text-sm"
              required
            />
          </div>
          <div className='flex flex-col gap-3'>
            <label className='font-medium'>NIK</label>
            <input
              type="text"
              name="nik"
              value={userInfo.nik} // Bind nik input
              onChange={handleChange}
              placeholder='Nomor Induk Kependudukan'
              className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 text-sm"
              required
            />
          </div>
          <div className='flex flex-col gap-3'>
            <label className='font-medium'>Alamat (Sesuai KTP)</label>
            <input
              type="text"
              name="alamat"
              value={userInfo.alamat} // Bind alamat input
              onChange={handleChange}
              placeholder='Alamat sesuai KTP'
              className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 text-sm"
              required
            />
          </div>
          <div className='flex flex-col gap-3'>
            <label className='font-medium'>Email</label>
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              placeholder='Email aktif'
              className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 text-sm"
              readOnly
            />
          </div>
          <div className='flex flex-col gap-3'>
            <label className='font-medium'>Nomor Telepon</label>
            <input
              type="tel"
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
              placeholder='Nomor yang bisa dihubungi'
              className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2 text-sm"
              required
            />
          </div>
          <div className='flex flex-col lg:flex-row gap-3'>
            <Button 
              type='submit' 
              disabled={!isUserInfoChanged()} 
              className={!isUserInfoChanged() ? 'bg-gray-400 hover:bg-gray-400' : ''}
            >
              Simpan Perubahan
            </Button>
            <Button
              type='button'
              onClick={handleLogout}
              className='text-red-600 border-[1.5px] border-red-600 bg-primary hover:bg-red-600 hover:text-white'
            >
              Logout
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContentProfil;
