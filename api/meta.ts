import type { VercelRequest, VercelResponse } from '@vercel/node';

const INDEX_URL = 'https://raw.githubusercontent.com/open-gitagent/registry/main/index.json';

interface Agent {
  name: string;
  author: string;
  description: string;
  repository: string;
  category: string;
  banner: string | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { author, name } = req.query as { author?: string; name?: string };

  if (!author || !name) {
    return res.redirect(301, '/');
  }

  // Fetch agent data
  let agent: Agent | null = null;
  try {
    const indexRes = await fetch(INDEX_URL);
    if (indexRes.ok) {
      const data = await indexRes.json();
      agent = data.agents?.find((a: Agent) => a.author === author && a.name === name) ?? null;
    }
  } catch {
    // fallback
  }

  const title = agent
    ? `${agent.name} by ${agent.author} — gitagent registry`
    : 'gitagent registry';
  const description = agent?.description ?? 'Discover, share, and install git-native AI agents.';

  // OG image — agent banner or generated
  const origin = `https://${req.headers.host}`;
  const ogImage = agent?.banner
    ? agent.banner
    : `${origin}/api/og?name=${encodeURIComponent(agent?.name ?? name)}&author=${encodeURIComponent(agent?.author ?? author)}&repo=${encodeURIComponent(agent?.repository ?? '')}&desc=${encodeURIComponent(description)}&category=${encodeURIComponent(agent?.category ?? '')}`;

  const pageUrl = `${origin}/agent/${author}/${name}`;

  // Serve a minimal HTML page with OG tags that loads the SPA
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
  <link rel="canonical" href="${pageUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${pageUrl}">${title}</a>...</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
