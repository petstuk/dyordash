import React, { useState, useEffect } from 'react';

const CashFlowView = ({ symbol }) => {
    const [keyPoints, setKeyPoints] = useState({ strengths: '', weaknesses: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCashFlow = async () => {
            try {
                setLoading(true); // Set loading state to true before fetching data

                const response = await fetch(`http://127.0.0.1:8000/cash-flow/${symbol}`);
                if (!response.ok) {
                    throw new Error('No cash flow data available');
                }
                const data = await response.json();
                if (!data || !data.summary) {
                    throw new Error('No cash flow data available');
                }
                processSummary(data.summary);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); // Set loading state to false after fetching data
            }
        };

        if (symbol) {
            fetchCashFlow(); // Only fetch data if symbol is provided
        }
    }, [symbol]); // Only depend on symbol

    const processSummary = (summaryText) => {
        const strengthStartIndex = summaryText.indexOf("Main Strength:");
        const weaknessStartIndex = summaryText.indexOf("Main Weakness:");
        
        let strengths = '', weaknesses = '';
        if (strengthStartIndex !== -1 && weaknessStartIndex !== -1) {
            strengths = summaryText.substring(strengthStartIndex + "Main Strength:".length, weaknessStartIndex).trim();
            weaknesses = summaryText.substring(weaknessStartIndex + "Main Weakness:".length).trim();
        } else if (strengthStartIndex !== -1) {
            strengths = summaryText.substring(strengthStartIndex + "Main Strength:".length).trim();
        } else if (weaknessStartIndex !== -1) {
            weaknesses = summaryText.substring(weaknessStartIndex + "Main Weakness:".length).trim();
        }
        
        if (strengths || weaknesses) {
            setKeyPoints({ strengths, weaknesses });
            setError(null); // Reset error if data is successfully fetched
        } else {
            setError('No cash flow data available');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg" style={{ height: '100%' }}>
            <h2 className="text-xl font-bold mb-4">Cash Flow Highlights for {symbol.toUpperCase()}</h2>
            {loading ? (
                <div className="text-gray-700 text-sm flex justify-center items-center h-full">Loading...</div>
            ) : (
                <>
                    {error ? (
                        <div className="py-20">
                            <div className="text-sm flex justify-center items-center">
                                {error === 'Failed to fetch cash flow data' ? 'Failed to fetch cash flow data' : 'No cash flow data available'}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-700 text-sm">
                            {keyPoints.strengths && (
                                <>
                                    <h3 className="font-semibold">Strength</h3>
                                    <p className="pl-5 mb-4">{keyPoints.strengths}</p>
                                </>
                            )}
                            {keyPoints.weaknesses && (
                                <>
                                    <h3 className="font-semibold">Concern</h3>
                                    <p className="pl-5">{keyPoints.weaknesses}</p>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CashFlowView;
