import React, {useState, useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {getMyUserInfo} from "../services/userService.js";
import {toast} from "react-toastify";

const Navbar = () => {
    const [navbarBg, setNavbarBg] = useState('bg-transparent');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setNavbarBg('fixed bg-secondary shadow-md');
            } else {
                setNavbarBg('fixed bg-transparent');
            }
        };


        if (location.pathname === '/') {
            window.addEventListener('scroll', handleScroll);
            handleScroll();
        } else {
            setNavbarBg('bg-secondary shadow-md mb-14');
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (isMenuOpen && location.pathname !== '/') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen, location.pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsMenuOpen(false);
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className={`px-6 py-4 lg:px-28 lg:py-1 w-full z-50 transition-colors duration-300 ${navbarBg}`}>
            <div className='flex flex-col lg:flex-row lg:justify-between text-primary lg:items-center'>
                <div className='flex flex-row justify-between'>
                    <Link to="/">
                        <img src="/LogoPesonaBedengan.svg" alt="logo" className='w-14 lg:w-20'/>
                    </Link>
                    <button
                        className='text-primary lg:hidden focus:outline-none'
                        onClick={toggleMenu}
                    >
                        <svg
                            className='w-6 h-6'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                            />
                        </svg>
                    </button>
                </div>
                <div
                    className={`flex-col w-72 lg:w-fit lg:flex lg:flex-row lg:items-center lg:static absolute top-[3.8rem] right-0 bg-secondary lg:bg-transparent transition-all duration-500 ease-in-out ${isMenuOpen ? 'flex h-screen z-40' : 'hidden'} lg:flex`}>
                    <div className="lg:hidden px-8 py-5">
                        <NavbarUserInfo />
                    </div>
                    <div className='lg:hidden block h-[1px] w-full bg-primary rounded-full opacity-65'/>
                    <div className='flex flex-col gap-4 px-8 py-5 lg:flex-row lg:justify-evenly lg:gap-24'>
                        <Link className='lg:font-semibold transition-colors hover:text-accent duration-300'
                              to="/">Beranda</Link>
                        <Link className='lg:font-semibold transition-colors hover:text-accent duration-300'
                              to="/reservasi">Reservasi</Link>
                        <Link className='lg:font-semibold transition-colors hover:text-accent duration-300'
                              to="/syarat-dan-ketentuan">Syarat & Ketentuan</Link>
                        <div className='flex flex-row gap-4 lg:hidden'>
                            {localStorage.getItem('token') == null ? (
                                <>
                                    <Link
                                        className='px-5 py-1 text-sm font-semibold bg-accent rounded-md transition-colors hover:bg-hover-green duration-300'
                                        to='/masuk'>Masuk</Link>
                                    <Link
                                        className='px-5 py-1 text-sm text-accent font-semibold rounded-md border-[1.5px] border-accent transition-colors hover:bg-accent hover:text-primary duration-300'
                                        to='/daftar'>Daftar</Link>
                                </>
                            ) : null }
                        </div>
                    </div>
                </div>
                <div className='hidden lg:block'>
                {/* Only display on large screens */}
                    {localStorage.getItem('token') == null ? (
                        <Link
                        className='px-5 py-1 text-sm font-semibold bg-accent rounded-md transition-colors hover:bg-hover-green duration-300'
                        to='/masuk'
                        >
                        Masuk
                        </Link>
                    ) : (
                        <NavbarUserInfo />
                    )}
                </div>
            </div>
        </div>
    )
}

const NavbarUserInfo = () => {
    const [user, setUser] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('token') != null) {
            getMyUserInfo(localStorage.getItem('token'))
                .then((response) => {
                    setUser(response.data)
                })
                .catch((e) => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('userData')
                    toast.error(e.message)
                    window.location.reload();
                })
        }
    }, [])

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const getFirstName = (name) => {
        return name ? name.split(' ')[0] : '';
    };

    return (
      <div className="relative">
      {/* Username and dropdown toggle */}
        <div>
            <Link className='hidden lg:flex text-base font-semibold' to={'/profil'}>{getFirstName(user.name)}</Link>
        </div>
        <div
            onClick={toggleDropdown}
            className="flex flex-row justify-between lg:hidden items-center cursor-pointer"
        >
            <span className="font-semibold text-base">{getFirstName(user.name)}</span>
            <svg
            className={`w-4 h-4 ml-2 transition-transform ${
                isDropdownOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
            />
            </svg>
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="mt-1 w-full">
            <ul className="flex flex-col gap-4 py-2 w-full">
              <li className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                <Link to="/profil">Profil</Link>
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                <Link to="/profil/pesanan">Pesanan</Link>
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                <Link to="/profil/riwayat">Riwayat Pesanan</Link>
              </li>
            </ul>
          </div>
        )}
    </div>
        
    )
}
export default Navbar