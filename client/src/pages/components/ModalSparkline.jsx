import { useEffect, useState } from "react";

const ModalSparkline = ({ width, height, data, priceChangePercent }) => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setPrices(data); // ✅ keep FULL dataset (no slicing)
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

  const color = isUp ? "#25c866" : "red";

  return (
    <svg width={width} height={height}>
      <path d={areaPath} fill={`${color}22`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ModalSparkline;