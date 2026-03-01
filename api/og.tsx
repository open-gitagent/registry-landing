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
          padding: '80px 80px',
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
            width: 6,
            background: accent,
          }}
        />

        {/* Top — badge */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 80,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 20,
            color: accent,
            opacity: 0.5,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accent,
            }}
          />
          gitagent registry
        </div>

        {/* Agent name */}
        <div
          style={{
            fontSize: 82,
            fontWeight: 700,
            color: '#3D2B1F',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 20,
          }}
        >
          {name}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: 28,
              color: '#6B5B4E',
              lineHeight: 1.45,
              maxWidth: 950,
              marginBottom: 28,
            }}
          >
            {description.length > 90 ? description.slice(0, 90) + '...' : description}
          </div>
        )}

        {/* Author + repo + category row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            fontSize: 22,
            color: '#8B7B6E',
          }}
        >
          <span>{author}</span>
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
                  fontSize: 18,
                  color: accent,
                  border: `1.5px solid ${accent}50`,
                  borderRadius: 6,
                  padding: '4px 14px',
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
            bottom: 40,
            right: 80,
            fontSize: 18,
            color: accent,
            opacity: 0.25,
          }}
        >
          registry.gitagent.sh
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
