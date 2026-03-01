/**
 * Clean typographic banner — matches the /api/og image style.
 * Fixed 1200x630 viewBox, preserveAspectRatio="none" stretches
 * to fill any container without cropping.
 */

interface Props {
  name: string;
  author: string;
  repo?: string;
  category?: string;
  description?: string;
  className?: string;
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
  className = "",
}: Props) {
  const seed = hash(`${author}/${name}`);
  const accent = ACCENTS[seed % ACCENTS.length];
  const repoShort = repo?.replace("https://github.com/", "") ?? "";

  const meta = [author, repoShort].filter(Boolean).join("  ·  ");

  return (
    <svg
      viewBox="0 0 800 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect width="800" height="200" fill="#EDE6DA" />

      {/* Accent bar — left edge */}
      <rect x="0" y="0" width="5" height="200" fill={accent} />

      {/* Agent name */}
      <text x="28" y="80" fontFamily="monospace" fontSize="52" fontWeight="700" fill="#3D2B1F">
        {name}
      </text>

      {/* Author · repo */}
      <text x="28" y="120" fontFamily="monospace" fontSize="22" fontWeight="500" fill="#8B7B6E">
        {meta}
      </text>

      {/* Category badge */}
      {category && (
        <>
          <rect x="28" y="142" width={category.length * 11 + 20} height="26" rx="4" fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
          <text x="38" y="161" fontFamily="monospace" fontSize="16" fill={accent} opacity="0.7">
            {category}
          </text>
        </>
      )}

      {/* Watermark — bottom right */}
      <text x="772" y="186" textAnchor="end" fontFamily="monospace" fontSize="14" fill={accent} opacity="0.25">
        gitagent registry
      </text>
    </svg>
  );
}
