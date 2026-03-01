import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const ACCENTS = ['#8B6F5E', '#7A5C4F', '#6B5B4E', '#7E6355', '#6E5A50'];

export default function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || 'agent';
  const author = searchParams.get('author') || '';
  const repo = searchParams.get('repo') || '';
  const description = searchParams.get('desc') || '';
  const category = searchParams.get('category') || '';

  const seed = hash(`${author}/${name}`);
  const accent = ACCENTS[seed % ACCENTS.length];
  const repoShort = repo.replace('https://github.com/', '');

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#EDE6DA',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 90px',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Accent bar — left edge */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: accent,
          }}
        />

        {/* Top — badge */}
        <div
          style={{
            position: 'absolute',
            top: 44,
            left: 90,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 26,
            color: accent,
            opacity: 0.5,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: accent,
            }}
          />
          gitagent registry
        </div>

        {/* Agent name */}
        <div
          style={{
            fontSize: 110,
            fontWeight: 700,
            color: '#3D2B1F',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginBottom: 24,
          }}
        >
          {name}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: 36,
              color: '#6B5B4E',
              lineHeight: 1.4,
              maxWidth: 1000,
              marginBottom: 32,
            }}
          >
            {description.length > 80 ? description.slice(0, 80) + '...' : description}
          </div>
        )}

        {/* Author + repo + category row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            fontSize: 28,
            color: '#8B7B6E',
          }}
        >
          <span style={{ fontWeight: 600 }}>{author}</span>
          {repoShort && (
            <>
              <span style={{ opacity: 0.3 }}>·</span>
              <span style={{ opacity: 0.6 }}>{repoShort}</span>
            </>
          )}
          {category && (
            <>
              <span style={{ opacity: 0.3 }}>·</span>
              <span
                style={{
                  fontSize: 24,
                  color: accent,
                  border: `2px solid ${accent}50`,
                  borderRadius: 8,
                  padding: '4px 16px',
                }}
              >
                {category}
              </span>
            </>
          )}
        </div>

        {/* Bottom-right watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 90,
            fontSize: 22,
            color: accent,
            opacity: 0.3,
          }}
        >
          registry.gitagent.sh
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
