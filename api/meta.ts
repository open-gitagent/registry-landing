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

  const origin = 'https://registry.gitagent.sh';
  const ogImage = agent?.banner
    ? agent.banner
    : `${origin}/api/og?name=${encodeURIComponent(agent?.name ?? name)}&author=${encodeURIComponent(agent?.author ?? author)}&repo=${encodeURIComponent(agent?.repository ?? '')}&desc=${encodeURIComponent(description)}&category=${encodeURIComponent(agent?.category ?? '')}`;

  const pageUrl = `${origin}/agent/${author}/${name}`;

  // Fetch the built index.html and inject OG tags
  let html: string;
  try {
    const htmlRes = await fetch(new URL('/index.html', url.origin));
    html = await htmlRes.text();
  } catch {
    // Fallback if fetch fails
    html = '<!doctype html><html><head></head><body><div id="root"></div></body></html>';
  }

  // Replace existing meta tags with agent-specific ones
  const ogTags = `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${ogImage}" />
  <link rel="canonical" href="${pageUrl}" />`;

  // Remove existing title + og/twitter meta, inject new ones
  html = html
    .replace(/<title>.*?<\/title>/, '')
    .replace(/<meta\s+name="description"[^>]*>/g, '')
    .replace(/<meta\s+property="og:[^>]*>/g, '')
    .replace(/<meta\s+name="twitter:[^>]*>/g, '')
    .replace('</head>', `${ogTags}\n</head>`);

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const config = { runtime: 'edge' };
