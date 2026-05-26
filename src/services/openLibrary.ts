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
