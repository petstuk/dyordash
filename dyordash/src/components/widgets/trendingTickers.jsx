import React, { useState, useEffect } from 'react';

const TrendingTickers = () => {
    const [trendingTickers, setTrendingTickers] = useState(() => {
        const cachedTrendingTickers = localStorage.getItem('cachedTrendingTickers');
        return cachedTrendingTickers ? JSON.parse(cachedTrendingTickers) : [];
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrendingTickers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/trending-tickers');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                localStorage.setItem('cachedTrendingTickers', JSON.stringify(data)); // Cache the data
                setTrendingTickers(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false); // Set loading to false after fetching and caching data
            }
        };
        fetchTrendingTickers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!Array.isArray(trendingTickers) || trendingTickers.length === 0) {
        console.error('Trending tickers data is not an array or is empty:', trendingTickers);
        return <div>No data available</div>;
    }

    return (
        <div className="trending-tickers">
            <table className="table">
                <tbody>
                    {trendingTickers.map((ticker, index) => (
                        <tr key={index}>
                            <td className='font-bold'>{ticker.Ticker}</td>
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

export default TrendingTickers;
