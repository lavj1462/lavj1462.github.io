import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

function fontPath(pkg: string, file: string): string {
  return path.join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', file);
}

async function loadFont(pkg: string, file: string): Promise<ArrayBuffer> {
  const buf = await readFile(fontPath(pkg, file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

// Thin JSX-less element helper for satori
type El = { type: string; props: Record<string, unknown> };

function div(style: Record<string, unknown>, ...children: (El | string)[]): El {
  const props: Record<string, unknown> = { style };
  if (children.length === 1) props.children = children[0];
  else if (children.length > 1) props.children = children;
  // 0 children → no children key (satori prefers this for leaf nodes)
  return { type: 'div', props };
}

export const GET: APIRoute = async () => {
  const [interRegular, interBold, newsreaderItalic] = await Promise.all([
    loadFont('inter', 'inter-latin-400-normal.woff'),
    loadFont('inter', 'inter-latin-700-normal.woff'),
    loadFont('newsreader', 'newsreader-latin-400-italic.woff'),
  ]);

  const W = 1200, H = 630;

  const paper   = '#FBF6F4';
  const paper2  = '#F3EAE5';
  const ink     = '#2A1F2D';
  const inkMute = '#8B7D93';
  const pink    = '#FFAFCC';
  const tape    = 'rgba(230,200,75,0.5)';

  // Helper: absolutely-positioned div
  const abs = (top: number, left: number, right: number | undefined, bottom: number | undefined,
               style: Record<string, unknown>, ...children: (El | string)[]): El =>
    div(
      {
        position: 'absolute',
        ...(top   !== undefined ? { top }   : {}),
        ...(left  !== undefined ? { left }  : {}),
        ...(right !== undefined ? { right } : {}),
        ...(bottom!== undefined ? { bottom }: {}),
        ...style,
      },
      ...children,
    );

  const element = div(
    {
      width: W, height: H,
      background: paper,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },

    // ── ink borders ──────────────────────────────────────────────
    abs(0, 0, 0, undefined, { height: 4, background: ink }),
    abs(undefined, 0, 0, 0, { height: 4, background: ink }),

    // ── tape strips ──────────────────────────────────────────────
    abs(42, -28, undefined, undefined, {
      width: 200, height: 30, background: tape,
      border: '1px dashed rgba(100,80,0,0.3)',
      transform: 'rotate(-8deg)',
    }),
    abs(30, undefined, -18, undefined, {
      width: 190, height: 28, background: tape,
      border: '1px dashed rgba(100,80,0,0.3)',
      transform: 'rotate(6deg)',
    }),
    abs(undefined, undefined, 100, 58, {
      width: 160, height: 26, background: tape,
      border: '1px dashed rgba(100,80,0,0.3)',
      transform: 'rotate(-4deg)',
    }),

    // ── stars ────────────────────────────────────────────────────
    abs(100, 52, undefined, undefined,
      { fontSize: 28, color: pink, fontFamily: 'Inter', fontWeight: 700 }, '*'),
    abs(440, 90, undefined, undefined,
      { fontSize: 24, color: inkMute, fontFamily: 'Inter', fontWeight: 700 }, '+'),
    abs(200, undefined, 310, undefined,
      { fontSize: 22, color: pink, fontFamily: 'Inter', fontWeight: 700 }, '*'),
    abs(undefined, 380, undefined, 110,
      { fontSize: 18, color: inkMute, fontFamily: 'Inter', fontWeight: 700 }, 'x'),
    abs(320, 540, undefined, undefined,
      { fontSize: 16, color: pink, fontFamily: 'Inter', fontWeight: 700 }, '*'),

    // ── main text block ──────────────────────────────────────────
    abs(64, 72, undefined, undefined, {
      display: 'flex', flexDirection: 'column',
    },
      // kicker label
      div({
        fontFamily: 'Inter', fontSize: 11, fontWeight: 400,
        letterSpacing: '0.18em',
        color: inkMute, marginBottom: 24,
      }, 'No. 01 / PORTFOLIO  ·  SAN FRANCISCO  ·  2026'),

      // name
      div({ display: 'flex', flexDirection: 'column' },
        div({
          fontFamily: 'Inter', fontWeight: 700,
          fontSize: 118, color: ink,
          letterSpacing: '-0.03em', lineHeight: 0.9,
        }, 'Lavanya'),
        div({
          fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 400,
          fontSize: 118, color: ink,
          letterSpacing: '-0.02em', lineHeight: 0.9,
        }, 'Joshi'),
      ),

      // tagline
      div({
        marginTop: 28,
        fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 400,
        fontSize: 22, color: pink, letterSpacing: '0.01em',
      }, '-> building the future of Robotics *'),

      // sub
      div({
        marginTop: 14,
        fontFamily: 'Inter', fontSize: 15, fontWeight: 400,
        color: inkMute, letterSpacing: '0.01em',
      }, 'lavj1462.github.io  ·  Data ops & robotics'),
    ),

    // ── avatar ───────────────────────────────────────────────────
    abs(120, undefined, 80, undefined, {
      width: 210, height: 210,
      border: `2.5px solid ${ink}`,
      background: paper2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
      // dot pattern overlay
      abs(0, 0, 0, 0, {
        backgroundImage: `radial-gradient(circle, ${inkMute}44 1px, transparent 1px)`,
        backgroundSize: '12px 12px',
      }),

      // large italic L
      div({
        fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 400,
        fontSize: 114, color: ink, lineHeight: 1,
        letterSpacing: '-0.04em', marginBottom: 2,
      }, 'L'),

      // eyes
      div({ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' },
        // open eye
        div({
          width: 13, height: 13,
          borderRadius: 7,
          border: `2px solid ${ink}`,
        }),
        // blink eye (squished)
        div({ width: 13, height: 2, borderRadius: 2, background: ink }),
      ),
    ),

    // ── stamp: OPEN TO WORK ───────────────────────────────────────
    abs(undefined, undefined, 72, 88, {
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 4,
      border: `2px solid ${pink}`,
      padding: '10px 20px',
      transform: 'rotate(-2.5deg)',
    },
      div({
        fontFamily: 'Inter', fontWeight: 700, fontSize: 13,
        letterSpacing: '0.2em', color: pink,
      }, 'OPEN TO WORK'),
      div({
        fontFamily: 'Inter', fontWeight: 400, fontSize: 10,
        letterSpacing: '0.16em', color: pink,
      }, '2026'),
    ),

    // ── stamp: DATA OPS ───────────────────────────────────────────
    abs(undefined, undefined, 68, 175, {
      display: 'flex',
      border: `1.5px solid ${inkMute}`,
      padding: '7px 14px',
      transform: 'rotate(1.5deg)',
    },
      div({
        fontFamily: 'Inter', fontWeight: 400, fontSize: 10,
        letterSpacing: '0.18em', color: inkMute,
      }, 'DATA OPS · AI · ROBOTICS'),
    ),
  );

  const svg = await satori(element as any, {
    width: W,
    height: H,
    fonts: [
      { name: 'Inter',       data: interRegular,    weight: 400, style: 'normal' },
      { name: 'Inter',       data: interBold,       weight: 700, style: 'normal' },
      { name: 'Newsreader',  data: newsreaderItalic, weight: 400, style: 'italic' },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
  });
};
