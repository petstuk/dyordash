import React from 'react';
import { GoRocket } from 'react-icons/go'; // Import the GoRocket icon

const LoadingIcon = ({ progress }) => {
  const radius = 50; // Radius of the circle
  const stroke = 4; // Thickness of the stroke
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Loading...</span> 
        <GoRocket fontSize="24px" />
      </div>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="rgba(75, 192, 192)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text x="50%" y="50%" textAnchor="middle" stroke="#51c5cf" dy=".3em">{`${progress}%`}</text>
      </svg>
    </div>
  );
};

export default LoadingIcon;
