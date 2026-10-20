import type {
  Book,
  OpenLibraryDoc,
  OpenLibraryResponse,
  SearchFilters,
} from "./types";

const BASE_URL = "https://openlibrary.org/search.json";

function mapDocToBook(doc: OpenLibraryDoc): Book {
  const iaId = doc.ia?.[0];
  const isPublicDomainYear =
    doc.first_publish_year !== undefined && doc.first_publish_year <= 1929;
  const canReadOnline = Boolean(
    doc.ebook_access === "public" ||
      doc.public_scan_b === true ||
      isPublicDomainYear,
  );

  const editionPublishers =
    doc.editions?.docs?.flatMap((ed) => ed.publisher ?? []) ?? [];
  const allPublishers = [
    ...new Set([...(doc.publisher ?? []), ...editionPublishers]),
  ];

  return {
    id: doc.key,
    title: doc.title,
    authors: doc.author_name ?? ["Autor desconocido"],
    firstPublishYear: doc.first_publish_year ?? null,
    editionCount: doc.edition_count ?? 1,
    publishers: allPublishers,
    languages: doc.language ?? [],
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
    readOnlineUrl: iaId ? `https://archive.org/details/${iaId}` : null,
    hasFullText: canReadOnline,
  };
}

export async function searchBooks(filters: SearchFilters): Promise<Book[]> {
  const queryParts: string[] = [];

  if (filters.title.trim() !== "") {
    queryParts.push(`title:"${filters.title.trim()}"`);
  }
  if (filters.author.trim() !== "") {
    queryParts.push(`author:"${filters.author.trim()}"`);
  }
  if (filters.publisher.trim() !== "") {
    queryParts.push(`publisher:"${filters.publisher.trim()}"`);
  }
  if (filters.language !== "all") {
    queryParts.push(`language:${filters.language}`);
  }
  if (filters.yearFrom !== undefined || filters.yearTo !== undefined) {
    const from = filters.yearFrom ?? 1800;
    const to = filters.yearTo ?? 2026;
    queryParts.push(`first_publish_year:[${from} TO ${to}]`);
  }
  if (filters.onlyFreeReading) {
    queryParts.push(`(ebook_access:public OR first_publish_year:[1800 TO 1929])`);
  }

  const params = new URLSearchParams({
    q: queryParts.join(" "),
    limit: "40",
    fields:
      "key,title,author_name,first_publish_year,edition_count,publisher,language,has_fulltext,public_scan_b,ebook_access,ia,cover_i,editions,editions.publisher",
  });

  if (filters.sortBy === "oldest") {
    params.set("sort", "old");
  } else if (filters.sortBy === "newest") {
    params.set("sort", "new");
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Error al consultar: ${response.status}`);
  }

  const data: OpenLibraryResponse = await response.json();

  return data.docs.map(mapDocToBook).filter((book) => {
    if (filters.onlyFreeReading && !book.hasFullText) {
      return false;
    }
    if (
      filters.yearFrom !== undefined &&
      (book.firstPublishYear === null ||
        book.firstPublishYear < filters.yearFrom)
    ) {
      return false;
    }
    if (
      filters.yearTo !== undefined &&
      (book.firstPublishYear === null || book.firstPublishYear > filters.yearTo)
    ) {
      return false;
    }
    return true;
  });
}
