const INDEX_URL = 'https://raw.githubusercontent.com/open-gitagent/registry/main/index.json';

interface Agent {
  name: string;
  author: string;
  description: string;
  repository: string;
  category: string;
  banner: string | null;
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const author = url.searchParams.get('author') || '';
  const name = url.searchParams.get('name') || '';

  if (!author || !name) {
    return Response.redirect(new URL('/', url.origin).toString(), 301);
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
    : `${name} by ${author} — gitagent registry`;
  const description = agent?.description ?? 'Discover, share, and install git-native AI agents.';

  const origin = url.origin;
  const ogImage = agent?.banner
    ? agent.banner
    : `${origin}/api/og?name=${encodeURIComponent(agent?.name ?? name)}&author=${encodeURIComponent(agent?.author ?? author)}&repo=${encodeURIComponent(agent?.repository ?? '')}&desc=${encodeURIComponent(description)}&category=${encodeURIComponent(agent?.category ?? '')}`;

  const pageUrl = `${origin}/agent/${author}/${name}`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />
  <link rel="canonical" href="${pageUrl}" />
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${pageUrl}">${escapeHtml(title)}</a>...</p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const config = { runtime: 'edge' };
