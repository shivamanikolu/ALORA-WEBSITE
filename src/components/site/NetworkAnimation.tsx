import { useEffect, useRef, useState } from "react";

const SATELLITES = [
  { label: "Revenue", angle: 210 },
  { label: "Patients", angle: 330 },
  { label: "Appointments", angle: 45 },
  { label: "Trust", angle: 105 },
  { label: "Growth", angle: 150 },
];

// edges between satellite indices: pentagon + 2 diagonals
const SAT_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3],
];

function polar(angleDeg: number, radius: number, cx: number, cy: number) {
  // angle measured from 12 o'clock, clockwise
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * radius, y: cy + Math.sin(rad) * radius };
}

export function NetworkAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(420);

  useEffect(() => {
    const update = () => {
      if (ref.current) setSize(ref.current.clientWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.41;
  const centerNodeR = 54; // 108/2
  const satNodeR = 36; // 72/2

  const satPositions = SATELLITES.map((s) => polar(s.angle, radius, cx, cy));

  // Compute line endpoints trimmed by node radii so lines don't overlap circles
  function trimLine(x1: number, y1: number, x2: number, y2: number, r1: number, r2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    return {
      x1: x1 + ux * r1,
      y1: y1 + uy * r1,
      x2: x2 - ux * r2,
      y2: y2 - uy * r2,
    };
  }

  return (
    <div
      ref={ref}
      className="relative w-full mx-auto"
      style={{ aspectRatio: "1 / 1", maxWidth: 480 }}
    >
      {/* background glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          background: "radial-gradient(circle, rgba(130,100,220,0.25), transparent 70%)",
          animation: "hubPulse 3.5s ease-in-out infinite",
        }}
      />
      {/* dashed rings */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: size * 0.88,
          height: size * 0.88,
          border: "1.5px dashed rgba(130,100,220,0.22)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: size * 0.62,
          height: size * 0.62,
          border: "1.5px dashed rgba(130,100,220,0.22)",
        }}
      />

      {/* SVG lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* center -> satellites */}
        {satPositions.map((p, i) => {
          const seg = trimLine(cx, cy, p.x, p.y, centerNodeR, satNodeR);
          const reverse = i % 2 === 1;
          return (
            <line
              key={`c-${i}`}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="rgba(100,80,220,0.55)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              style={{
                animation: `${reverse ? "dashMoveReverse" : "dashMove"} 1.4s linear infinite`,
              }}
            />
          );
        })}
        {/* satellite-to-satellite */}
        {SAT_EDGES.map(([a, b], i) => {
          const pa = satPositions[a];
          const pb = satPositions[b];
          const seg = trimLine(pa.x, pa.y, pb.x, pb.y, satNodeR, satNodeR);
          return (
            <line
              key={`s-${i}`}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="rgba(100,80,220,0.28)"
              strokeWidth={1.2}
              strokeDasharray="5 5"
              style={{ animation: "dashMove 1.4s linear infinite" }}
            />
          );
        })}
      </svg>

      {/* center node */}
      <div
        className="absolute"
        style={{
          left: cx,
          top: cy,
          transform: "translate(-50%, -50%)",
          width: 108,
          height: 108,
          borderRadius: "50%",
          background: "#ffffff",
          border: "2.5px solid #6040c8",
          boxShadow: "0 0 0 12px rgba(96,64,200,0.10), 0 0 40px rgba(96,64,200,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: "0.12em", color: "#888", textTransform: "uppercase", fontWeight: 600 }}>YOUR</span>
        <span style={{ fontSize: 13.5, color: "#111", fontWeight: 800, letterSpacing: "0.04em" }}>CLINIC</span>
      </div>

      {/* satellite nodes */}
      {satPositions.map((p, i) => (
        <div
          key={SATELLITES[i].label}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#ffffff",
            border: "1.5px solid rgba(140,120,200,0.35)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            fontWeight: 700,
            fontSize: 10.5,
            textAlign: "center",
            padding: "0 6px",
          }}
        >
          {SATELLITES[i].label}
        </div>
      ))}

      {/* floating red text */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${52}%`,
          top: `${64}%`,
          color: "#e03030",
          fontSize: 11.5,
          fontWeight: 500,
          animation: "slideDownFade 3.2s ease-in-out infinite",
        }}
      >
        Losing
      </div>
    </div>
  );
}
