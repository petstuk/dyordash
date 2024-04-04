import React, { useEffect } from 'react';
import { useTicker } from './routing/TickerContext';
import NasdaqChart from './widgets/NASDAQChart';
import SP500Chart from './widgets/SP500Chart';
import FTSE100Chart from './widgets/FTSE100Chart';
import ColumnRotatorApp from './effects/ColumnRotator';
import { GoRocket } from "react-icons/go";


export default function Layout() {
    const { setCurrentTicker } = useTicker(); // Use the context to access the setCurrentTicker function

    // Reset the ticker when the component mounts
    useEffect(() => {
        setCurrentTicker(''); // Reset the ticker to 'nothing'
    }, [setCurrentTicker]); // Include setCurrentTicker in the dependency array

    return (
        <div className="App">
            <div className='py-4'>
                <h1 className="text-center gap-2 flex justify-center items-center text-neutral-800 py-3 font-bold" style={{ fontSize: '20px', }}>mainDash <GoRocket className="text-neutral-800" /></h1>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-100 p-4 shadow rounded-lg">
                    <h1 className="text-center">S&P 500</h1>
                    <SP500Chart />
                </div>
                <div className="bg-gray-100 p-4 shadow rounded-lg">
                    <h1 className="text-center">NASDAQ 100</h1>
                    <NasdaqChart />
                </div>
                <div className="bg-gray-100 p-4 shadow rounded-lg">
                    <h1 className="text-center">FTSE 100</h1>
                    <FTSE100Chart />
                </div>
            </div>
            <div className="bg-gray-100 p-4 shadow rounded-lg">
                <ColumnRotatorApp />
            </div>
        </div>
    );
}
