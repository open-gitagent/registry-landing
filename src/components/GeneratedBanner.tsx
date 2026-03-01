/**
 * Clean typographic banner — matches the /api/og image style.
 * Fixed 1200x630 viewBox. Content stacked from top so it's
 * visible even when cropped in short card containers.
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
  description,
  className = "",
}: Props) {
  const seed = hash(`${author}/${name}`);
  const accent = ACCENTS[seed % ACCENTS.length];
  const repoShort = repo?.replace("https://github.com/", "") ?? "";

  const meta = [
    author,
    repoShort ? `· ${repoShort}` : "",
    category ? `· ${category}` : "",
  ].filter(Boolean).join("  ");

  const desc = description
    ? description.length > 70 ? description.slice(0, 70) + "..." : description
    : "";

  return (
    <svg
      viewBox="0 0 1200 630"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin slice"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect width="1200" height="630" fill="#EDE6DA" />

      {/* Accent bar — left edge */}
      <rect x="0" y="0" width="8" height="630" fill={accent} />

      {/* Badge — top left */}
      <circle cx="60" cy="50" r="6" fill={accent} opacity="0.5" />
      <text x="80" y="58" fontFamily="monospace" fontSize="30" fill={accent} opacity="0.5">
        gitagent registry
      </text>

      {/* Agent name — big, near top */}
      <text x="60" y="200" fontFamily="monospace" fontSize="120" fontWeight="700" fill="#3D2B1F">
        {name}
      </text>

      {/* Author · repo · category */}
      <text x="60" y="270" fontFamily="monospace" fontSize="38" fontWeight="600" fill="#8B7B6E">
        {meta}
      </text>

      {/* Description */}
      {desc && (
        <text x="60" y="360" fontFamily="monospace" fontSize="38" fill="#6B5B4E">
          {desc}
        </text>
      )}

      {/* Watermark — bottom right */}
      <text x="1140" y="600" textAnchor="end" fontFamily="monospace" fontSize="28" fill={accent} opacity="0.3">
        registry.gitagent.sh
      </text>
    </svg>
  );
}
