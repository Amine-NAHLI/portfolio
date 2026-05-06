import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    // Extraire owner/repo depuis l'URL GitHub (gère le .git et les slashs de fin)
    const match = url.replace(/\.git$/, '').replace(/\/$/, '').match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
    }

    const [, owner, repo] = match;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // Fetch parallèle : infos du repo, langages, et README
    const [repoRes, langRes, readmeRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers }),
    ]);

    if (!repoRes.ok) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    const repoData = await repoRes.json();
    const languages = await langRes.json();

    let readme = '';
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      readme = Buffer.from(readmeData.content, 'base64').toString('utf-8');
    }

    return NextResponse.json({
      name: repoData.name,
      full_name: repoData.full_name,
      description: repoData.description || '',
      topics: repoData.topics || [],
      languages: Object.keys(languages),
      main_language: repoData.language || 'Unknown',
      stars: repoData.stargazers_count,
      html_url: repoData.html_url,
      created_at: repoData.created_at,
      readme: readme,
    });
  } catch (error) {
    console.error('GitHub Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch repository data' }, { status: 500 });
  }
}
