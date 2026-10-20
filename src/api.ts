import type {
  Book,
  OpenLibraryDoc,
  OpenLibraryResponse,
  SearchFilters,
} from "./types";

const BASE_URL = "https://openlibrary.org/search.json";

function mapDocToBook(doc: OpenLibraryDoc): Book {
  const iaId = doc.ia?.[0];
  const canReadOnline = Boolean(doc.has_fulltext && iaId);

  return {
    id: doc.key,
    title: doc.title,
    authors: doc.author_name ?? ["Autor desconocido"],
    firstPublishYear: doc.first_publish_year ?? null,
    editionCount: doc.edition_count ?? 1,
    publishers: doc.publisher ?? [],
    languages: doc.language ?? [],
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
    readOnlineUrl: canReadOnline ? `https://archive.org/details/${iaId}` : null,
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

  const params = new URLSearchParams({
    q: queryParts.join(" "),
    limit: "40",
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
