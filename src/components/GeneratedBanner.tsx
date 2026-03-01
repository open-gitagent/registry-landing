/**
 * Clean typographic banner — matches the /api/og image style.
 * No abstract shapes. Big text, accent bar, parchment background.
 */

interface Props {
  name: string;
  author: string;
  repo?: string;
  category?: string;
  description?: string;
  className?: string;
  width?: number;
  height?: number;
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const ACCENTS = ['#8B6F5E', '#7A5C4F', '#6B5B4E', '#7E6355', '#6E5A50'];

export function GeneratedBanner({
  name,
  author,
  repo,
  category,
  description,
  className = "",
  width = 1200,
  height = 630,
}: Props) {
  const seed = hash(`${author}/${name}`);
  const accent = ACCENTS[seed % ACCENTS.length];
  const repoShort = repo?.replace("https://github.com/", "") ?? "";

  // Scale factors relative to 1200x630
  const sx = width / 1200;
  const sy = height / 630;
  const s = Math.min(sx, sy);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect width={width} height={height} fill="#EDE6DA" />

      {/* Accent bar — left edge */}
      <rect x={0} y={0} width={8 * sx} height={height} fill={accent} />

      {/* Badge — top left */}
      <circle cx={90 * sx + 5 * s} cy={50 * sy} r={5 * s} fill={accent} opacity={0.5} />
      <text
        x={90 * sx + 18 * s}
        y={50 * sy + 5 * s}
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={26 * s}
        fill={accent}
        opacity={0.5}
      >
        gitagent registry
      </text>

      {/* Agent name — big */}
      <text
        x={90 * sx}
        y={height * 0.48}
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={110 * s}
        fontWeight={700}
        fill="#3D2B1F"
        letterSpacing={-0.04 * 110 * s}
      >
        {name}
      </text>

      {/* Description */}
      {description && (
        <text
          x={90 * sx}
          y={height * 0.48 + 50 * s}
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={36 * s}
          fill="#6B5B4E"
        >
          {description.length > 80 ? description.slice(0, 80) + "..." : description}
        </text>
      )}

      {/* Author */}
      <text
        x={90 * sx}
        y={height - 50 * sy}
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={28 * s}
        fontWeight={600}
        fill="#8B7B6E"
      >
        {author}
        {repoShort && (
          <tspan fill="#8B7B6E" opacity={0.3} dx={20 * s}>·</tspan>
        )}
        {repoShort && (
          <tspan fill="#8B7B6E" opacity={0.6} dx={10 * s}>{repoShort}</tspan>
        )}
        {category && (
          <tspan fill="#8B7B6E" opacity={0.3} dx={20 * s}>·</tspan>
        )}
        {category && (
          <tspan fill={accent} opacity={0.7} dx={10 * s}>{category}</tspan>
        )}
      </text>

      {/* Watermark — bottom right */}
      <text
        x={width - 90 * sx}
        y={height - 36 * sy}
        textAnchor="end"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={22 * s}
        fill={accent}
        opacity={0.3}
      >
        registry.gitagent.sh
      </text>
    </svg>
  );
}
