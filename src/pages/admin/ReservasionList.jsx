import React, { useEffect, useState } from 'react';
import { getSubGroundById } from '../../services/subGroundService';
import { getGroundById } from '../../services/groundService';

const ReservasionList = ({ reservations }) => {
  const [kavlingNamesList, setKavlingNamesList] = useState({}); // Store kavling names for each reservation

  useEffect(() => {
    const fetchKavlingData = async () => {
      try {
        const token = localStorage.getItem('token');
        const fetchedNames = {};

        await Promise.all(
          reservations.map(async (reservation) => {
            // Iterate through each kavling in the kavlingDetails array
            const kavlingNames = await Promise.all(
              reservation.kavlingDetails
                .filter(kavling => kavling.id && kavling.nama) // Filter out empty or invalid kavlings
                .map(async (kavling) => {
                  try {
                    // Fetch sub-ground and ground details
                    const subGroundResponse = await getSubGroundById(token, kavling.sub_ground_id);
                    const groundResponse = await getGroundById(token, subGroundResponse.data.ground_id);

                    // Construct the full kavling name as {groundName}{subGroundName}.{kavlingName}
                    return `${groundResponse.data.nama}${subGroundResponse.data.nama}.${kavling.nama}`;
                  } catch (error) {
                    console.error(`Error fetching data for kavling_id ${kavling.id}:`, error);
                    return null; // Return null for failed fetches
                  }
                })
            );
            // Join all valid kavling names with commas and store them for this reservation
            fetchedNames[reservation.id] = kavlingNames.filter(name => name !== null).join(', ');
          })
        );

        setKavlingNamesList(fetchedNames);
      } catch (error) {
        console.error('Error fetching kavling data:', error);
      }
    };

    if (reservations.length > 0) {
      fetchKavlingData();
    }
  }, [reservations]);

  const formatStatus = (status) => {
    if (status === 'menunggu_pembayaran') {
      return 'Pembayaran';
    } else if (status === 'menunggu_verifikasi') {
      return 'Verifikasi';
    } else if (status === 'verifikasi') {
      return 'Berlangsung';
    }
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className='flex flex-col gap-1'>
      {reservations.map((reservation, index) => {
        const normalizedStatus = reservation.status.toLowerCase().trim();
        const kavlingName = kavlingNamesList[reservation.id] || 'Loading...';

        return (
          <div className='flex flex-row text-sm items-center' key={reservation.id}>
            <span className='w-14 max-w-14'>{index + 1}</span>
            <span className='w-32 max-w-32'>{reservation.kode}</span>
            <span className='w-56 max-w-56'>{reservation.nama}</span>
            <span className='w-28 max-w-28'>{reservation.tglMasuk}</span>
            <span className='w-28 max-w-28'>{reservation.tglKeluar}</span>
            <span className='w-20 max-w-20'>{kavlingName || ''}</span> {/* Display concatenated kavling names or nothing */}
            <span className='flex w-32 max-w-32 items-center justify-center'>
              <div className={`px-3 py-1 rounded-full ${reservation.jenis === 'online' ? 'bg-accent-2' : 'bg-accent-3'}`}>
                {reservation.jenis}
              </div>
            </span>
            <span className='flex flex-row items-center gap-3 w-32 max-w-32'>
              <div
                className={`w-2 h-2 rounded-full ${
                  normalizedStatus === 'ditolak'
                    ? 'bg-ditolak'
                    : normalizedStatus === 'verifikasi'
                    ? 'bg-berlangsung'
                    : normalizedStatus === 'selesai'
                    ? 'bg-selesai'
                    : normalizedStatus === 'menunggu_pembayaran'
                    ? 'bg-menunggu'
                    : normalizedStatus === 'menunggu_verifikasi'
                    ? 'bg-menunggu'
                    : ''
                }`}
              />
              {formatStatus(reservation.status)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ReservasionList;
