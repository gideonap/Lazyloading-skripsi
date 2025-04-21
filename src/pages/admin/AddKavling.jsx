import React, { useState, useEffect } from 'react';
import SidePanel from './SidePanel';
import HeaderBar from './HeaderBar';
import { toast } from 'react-toastify';
import { Button, KavlingLayout, GroundModal, NumberModal, KavlingModal, KavlingAdd } from '../../components';
import { createGround, getAllGround } from '../../services/groundService';
import { getAllSubGrounds, createSubGround } from '../../services/subGroundService';
import { createKavling, getAllKavling } from '../../services/kavlingService';

const AddKavling = () => {
    const [kavlingData, setKavlingData] = useState({});
    const [subGroundData, setSubGroundData] = useState([]);
    const [kavlings, setKavlings] = useState([]);
    const [selectedGround, setSelectedGround] = useState('');
    const [selectedNumber, setSelectedNumber] = useState('');
    const [isGroundModalOpen, setIsGroundModalOpen] = useState(false);
    const [isNumberModalOpen, setIsNumberModalOpen] = useState(false);
    const [isKavlingModalOpen, setIsKavlingModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ ground: '', groundNumber: '', kavlingNumber: '' });
    const token = localStorage.getItem('token');

    // Fetch all ground data and update state
    const fetchGroundData = async () => {
        try {
            const response = await getAllGround(token);
            const groundData = response.data.reduce((acc, ground) => {
                acc[ground.id] = ground; // Use 'id' for ground keys
                return acc;
            }, {});
            setKavlingData(groundData);
        } catch (error) {
            console.error('Error fetching ground data:', error);
            toast.error('Terjadi kesalahan saat mengambil data ground.');
        }
    };

    // Fetch sub-grounds when a ground is selected
    const fetchSubGroundData = async (groundId) => {
        try {
            const response = await getAllSubGrounds(token, groundId);
            setSubGroundData(response.data);
        } catch (error) {
            console.error('Error fetching sub-ground data:', error);
        }
    };

    // Fetch kavlings based on ground and nomorGround
    const fetchKavlings = async (ground, nomorGround) => {
        try {
            const response = await getAllKavling(token);
            
            // Log the response to inspect its structure
            console.log('Kavling API response:', response);
    
            // Log the keys of the ground and nomorGround to ensure they exist
            console.log('Ground:', ground);
            console.log('Nomor Ground:', nomorGround);
    
            // Check if the selected ground exists in the response data
            const kavlingsByGround = response.data[ground];
            if (!kavlingsByGround) {
                console.error(`Ground "${ground}" not found in response.`);
                setKavlings([]);
                return;
            }
    
            // Check if the selected nomorGround exists within the ground
            const kavlingsByNomorGround = kavlingsByGround[nomorGround];
            if (!kavlingsByNomorGround) {
                console.error(`Nomor Ground "${nomorGround}" not found for Ground "${ground}".`);
                setKavlings([]);
                return;
            }
    
            // If kavlings exist for this ground and nomorGround, flatten the rows and set the kavlings
            const kavlingsArray = kavlingsByNomorGround.flat();
            console.log('Flattened kavlings array:', kavlingsArray); // Debugging log
            setKavlings(kavlingsArray);
    
        } catch (error) {
            console.error('Error fetching kavling data:', error);
            toast.error('Terjadi kesalahan saat mengambil data kavling.');
        }
    };
    

    // Fetch ground data on component mount
    useEffect(() => {
        fetchGroundData();
    }, []);

    const handleGroundChange = (e) => {
        const selectedGroundId = e.target.value;
        const selectedGroundName = e.target.selectedOptions[0].text; // Get the ground name from the option text
    
        setSelectedGround(selectedGroundName); // Store the selected ground name
        setSelectedNumber(''); // Reset sub-ground when ground changes
        
        // Fetch sub-ground data based on selected ground (by ID)
        fetchSubGroundData(selectedGroundId);
    };
    
    const handleNumberChange = (e) => {
        const selectedSubGroundId = e.target.value; // Get the actual sub-ground ID
        const selectedNomorGround = e.target.selectedOptions[0].text; // Display name
    
        setSelectedNumber(selectedSubGroundId); // Store the actual sub-ground ID
    
        // Fetch kavlings using the actual ground and nomorGround values
        fetchKavlings(selectedGround, selectedNomorGround);
    };

    const handleAddGround = () => {
        setIsGroundModalOpen(true);
    };

    const handleAddNumber = () => {
        if (selectedGround) {
            setIsNumberModalOpen(true);
        } else {
            alert('Mohon memilih ground terlebih dahulu.');
        }
    };

    // Save the new ground and refresh ground data
    const addNewGround = async (groundData) => {
        try {
            const { groundName, image } = groundData; // Ensure correct destructuring
    
            if (!groundName || !image) {
                alert('Ground name and image are required!');
                return;
            }
    
            await createGround(token, { nama: groundName, image });
            await fetchGroundData(); // Refresh ground data
        } catch (error) {
            console.error('Error creating ground:', error);
            alert('Terjadi kesalahan saat menambahkan ground.');
        }
    };

    // Save the new sub-ground and refresh sub-ground data
    const addNewSubGround = async (numberName) => {
        try {
            // Pass the actual ground ID (selectedGround is now the ground ID)
            const groundId = Object.keys(kavlingData).find(key => kavlingData[key].nama === selectedGround);
    
            if (!groundId) {
                alert('Ground ID not found!');
                return;
            }
    
            const response = await createSubGround(token, { ground_id: groundId, nama: numberName });
            
            if (response.data) {
                // Successfully created sub-ground
                await fetchSubGroundData(groundId); // Refresh sub-ground data
            } else {
                console.error('Failed to create sub-ground:', response.message);
                alert('Gagal membuat sub-ground.');
            }
    
        } catch (error) {
            console.error('Error creating sub-ground:', error);
            alert('Terjadi kesalahan saat menambahkan nomor ground.');
        }
    };

    // Save the new kavling and refresh kavling data
    const saveNewKavling = async (kavlingDetails) => {
        try {
            const payload = {
                baris: kavlingDetails.baris,
                kolom: kavlingDetails.kolom,
                harga: kavlingDetails.harga,
                nama: kavlingDetails.nama,
                sub_ground_id: selectedNumber, // Now this will be the correct sub-ground ID
                status: kavlingDetails.status,
            };
    
            // Log the payload to inspect it
            console.log('Creating Kavling Payload:', payload);
    
            const response = await createKavling(token, payload);
            await fetchKavlings(selectedGround, selectedNumber); // Refresh kavlings after adding a new one
        } catch (error) {
            console.error('Error creating kavling:', error);
            alert('Terjadi kesalahan saat menambahkan kavling.');
        }
        setIsKavlingModalOpen(false);
    };
    

    const handleAddKavling = (rowIndex) => {
        if (selectedGround && selectedNumber) {
            const groundName = kavlingData[selectedGround]?.nama;
            const subGroundName = subGroundData.find(sub => sub.id === selectedNumber)?.nama;
    
            const kavlingNumber = rowIndex === null ? (subGroundName ? subGroundName.length + 1 : 1) : rowIndex + 1;
    
            setModalData({
                ground: groundName,
                groundNumber: subGroundName || '',
                kavlingNumber, 
            });
    
            setIsKavlingModalOpen(true);
        } else {
            alert('Mohon memilih ground atau nomor ground terlebih dahulu.');
        }
    };

    return (
        <div className='w-screen h-screen p-10'>
            <div className='flex flex-row gap-10 h-full'>
                <SidePanel />
                <div className='flex flex-col py-3 w-full gap-8'>
                    <HeaderBar title='Reservasi' searchTerm='' onSearchChange={() => {}} username='Admin' />

                    <div className='flex flex-col gap-10'>
                        <div className='flex flex-col gap-3'>
                            <div className='flex flex-row w-full justify-between items-center'>
                                <span className='font-semibold'>Tambah Kavling</span>
                            </div>
                            <div className='w-full bg-secondary h-[1px] mt-2' />

                            <form className='flex flex-col gap-4 text-xs'>
                                <div className='flex flex-col gap-2 w-full'>
                                    <label className="font-semibold">Ground</label>
                                    <div className='flex flex-row gap-5 items-center'>
                                        <select
                                            value={Object.keys(kavlingData).find(key => kavlingData[key].nama === selectedGround) || ''}
                                            onChange={handleGroundChange}
                                            className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2"
                                            required
                                        >
                                            <option value="">Pilih Ground</option>
                                            {Object.keys(kavlingData).map((groundId) => (
                                                <option key={groundId} value={groundId}>{kavlingData[groundId].nama}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleAddGround}
                                            className='px-3 py-2 w-40 shadow-md rounded-md bg-accent text-primary hover:bg-hover-green transition-colors duration-300'
                                            type='button'
                                        >
                                            Tambah Ground
                                        </button>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2 w-full'>
                                    <label className="font-semibold">Nomor Ground</label>
                                    <div className='flex flex-row gap-5 items-center'>
                                        <select
                                            value={subGroundData.find(sub => sub.nama === selectedNumber)?.id || ''}
                                            onChange={handleNumberChange}
                                            className="block px-3 py-2 w-full rounded-md ring-1 ring-inactive-gray-2"
                                            required
                                        >
                                            <option value="">Pilih Nomor Ground</option>
                                            {subGroundData.map((subGround) => (
                                                <option key={subGround.id} value={subGround.id}>{subGround.nama}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleAddNumber}
                                            className='px-3 py-2 w-56 shadow-md rounded-md bg-accent text-primary hover:bg-hover-green transition-colors duration-300'
                                            type='button'
                                        >
                                            Tambah Nomor Ground
                                        </button>
                                    </div>
                                </div>

                                {/* Display Kavling Layout */}
                                <KavlingAdd
                                    kavlings={kavlings}
                                    onAddKavling={handleAddKavling}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {isGroundModalOpen && (
                <GroundModal
                    onClose={() => setIsGroundModalOpen(false)}
                    onSave={(groundData) => {
                        addNewGround(groundData);
                        setIsGroundModalOpen(false);
                    }}
                />
            )}

            {isNumberModalOpen && (
                <NumberModal
                    selectedGround={kavlingData[selectedGround]?.nama}
                    onClose={() => setIsNumberModalOpen(false)}
                    onSave={(numberName) => {
                        addNewSubGround(numberName);
                        setIsNumberModalOpen(false);
                    }}
                />
            )}

            {isKavlingModalOpen && (
                <KavlingModal
                    ground={modalData.ground}
                    groundNumber={modalData.groundNumber}
                    kavlingNumber={modalData.kavlingNumber}
                    onClose={() => setIsKavlingModalOpen(false)}
                    onSave={saveNewKavling}
                />
            )}
        </div>
    );
};

export default AddKavling;
