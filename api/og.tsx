import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

// Simple deterministic hash
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = [
  ['#8B6F5E', '#A68B7B', '#C4A882'],
  ['#7A5C4F', '#9E8070', '#B89E8A'],
  ['#6B5B4E', '#8D7B6A', '#AD9C88'],
  ['#7E6355', '#A08476', '#BEA48E'],
  ['#6E5A50', '#917A6C', '#B09A88'],
];

export default function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || 'agent';
  const author = searchParams.get('author') || '';
  const repo = searchParams.get('repo') || '';
  const description = searchParams.get('desc') || '';
  const category = searchParams.get('category') || '';

  const seed = hash(`${author}/${name}`);
  const rand = seededRandom(seed);
  const colors = PALETTES[seed % PALETTES.length];
  const initials = name.split('-').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');

  // Generate circle positions
  const circles = Array.from({ length: 5 }, () => ({
    x: Math.floor(rand() * 1200),
    y: Math.floor(rand() * 630),
    r: Math.floor(80 + rand() * 180),
    color: colors[Math.floor(rand() * colors.length)],
    opacity: 0.08 + rand() * 0.1,
  }));

  // Generate dots
  const dots = Array.from({ length: 12 }, () => ({
    x: Math.floor(300 + rand() * 600),
    y: Math.floor(150 + rand() * 330),
    r: Math.floor(3 + rand() * 6),
    color: colors[Math.floor(rand() * colors.length)],
    opacity: 0.15 + rand() * 0.15,
  }));

  const repoShort = repo.replace('https://github.com/', '');

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#EDE6DA',
          display: 'flex',
          position: 'relative',
          fontFamily: '"IBM Plex Mono", monospace',
          overflow: 'hidden',
        }}
      >
        {/* Circles */}
        {circles.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: c.x - c.r,
              top: c.y - c.r,
              width: c.r * 2,
              height: c.r * 2,
              borderRadius: '50%',
              background: c.color,
              opacity: c.opacity,
            }}
          />
        ))}

        {/* Dots */}
        {dots.map((d, i) => (
          <div
            key={`d${i}`}
            style={{
              position: 'absolute',
              left: d.x - d.r,
              top: d.y - d.r,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: '50%',
              background: d.color,
              opacity: d.opacity,
            }}
          />
        ))}

        {/* Large initials */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 120,
            fontWeight: 700,
            color: colors[0],
            opacity: 0.1,
          }}
        >
          {initials}
        </div>

        {/* Bottom content */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 48,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 600, color: colors[0], opacity: 0.6 }}>
            {name}
          </div>
          {description && (
            <div style={{ fontSize: 14, color: colors[1], opacity: 0.45, maxWidth: 700 }}>
              {description.slice(0, 120)}
            </div>
          )}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 4 }}>
            <div style={{ fontSize: 13, color: colors[1], opacity: 0.4 }}>
              {author}
            </div>
            {repoShort && (
              <div style={{ fontSize: 11, color: colors[2], opacity: 0.3 }}>
                github.com/{repoShort}
              </div>
            )}
            {category && (
              <div
                style={{
                  fontSize: 10,
                  color: colors[0],
                  opacity: 0.35,
                  border: `1px solid ${colors[0]}40`,
                  borderRadius: 4,
                  padding: '2px 8px',
                }}
              >
                {category}
              </div>
            )}
          </div>
        </div>

        {/* Brand watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            right: 48,
            fontSize: 12,
            color: colors[0],
            opacity: 0.25,
          }}
        >
          gitagent registry
        </div>

        {/* Top-left badge */}
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: colors[0],
            opacity: 0.35,
            border: `1px solid ${colors[0]}30`,
            borderRadius: 20,
            padding: '4px 14px',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[0] }} />
          open-gitagent/registry
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
