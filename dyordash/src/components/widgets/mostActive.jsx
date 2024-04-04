import React, { useState, useEffect } from 'react';

const MostActive = () => {
    const [mostActiveData, setMostActiveData] = useState(() => {
        const cachedMostActive = localStorage.getItem('cachedMostActive');
        return cachedMostActive ? JSON.parse(cachedMostActive) : [];
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMostActive = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/most-active');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                localStorage.setItem('cachedMostActive', JSON.stringify(data)); // Cache the data
                setMostActiveData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };
        fetchMostActive();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!Array.isArray(mostActiveData) || mostActiveData.length === 0) {
        console.error('Most active tickers data is not an array or is empty:', mostActiveData);
        return <div>No data available</div>;
    }

    return (
        <div className="most-active">
            <table className="table">
                <tbody>
                    {mostActiveData.map((ticker, index) => (
                        <tr key={index}>
                            <td className='font-bold'>{ticker.Symbol}</td>
                            <td>{ticker.Price}</td>
                            <td className={parseFloat(ticker["Percentage Change"]) >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {ticker["Percentage Change"]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MostActive;
