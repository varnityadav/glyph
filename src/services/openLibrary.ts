// OpenLibrary API service
// Documentation: https://openlibrary.org/dev/docs/api/search

export interface OLSearchResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  ia?: string[]; // Internet Archive identifiers for reading
  has_fulltext?: boolean;
  availability?: {
    status: string;
    available_to_browse: boolean;
    available_to_borrow: boolean;
    available_to_waitlist: boolean;
    is_printdisabled: boolean;
    is_readable: boolean;
    is_lendable: boolean;
    is_preview_only: boolean;
    identifier: string;
    isbn: string | null;
    oclc: string | null;
    openlibrary_work: string;
    openlibrary_edition: string;
    last_loan_date: string | null;
    num_waitlist: string | null;
    last_waitlist_date: string | null;
  };
  edition_count?: number;
  first_sentence?: string[];
  publisher?: string[];
  language?: string[];
  seed?: string[];
}

export interface OLSearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OLSearchResult[];
}

export interface OLAuthorResult {
  key: string;
  name: string;
  top_work?: string;
  work_count?: number;
  top_subjects?: string[];
  birth_date?: string;
  death_date?: string;
  photos?: number[];
}

export interface OLAuthorSearchResponse {
  numFound: number;
  start: number;
  docs: OLAuthorResult[];
}

const BASE_URL = 'https://openlibrary.org';
const SEARCH_ENDPOINT = `${BASE_URL}/search.json`;
const AUTHORS_ENDPOINT = `${BASE_URL}/search/authors.json`;

/**
 * Search books by query (title, author, subject, etc.)
 */
export async function searchBooks(
  query: string,
  params: { limit?: number; page?: number; sort?: string } = {}
): Promise<OLSearchResponse> {
  const { limit = 20, page = 1, sort } = params;
  const url = new URL(SEARCH_ENDPOINT);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('page', String(page));
  url.searchParams.set('fields', 'key,title,author_name,first_publish_year,cover_i,isbn,ia,has_fulltext,availability,edition_count,first_sentence,publisher,language,seed');
  if (sort) url.searchParams.set('sort', sort);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`OpenLibrary search failed: ${res.statusText}`);
  return res.json();
}

/**
 * Search for authors
 */
export async function searchAuthors(
  query: string,
  params: { limit?: number; page?: number } = {}
): Promise<OLAuthorSearchResponse> {
  const { limit = 20, page = 1 } = params;
  const url = new URL(AUTHORS_ENDPOINT);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('page', String(page));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`OpenLibrary author search failed: ${res.statusText}`);
  return res.json();
}

/**
 * Search books by a specific author
 */
export async function searchBooksByAuthor(
  authorQuery: string,
  params: { limit?: number; page?: number; sort?: string } = {}
): Promise<OLSearchResponse> {
  const { limit = 20, page = 1, sort } = params;
  const url = new URL(SEARCH_ENDPOINT);
  url.searchParams.set('author', authorQuery);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('page', String(page));
  url.searchParams.set('fields', 'key,title,author_name,first_publish_year,cover_i,isbn,ia,has_fulltext,availability,edition_count,first_sentence,publisher,language');
  if (sort) url.searchParams.set('sort', sort);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`OpenLibrary author books search failed: ${res.statusText}`);
  return res.json();
}

/**
 * Get cover image URL from cover ID
 */
export function getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

/**
 * Get cover URL from ISBN
 */
