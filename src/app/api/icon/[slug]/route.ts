import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    const res = await fetch(`https://skillicons.dev/icons?i=${slug}`);
    
    if (res.ok) {
      const text = await res.text();
      
      // skillicons.dev returns an SVG with <g>undefined</g> when the icon doesn't exist
      if (text.includes(">undefined<")) {
        return generateFallbackSvg(slug);
      }
      
      return new NextResponse(text, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      });
    }
  } catch (error) {
    console.error(`Error fetching icon ${slug}:`, error);
  }
  
  return generateFallbackSvg(slug);
}

function generateFallbackSvg(name: string) {
  // Same color generation logic as SkillIcon fallback
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  
  const bg = `hsl(${h}, 60%, 20%)`;
  const text = `hsl(${h}, 80%, 80%)`;
  const initial = name.charAt(0).toUpperCase();
  
  // Dimensions match skillicons.dev standard size (256x256)
  const svg = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="256" height="256" rx="60" fill="${bg}"/>
    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="${text}" font-family="sans-serif, Arial" font-size="140" font-weight="bold">${initial}</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
