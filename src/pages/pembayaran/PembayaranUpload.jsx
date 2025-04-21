import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar, Footer } from '../../components';
import { getInvoiceReservasiById } from '../../services/invoiceService';
import InformasiPembayaran from './InformasiPembayaran';
import UnggahBuktiPembayaran from './UnggahBuktiPembayaran';
import UnggahBuktiPembayaranKelompok from './UnggahBuktiPembayaranKelompok';

const PembayaranUpload = () => {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [currentStep, setCurrentStep] = useState('informasi'); // 'informasi' or 'unggah'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getInvoiceReservasiById(token, id);
        setInvoiceData(response.data);
        console.log('Invoice Data:', response.data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoiceData();
    } else {
      console.error('No ID provided in URL');
    }
  }, [id]);

  const handleNextStep = () => {
    setCurrentStep('unggah');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className='content'>
        {invoiceData && (
          <>
            {currentStep === 'informasi' ? (
              <InformasiPembayaran total={invoiceData.jumlah} onNext={handleNextStep} />
            ) : (
              // Render the appropriate upload component based on jenis_pengunjung
              invoiceData.jenis_pengunjung === 'individu' ? (
                <UnggahBuktiPembayaran invoiceId={id} />
              ) : (
                <UnggahBuktiPembayaranKelompok invoiceId={id} />
              )
            )}
          </>
        )}
      </div>
      <Footer className='mt-20' />
    </div>
  );
};

export default PembayaranUpload;
