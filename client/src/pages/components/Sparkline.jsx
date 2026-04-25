import { useEffect, useState } from "react";

export const Sparkline = ({
  width,
  height,
  priceChangePercent,
  data, // live data array
}) => {
  if (!width || !height) {
    throw new Error("Sparkline requires 'width' and 'height'");
  }

  const [prices, setPrices] = useState(Array.isArray(data) ? data.slice(-50) : []);

  //Update prices when `data` changes
  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      setPrices(data.slice(-50));
    }
  }, [data]);

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

  const isUp =
    typeof priceChangePercent === "number"
      ? priceChangePercent >= 0
      : prices[prices.length - 1] >= prices[0];

  const color = isUp ? "lime" : "red";

  const uniqueId = `sparkline-${isUp}-${prices.length}`;
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