import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#EDE6DA',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent bar — top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#7A5C4F',
          }}
        />

        {/* Subtle decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -60, width: 400, height: 400, borderRadius: '50%', background: '#C4A882', opacity: 0.06 }} />
        <div style={{ position: 'absolute', bottom: -100, left: -80, width: 500, height: 500, borderRadius: '50%', background: '#8B6F5E', opacity: 0.05 }} />
        <div style={{ position: 'absolute', top: 120, left: 200, width: 200, height: 200, borderRadius: '50%', background: '#A68B7B', opacity: 0.04 }} />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 24,
            color: '#7A5C4F',
            opacity: 0.6,
            marginBottom: 32,
            border: '1.5px solid rgba(122, 92, 79, 0.25)',
            borderRadius: 100,
            padding: '8px 24px',
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#7A5C4F' }} />
          open-gitagent/registry
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: '#3D2B1F',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginBottom: 20,
            display: 'flex',
            gap: 20,
          }}
        >
          <span>The Agent</span>
          <span style={{ color: '#7A5C4F' }}>Registry</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#6B5B4E',
            opacity: 0.7,
            marginBottom: 48,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Discover, share, and install git-native AI agents
        </div>

        {/* Terminal command preview */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(61, 43, 31, 0.06)',
            border: '1.5px solid rgba(61, 43, 31, 0.12)',
            borderRadius: 12,
            padding: '14px 32px',
            fontSize: 26,
          }}
        >
          <span style={{ color: '#7A5C4F' }}>$</span>
          <span style={{ color: '#3D2B1F', fontWeight: 500 }}>npx @open-gitagent/gitagent run</span>
          <span style={{ color: '#8B7B6E' }}>-r &lt;repo&gt;</span>
          <span style={{ color: '#8B7B6E' }}>-a</span>
          <span style={{ color: '#7A5C4F', fontWeight: 600 }}>claude</span>
        </div>

        {/* Bottom watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            fontSize: 22,
            color: '#7A5C4F',
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
