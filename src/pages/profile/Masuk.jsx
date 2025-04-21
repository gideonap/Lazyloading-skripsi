import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Navbar, Footer, Button} from '../../components/index'
import {loginUser, getMyUserInfo } from '../../services/userService'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Masuk = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (error != null) {
            toast.error(error)
        }
    }, [error])

    const handleLogin = async (e) => {
        e.preventDefault();
    
        if (email === '' || password === '') {
            toast.error('Email atau password tidak boleh kosong');
            return;
        }
    
        try {
            const loginResponse = await loginUser(email, password);
            const token = loginResponse?.data?.token || loginResponse.data;
    
            localStorage.setItem('token', token);
    
            const userResponse = await getMyUserInfo(token);
            const userData = userResponse?.data?.data || userResponse?.data;
    
            localStorage.setItem('userData', JSON.stringify({
                name: userData.name,
                role: userData.role,
            }));
    
            if (userData.role === 'admin') {
                navigate('/dashboard');
                toast.success("Login berhasil sebagai admin");
            } else {
                navigate('/');
                toast.success("Login berhasil");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login gagal, silakan coba lagi';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div>
            <Navbar/>
            <div className='flex flex-row gap-7 items-center justify-center w-full'>
                <div className='flex flex-col w-fit gap-4'>
                    <div className='flex flex-col items-center'>
                        <img src="/LogoPesonaBedengan.png" alt="" className='lg:hidden mb-5'/>
                        <h2 className='font-semibold'>Masuk</h2>
                        <p className='text-sm font-semibold text-center w-72 lg:w-fit'>Selamat datang kembali di Bumi
                            Perkemahan Bedengan </p>
                    </div>

                    <form onSubmit={handleLogin} className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-1'>
                            <label className='font-semibold'>Email</label>
                            <input
                                type="email"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray sm:text-sm"
                                
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='font-semibold'>Kata Sandi</label>
                            <input
                                type="password"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray sm:text-sm"
                                
                            />
                        </div>
                        <Button type='submit' className='w-full'>Masuk</Button>
                    </form>

                    <div className='flex flex-col items-center'>
                        <div className='flex flex-row gap-1'>
                            <p className='text-sm'>Belum punya akun?</p>
                            <Link to='/daftar'
                                  className='text-sm text-blue-400 hover:text-blue-600 transition-colors duration-300'>Daftar</Link>
                        </div>
                    </div>
                </div>
                <img src="/images/background.JPG" alt=""
                     className='hidden lg:block rounded-md w-[33rem] h-[40rem] object-cover'/>
            </div>
            <Footer className='mt-20'/>
        </div>
    )
}

export default Masuk