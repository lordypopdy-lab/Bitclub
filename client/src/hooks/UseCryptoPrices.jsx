import React, { useEffect, useState } from 'react';

const useCryptoPrices = () => {
  const [prices, setPrices] = useState({}); // Keyed by symbol

  useEffect(() => {
    const socket = new WebSocket('wss://bitclub.onrender.com');

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const symbol = msg.symbol.toUpperCase();

      console.log(symbol)

      setPrices(prev => ({
        ...prev,
        [symbol]: msg,
      }));
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📊 Live Binance Prices</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(prices).map(([symbol, item]) => (
          <li key={symbol}>
          <strong>{item.symbol.toUpperCase()}</strong> —{' '}
          {item.type === 'trade'
            ? `Trade: ${Number(item.price).toFixed(2)}`
            : `Mark Price: ${Number(item.markPrice).toFixed(2)}`}
        </li>
        
        ))}
      </ul>
    </div>
  );
};

export default useCryptoPrices;
