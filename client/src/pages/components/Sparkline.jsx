import React, { useEffect, useState, useRef } from "react";

export const Sparkline = ({ symbol, width, height }) => {
  if (!symbol || !width || !height) {
    throw new Error("Sparkline requires 'symbol', 'width', and 'height' props");
  }

  const [prices, setPrices] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    // Binance WebSocket stream for miniTicker
    const streamPath = `${symbol.toLowerCase()}@miniTicker`;
    const ws = new WebSocket(`wss://fstream.binance.com/stream?streams=${streamPath}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.data.c); // closing price
      setPrices((prev) => {
        const newData = [...prev, price];
        return newData.slice(-50); // keep last 50 points
      });
    };

    return () => ws.close();
  }, [symbol]);

  if (!prices.length) return null;

  const max = Math.max(...prices);
  const min = Math.min(...prices);

  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((price - min) / (max - min)) * height;
    return [x, y];
  });

  const path = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point[0]} ${point[1]}`;
    const prev = arr[i - 1];
    const midX = (prev[0] + point[0]) / 2;
    const midY = (prev[1] + point[1]) / 2;
    return `${acc} Q ${prev[0]} ${prev[1]} ${midX} ${midY}`;
  }, "");

  const lastPoint = points[points.length - 1];
  const areaPath = `${path} L ${lastPoint[0]} ${height} L 0 ${height} Z`;

  const isUp = prices[prices.length - 1] >= prices[0];
  const color = isUp ? "lime" : "red";
  const opacity = 0.3;
  const glowId = `glow-${color}`;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <filter id={glowId}>
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={color} />
        </filter>
      </defs>

      <path d={areaPath} fill={`url(#gradient)`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        filter={`url(#${glowId})`}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Sparkline;