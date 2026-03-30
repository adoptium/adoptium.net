import { render, screen, fireEvent } from '@testing-library/react';
import SitemapClient from '../SitemapClient';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SitemapData } from '@/types/sitemap';


describe('SitemapClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default date for all tests -> 21/12/2012 - This is the end of the world!
    // NOTE: this is important for accessibility tests
    const date = Date.UTC(2012, 11, 21, 0, 0, 0, 0);
    vi.useFakeTimers({now: date, shouldAdvanceTime: true});

    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();

    document.body.innerHTML = '';
  });

  const renderSitemapClient = (customData?: SitemapData) => {
    document.body.innerHTML = '';
    const defaultData: SitemapData = {
      sections: [
        {
          id: 'top-level',
          title: 'Top-level',
          description: 'Main pages and navigation',
          pages: [
            { title: 'Home', url: '/' },
            { title: 'About', url: '/about' },
          ],
        },
      ],
      dynamicContent: {
        recentBlogs: [
          { title: 'Java 21 Release', url: '/news/2024/01/java-21-release' },
        ],
      },
    };

    return render(<SitemapClient sitemapData={customData || defaultData} />);
  };

  it('renders search input correctly', () => {
    renderSitemapClient();

    const searchInput = screen.getByPlaceholderText('Search pages...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });

  it('renders all sections and dynamic content sections', () => {
    renderSitemapClient();

    // Checking that section headers are rendered
    expect(screen.getByText('Top-level')).toBeInTheDocument();

    // Checking that dynamic content sections are rendered
    expect(screen.getByText('Latest News')).toBeInTheDocument();
  });

  it('has clickable section buttons', () => {
    renderSitemapClient();

    const topLevelButton = screen.getByRole('button', { name: /top-level/i });
    expect(topLevelButton).toBeInTheDocument();

    // Test passes if no errors are thrown when clicking
    fireEvent.click(topLevelButton);
  });

  it('renders sections with proper content', () => {
    renderSitemapClient();

    // Check that sections are rendered with proper content
    expect(screen.getByText('Top-level')).toBeInTheDocument();
    expect(screen.getByText('Latest News')).toBeInTheDocument();
  });

  it('handles empty dynamic content gracefully', () => {
    const dataWithoutDynamicContent = {
      sections: [
        {
          id: 'top-level',
          title: 'Top-level',
          description: 'Main pages and navigation',
          pages: [{ title: 'Home', url: '/' }],
        },
      ],
      dynamicContent: undefined,
    };

    renderSitemapClient(dataWithoutDynamicContent);

    expect(screen.queryByText('Latest News')).not.toBeInTheDocument();
  });

  it('handles empty sections gracefully', () => {
    const dataWithEmptySections = {
      sections: [],
      dynamicContent: {
        recentBlogs: [{ title: 'Java 21 Release', url: '/news/2024/01/java-21-release' }],
      },
    };

    renderSitemapClient(dataWithEmptySections);

    expect(screen.queryByText('Top-level')).not.toBeInTheDocument();
  });

  it('handles search input changes without crashing', async () => {
    renderSitemapClient();

    const searchInput = screen.getByPlaceholderText('Search pages...');

    // Checking various search inputs
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(searchInput, { target: { value: 'another test' } });
    fireEvent.change(searchInput, { target: { value: '' } });

    // Checking that the input should update
    expect(searchInput).toHaveValue('');
  });

  it('renders all expected sections with proper structure', () => {
    renderSitemapClient();

    // Checking that all expected elements are rendered
    expect(screen.getByPlaceholderText('Search pages...')).toBeInTheDocument();
    expect(screen.getByText('Top-level')).toBeInTheDocument();
    expect(screen.getByText('Latest News')).toBeInTheDocument();
    expect(screen.getByText('Top-level')).toBeInTheDocument();
  });

  it('renders basic component structure correctly', () => {
    const { container } = renderSitemapClient();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderSitemapClient();

    const buttons = container.querySelectorAll('button');
    const inputs = container.querySelectorAll('input');
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');

    buttons.forEach(button => {
      expect(button.textContent?.trim()).toBeTruthy();
    });

    inputs.forEach(input => {
      expect(input.getAttribute('placeholder')).toBeTruthy();
    });

    expect(headings.length).toBeGreaterThan(0);

    const interactiveElements = container.querySelectorAll('button, input, [tabindex]');
    expect(interactiveElements.length).toBeGreaterThan(0);
  });

  it('renders correctly', () => {
    const { container } = renderSitemapClient();
    expect(container).toMatchSnapshot();
  });
});
