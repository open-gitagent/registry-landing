/**
 * Deterministic abstract banner generator.
 * Produces a unique, clean, minimal pattern per agent name.
 * Uses brand colors from the landing page palette.
 */

interface Props {
  name: string;
  author: string;
  className?: string;
  width?: number;
  height?: number;
}

// Simple deterministic hash from string
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Seeded pseudo-random number generator (mulberry32)
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Brand-derived palette — warm, muted, parchment tones
const PALETTES = [
  ["#8B6F5E", "#A68B7B", "#C4A882", "#D4C4A8", "#E8DDD0"],  // warm brown
  ["#7A5C4F", "#9E8070", "#B89E8A", "#D2BFA8", "#E5D8CA"],  // clay
  ["#6B5B4E", "#8D7B6A", "#AD9C88", "#C9BAA6", "#DED3C4"],  // earth
  ["#7E6355", "#A08476", "#BEA48E", "#D6C4AC", "#EAE0D2"],  // sienna
  ["#6E5A50", "#917A6C", "#B09A88", "#CCB8A4", "#E2D6C8"],  // dusty rose
];

export function GeneratedBanner({ name, author, className = "", width = 1200, height = 630 }: Props) {
  const seed = hash(`${author}/${name}`);
  const rand = seededRandom(seed);

  const paletteIndex = seed % PALETTES.length;
  const colors = PALETTES[paletteIndex];

  // Background
  const bgColor = "#EDE6DA";

  // Generate shapes
  const shapes: JSX.Element[] = [];

  // Large soft circles (3-5)
  const circleCount = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < circleCount; i++) {
    const cx = rand() * width;
    const cy = rand() * height;
    const r = 80 + rand() * 200;
    const color = colors[Math.floor(rand() * colors.length)];
    const opacity = 0.08 + rand() * 0.12;
    shapes.push(
      <circle key={`c${i}`} cx={cx} cy={cy} r={r} fill={color} opacity={opacity} />
    );
  }

  // Thin flowing lines (4-7)
  const lineCount = 4 + Math.floor(rand() * 4);
  for (let i = 0; i < lineCount; i++) {
    const x1 = rand() * width;
    const y1 = rand() * height;
    const cx1 = rand() * width;
    const cy1 = rand() * height;
    const cx2 = rand() * width;
    const cy2 = rand() * height;
    const x2 = rand() * width;
    const y2 = rand() * height;
    const color = colors[Math.floor(rand() * colors.length)];
    const opacity = 0.1 + rand() * 0.15;
    const strokeWidth = 0.5 + rand() * 1.5;
    shapes.push(
      <path
        key={`l${i}`}
        d={`M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    );
  }

  // Small dots cluster (8-15)
  const dotCount = 8 + Math.floor(rand() * 8);
  const clusterX = width * 0.3 + rand() * width * 0.4;
  const clusterY = height * 0.3 + rand() * height * 0.4;
  for (let i = 0; i < dotCount; i++) {
    const dx = clusterX + (rand() - 0.5) * 300;
    const dy = clusterY + (rand() - 0.5) * 200;
    const r = 2 + rand() * 5;
    const color = colors[Math.floor(rand() * colors.length)];
    const opacity = 0.15 + rand() * 0.2;
    shapes.push(
      <circle key={`d${i}`} cx={dx} cy={dy} r={r} fill={color} opacity={opacity} />
    );
  }

  // Subtle grid lines (2-4 horizontal, 2-4 vertical)
  const hLines = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < hLines; i++) {
    const y = height * 0.15 + rand() * height * 0.7;
    const x1 = rand() * width * 0.3;
    const x2 = width * 0.7 + rand() * width * 0.3;
    shapes.push(
      <line key={`h${i}`} x1={x1} y1={y} x2={x2} y2={y} stroke={colors[0]} strokeWidth={0.5} opacity={0.06} />
    );
  }
  const vLines = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < vLines; i++) {
    const x = width * 0.15 + rand() * width * 0.7;
    const y1 = rand() * height * 0.3;
    const y2 = height * 0.7 + rand() * height * 0.3;
    shapes.push(
      <line key={`v${i}`} x1={x} y1={y1} x2={x} y2={y2} stroke={colors[0]} strokeWidth={0.5} opacity={0.06} />
    );
  }

  // Agent name text overlay (bottom-left)
  const initials = name.split("-").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect width={width} height={height} fill={bgColor} />
      {shapes}

      {/* Subtle brand mark — bottom right */}
      <text
        x={width - 40}
        y={height - 24}
        textAnchor="end"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={12}
        fill={colors[0]}
        opacity={0.3}
      >
        gitagent
      </text>

      {/* Large initials — center */}
      <text
        x={width / 2}
        y={height / 2 + 20}
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={80}
        fontWeight={700}
        fill={colors[0]}
        opacity={0.12}
      >
        {initials}
      </text>

      {/* Agent name — bottom left */}
      <text
        x={40}
        y={height - 48}
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={22}
        fontWeight={600}
        fill={colors[0]}
        opacity={0.5}
      >
        {name}
      </text>
      <text
        x={40}
        y={height - 24}
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={13}
        fill={colors[1]}
        opacity={0.35}
      >
        {author}
      </text>
    </svg>
  );
}
