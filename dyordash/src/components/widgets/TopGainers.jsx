import React, { useState, useEffect } from 'react';

const TopGainers = () => {
    const [topGainersData, setTopGainersData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopGainers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/top-gainers');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setTopGainersData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };
        fetchTopGainers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!Array.isArray(topGainersData) || topGainersData.length === 0) {
        console.error('Top gainers data is not an array or is empty:', topGainersData);
        return <div>No data available</div>;
    }

    return (
        <div className="top-gainers">
            <table className="table">
                <tbody>
                    {topGainersData.map((gainer, index) => (
                        <tr key={index}>
                            <td className='font-bold'>{gainer.Name}</td>
                            <td>{gainer.Price}</td>
                            <td className={parseFloat(gainer["Percentage Change"]) >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {gainer["Percentage Change"]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopGainers;
