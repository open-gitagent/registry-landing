/**
 * Clean typographic banner — matches the /api/og image style.
 * Fixed 1200x630 viewBox, scales via preserveAspectRatio.
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
    ? description.length > 80 ? description.slice(0, 80) + "..." : description
    : "";

  return (
    <svg
      viewBox="0 0 1200 630"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect width="1200" height="630" fill="#EDE6DA" />

      {/* Accent bar — left edge */}
      <rect x="0" y="0" width="8" height="630" fill={accent} />

      {/* Badge — top left */}
      <circle cx="100" cy="52" r="5" fill={accent} opacity="0.5" />
      <text x="116" y="58" fontFamily="monospace" fontSize="26" fill={accent} opacity="0.5">
        gitagent registry
      </text>

      {/* Agent name */}
      <text x="90" y="310" fontFamily="monospace" fontSize="110" fontWeight="700" fill="#3D2B1F">
        {name}
      </text>

      {/* Description */}
      {desc && (
        <text x="90" y="370" fontFamily="monospace" fontSize="36" fill="#6B5B4E">
          {desc}
        </text>
      )}

      {/* Author · repo · category */}
      <text x="90" y="560" fontFamily="monospace" fontSize="28" fill="#8B7B6E">
        {meta}
      </text>

      {/* Watermark — bottom right */}
      <text x="1110" y="594" textAnchor="end" fontFamily="monospace" fontSize="22" fill={accent} opacity="0.3">
        registry.gitagent.sh
      </text>
    </svg>
  );
}
