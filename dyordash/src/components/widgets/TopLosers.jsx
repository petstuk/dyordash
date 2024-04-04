import React, { useState, useEffect } from 'react';

const TopLosers = () => {
    const [topLosersData, setTopLosersData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopLosers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/top-losers');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setTopLosersData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };
        fetchTopLosers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!Array.isArray(topLosersData) || topLosersData.length === 0) {
        console.error('Top losers data is not an array or is empty:', topLosersData);
        return <div>No data available</div>;
    }

    return (
        <div className="top-losers">
            <table className="table">
                <tbody>
                    {topLosersData.map((loser, index) => (
                        <tr key={index}>
                            <td className='font-bold'>{loser.Name}</td>
                            <td>{loser.Price}</td>
                            <td className={parseFloat(loser["Percentage Change"]) >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {loser["Percentage Change"]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopLosers;
