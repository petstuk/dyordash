import React, { useState, useEffect } from 'react';

const TopCrypto = () => {
    const [topCryptoData, setTopCryptoData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopCrypto = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/top-cryptos');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setTopCryptoData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };
        fetchTopCrypto();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!Array.isArray(topCryptoData) || topCryptoData.length === 0) {
        console.error('Top cryptos data is not an array or is empty:', topCryptoData);
        return <div>No data available</div>;
    }

    return (
        <div className="top-crypto">
            <table className="table">
                <tbody>
                    {topCryptoData.map((crypto, index) => (
                        <tr key={index}>
                            <td className='font-bold'>{crypto.Name}</td>
                            <td>{crypto.Price}</td>
                            <td className={crypto["Percentage Change"].startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                                {crypto["Percentage Change"]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopCrypto;
