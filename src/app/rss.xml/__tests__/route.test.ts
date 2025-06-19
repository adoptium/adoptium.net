import { describe, it, expect, vi, afterEach } from 'vitest';
import { GET } from '../route';
import * as markdownUtils from '@/utils/markdown';

vi.mock('@/utils/markdown');

const getBlogPosts = markdownUtils.getBlogPosts as unknown as ReturnType<typeof vi.fn>;

describe('GET /rss.xml', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('returns RSS feed with correct headers and content', async () => {
    getBlogPosts.mockResolvedValue([
      {
        metadata: {
          title: 'Test Post',
          description: 'A test post',
          date: '2025-06-18',
        },
        year: '2025',
        month: '06',
        slug: 'test-post',
      },
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/rss+xml');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600');
    const text = await res.text();
    expect(text).toContain('<title><![CDATA[Adoptium Blog]]></title>');
    expect(text).toContain('<title><![CDATA[Test Post]]></title>');
    expect(text).toContain('<description><![CDATA[A test post]]></description>');
    expect(text).toContain('<guid isPermaLink="false">test-post</guid>');
  });

  it('returns empty RSS feed if no posts', async () => {
    getBlogPosts.mockResolvedValue([]);
    const res = await GET();
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('<title><![CDATA[Adoptium Blog]]></title>');
  });
});