export function getCoverUrlFromIsbn(isbn: string, size: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

/**
 * Get the Internet Archive URL for reading a book
 */
export function getReadingUrl(iaIdentifier: string): string {
  return `https://archive.org/details/${iaIdentifier}`;
}

/**
 * Get the OpenLibrary book page URL
 */
export function getBookUrl(key: string): string {
  return `${BASE_URL}${key}`;
}

// CORS proxy configuration for Internet Archive text content
// In development, Vite proxy is used (see vite.config.ts)
// For production, you can set VITE_CORS_PROXY env var or use the default public proxy
const CORS_PROXY = import.meta.env.VITE_CORS_PROXY || 'https://corsproxy.io/?';

/**
 * Fetch the full text content of a book from Internet Archive
 * Uses _djvu.txt (OCR-extracted plain text) as the primary source
 * Falls back through multiple strategies
 */
export async function getBookTextContent(iaIdentifier: string): Promise<{
  text: string;
  source: 'direct' | 'proxy' | 'metadata';
}> {
  const textUrl = `https://archive.org/download/${iaIdentifier}/${iaIdentifier}_djvu.txt`;
  const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(textUrl)}`;

  // Strategy 1: Try direct fetch (works in dev with Vite proxy, or if CORS is supported)
  try {
    const res = await fetch('/api/ia-text/' + iaIdentifier);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 100) {
        return { text, source: 'direct' };
      }
    }
  } catch {
    // fall through
  }

  // Strategy 2: Try direct fetch to archive.org (some endpoints support CORS)
  try {
    const res = await fetch(textUrl);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 100) {
        return { text, source: 'direct' };
      }
    }
  } catch {
    // fall through
  }

  // Strategy 3: Try through CORS proxy
  try {
    const res = await fetch(proxiedUrl);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 100) {
        return { text, source: 'proxy' };
      }
    }
  } catch {
    // fall through
  }

  // Strategy 4: Try fetching the HTML version from archive.org/details/{id}
  try {
    const detailsUrl = `${CORS_PROXY}${encodeURIComponent(`https://archive.org/details/${iaIdentifier}`)}`;
    const res = await fetch(detailsUrl);
    if (res.ok) {
      const html = await res.text();
      // Try to extract description from the page metadata
      const match = html.match(/<meta name="description" content="([^"]+)"/);
      if (match && match[1]) {
        return { text: match[1], source: 'metadata' };
      }
    }
  } catch {
    // fall through
  }

  throw new Error('Could not fetch book content. The book may not have digitized text available.');
}

/**
 * Fetch book metadata from Internet Archive
 * Returns available file formats and basic info
 */
export async function getBookMetadata(iaIdentifier: string): Promise<{
  title?: string;
  creator?: string;
  description?: string;
  files: { name: string; source: string; format: string; size: number }[];
}> {
  const url = `https://archive.org/metadata/${iaIdentifier}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const files = (data.files || []).map((f: any) => ({
        name: f.name,
        source: f.source,
        format: f.format,
        size: f.size,
      }));
      return {
        title: data.metadata?.title,
        creator: data.metadata?.creator,
        description: data.metadata?.description,
        files,
      };
    }
  } catch {
    // fall through
  }
  return { files: [] };
}

/**
 * Get a description / excerpt for a book from OpenLibrary
 */
export async function getOpenLibraryDescription(workKey: string): Promise<string | null> {
  try {
    const url = `${BASE_URL}${workKey}.json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.description) {
        if (typeof data.description === 'string') {
          return data.description;
        }
        if (data.description.value) {
          return data.description.value;
        }
      }
      // Try excerpts
      if (data.excerpts && data.excerpts.length > 0) {
        return data.excerpts[0].text || null;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Split text into readable sections (simulated chapters)
 */
export function splitTextIntoSections(text: string, maxSections: number = 20): { title: string; content: string }[] {
  // Clean up the OCR text
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();

  // Try to split by common chapter markers
  const chapterRegex = /(chapter|CHAPTER|Chapter)\s+\d+/g;
  const matches = [...cleaned.matchAll(chapterRegex)];

  if (matches.length >= 3) {
    const sections: { title: string; content: string }[] = [];
    for (let i = 0; i < matches.length && sections.length < maxSections; i++) {
      const startIdx = matches[i].index!;
      const endIdx = i + 1 < matches.length ? matches[i + 1].index! : cleaned.length;
      const titleSection = matches[i][0];
      const contentSection = cleaned.slice(startIdx + titleSection.length, endIdx).trim();
      if (contentSection.length > 50) {
        sections.push({ title: titleSection, content: contentSection });
      }
    }
    if (sections.length >= 2) return sections;
  }

  // Fall back to splitting by large paragraph breaks
  const paragraphs = cleaned.split(/\n\n\n+/);
  const chunkSize = Math.max(1, Math.ceil(paragraphs.length / maxSections));
  const sections: { title: string; content: string }[] = [];
  
  for (let i = 0; i < paragraphs.length && sections.length < maxSections; i += chunkSize) {
    const chunk = paragraphs.slice(i, i + chunkSize).join('\n\n');
    if (chunk.trim().length > 50) {
      sections.push({
        title: `Section ${sections.length + 1}`,
        content: chunk.trim(),
      });
    }
  }

  return sections.length > 0
    ? sections
    : [{ title: 'Text', content: cleaned.slice(0, 10000) }];
}

/**
 * Search both books and authors in one call (for combined results)
 */
export async function searchAll(
  query: string,
  params: { limit?: number; page?: number } = {}
): Promise<{ books: OLSearchResult[]; authors: OLAuthorResult[]; total: number }> {
  const [bookRes, authorRes] = await Promise.all([
    searchBooks(query, params),
    searchAuthors(query, params),
  ]);
  return {
    books: bookRes.docs,
    authors: authorRes.docs,
    total: bookRes.numFound + authorRes.numFound,
  };
}
