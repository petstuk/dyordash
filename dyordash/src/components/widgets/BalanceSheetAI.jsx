import React, { useState, useEffect } from 'react';

const BalanceSheetSummaryWidget = ({ symbol }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchBalanceSheetSummary = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/balance-sheet-summary/${symbol}`, { signal });
        if (!response.ok) {
          throw new Error('Could not fetch balance sheet summary.');
        }
        const data = await response.json();
        setSummary(data.summary || '');  // Adjust the key according to your API response
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalanceSheetSummary();

    return () => {
      controller.abort();
    };
  }, [symbol]);

  if (isLoading) {
    return <div>Loading summary...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Split the summary into paragraphs at each double newline character
  const summaryParagraphs = summary.split('\n\n').filter(paragraph => paragraph.trim() !== '');

  return (
    <div style={{ padding: '20px', margin: '20px 0' }}>
      {summaryParagraphs.map((paragraph, index) => (
        <p key={index} style={{ marginBottom: '16px' }}>{paragraph}</p>
      ))}
    </div>
  );
};

export default BalanceSheetSummaryWidget;
