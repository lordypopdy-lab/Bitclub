import { useEffect, useState, useRef } from "react";

export const Sparkline = ({
  symbol,
  width,
  height,
  priceChangePercent,
  initialData, // 👈 external fallback (CoinGecko / cache)
}) => {
  if (!symbol || !width || !height) {
    throw new Error("Sparkline requires 'symbol', 'width', and 'height'");
  }

  const [prices, setPrices] = useState(initialData || []);
  const wsRef = useRef(null);

  // ✅ Sync external data (CoinGecko / cache)
  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length) {
      setPrices(initialData.slice(-50));
    }
  }, [initialData]);

  // ✅ Binance WebSocket (takes over)
  useEffect(() => {
    const streamPath = `${symbol.toLowerCase()}@miniTicker`;
    const ws = new WebSocket(
      `wss://fstream.binance.com/stream?streams=${streamPath}`
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data?.data?.c);

      if (!isNaN(price)) {
        setPrices((prev) => [...prev, price].slice(-50));
      }
    };

    ws.onerror = () => {
      ws.close(); // ❌ no fallback here (external handles it)
    };

    return () => ws.close();
  }, [symbol]);

  if (!prices || prices.length < 2) return null;

  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;

  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((price - min) / range) * height;
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

  // ✅ SAME SOURCE AS % CHANGE (NO DESYNC)
  const isUp =
    typeof priceChangePercent === "number"
      ? priceChangePercent >= 0
      : prices[prices.length - 1] >= prices[0];

  const color = isUp ? "lime" : "red";

  // ✅ FIX glow + gradient sync issue
  const uniqueId = `${symbol}-${isUp}-${prices.length}`;
  const gradientId = `gradient-${uniqueId}`;
  const glowId = `glow-${uniqueId}`;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>

        <filter id={glowId}>
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={color} />
        </filter>
      </defs>

      <path d={areaPath} fill={`url(#${gradientId})`} />

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