import React, { useEffect } from 'react';
import { AiOutlineFileExclamation } from "react-icons/ai"; // Adjusted to use a more suitable icon
import { Link } from 'react-router-dom'; // Import Link component

const NoIncomeStatement = ({ isOpen, title, message, onClose, symbol }) => { // Include symbol prop
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 32 || event.keyCode === 27) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    }}>
      <div style={{
        padding: 20,
        background: '#fff',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.5',
      }}>
        <AiOutlineFileExclamation style={{ color: 'rgb(75, 192, 192)', fontSize: '48px', marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '20px', lineHeight: '1.3' }} className='font-bold'>{title}</h2>
        <p className='text-center' style={{ marginBottom: '20px', lineHeight: '1.6', width: '300px' }}>{message}</p>
        {/* No visible button, directly use Link component */}
        <Link
  to={`/ticker-overview/${symbol}`}
  style={{
    marginTop: '10px',
    color: 'inherit', // Set the text color to inherit from the parent
    textDecoration: 'none', // Remove underline
  }}
>
  Go Back
</Link>
      </div>
    </div>
  );
};

export default NoIncomeStatement;
