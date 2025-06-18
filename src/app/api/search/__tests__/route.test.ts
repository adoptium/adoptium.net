import { describe, it, expect, vi, afterEach } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';
import * as asciidocService from '@/services/asciidocService';

vi.mock('@/services/asciidocService');

const mockGetAllAsciidocPaths = asciidocService.getAllAsciidocPaths as unknown as ReturnType<typeof vi.fn>;
const mockGetAsciidocContent = asciidocService.getAsciidocContent as unknown as ReturnType<typeof vi.fn>;

describe('GET /api/search', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const buildRequest = (q: string) => new NextRequest(`http://localhost/api/search?q=${encodeURIComponent(q)}`);

  it('returns empty array if query is too short', async () => {
    const req = buildRequest('a');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([]);
  });

  it('returns matching results', async () => {
    mockGetAllAsciidocPaths.mockResolvedValue([
      { slug: 'foo', locale: 'en' },
      { slug: 'bar', locale: 'en' }
    ]);
    mockGetAsciidocContent.mockImplementation(async (slug) => {
      if (slug === 'foo') return { metadata: { title: 'Foo Title', description: 'Some desc' } };
      if (slug === 'bar') return { metadata: { title: 'Bar', description: 'Other desc' } };
      return null;
    });
    const req = buildRequest('foo');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([
      { title: 'Foo Title', desc: 'Some desc', slug: 'foo', locale: 'en' }
    ]);
  });

  it('returns empty array if no matches', async () => {
    mockGetAllAsciidocPaths.mockResolvedValue([
      { slug: 'foo', locale: 'en' }
    ]);
    mockGetAsciidocContent.mockResolvedValue({ metadata: { title: 'Nope', description: 'Nothing' } });
    const req = buildRequest('bar');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([]);
  });
});
