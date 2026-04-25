import { useEffect, useRef, useState } from "react";

const ModalSparkline = ({ width, height, data, priceChangePercent }) => {
  const containerRef = useRef(null);
  const [svgWidth, setSvgWidth] = useState(300);

  // AUTO RESIZE BASED ON CONTAINER
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setSvgWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const prices = Array.isArray(data) ? data : [];

  if (!prices || prices.length < 2) {
    return <div ref={containerRef} style={{ width: "100%", height }} />;
  }

  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;

  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * svgWidth;
    const y = height - ((price - min) / range) * height;
    return [x, y];
  });

  const path = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point[0]} ${point[1]}`;
    return `${acc} L ${point[0]} ${point[1]}`;
  }, "");

  const lastPoint = points[points.length - 1];

  const areaPath = `${path} L ${lastPoint[0]} ${height} L 0 ${height} Z`;

  const isUp =
    typeof priceChangePercent === "number"
      ? priceChangePercent >= 0
      : prices[prices.length - 1] >= prices[0];

  const color = isUp ? "#25c866" : "#ff4d4f";

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        overflow: "hidden",
      }}
    >
      <svg
        width={svgWidth}
        height={height}
        style={{
          display: "block",
        }}
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#gradient)" />

        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default ModalSparkline;