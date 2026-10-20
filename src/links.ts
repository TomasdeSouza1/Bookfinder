import type { Book } from "./types";

export interface StoreLinks {
  readPdf: string;
  iberlibro: string;
  todocoleccion: string;
  mercadolibre: string;
  buscalibre: string;
}

export function generateStoreLinks(book: Book): StoreLinks {
  const mainAuthor = book.authors[0] ?? "";
  const rawSearchTerms = `${book.title} ${mainAuthor}`.trim();

  const encodedQuery = encodeURIComponent(rawSearchTerms);
  const pdfQuery = encodeURIComponent(
    `"${book.title}" "${mainAuthor}" filetype:pdf`,
  );

  return {
    readPdf: `https://www.google.com/search?q=${pdfQuery}`,
    iberlibro: `https://www.iberlibro.com/servlet/SearchResults?kn=${encodedQuery}`,
    todocoleccion: `https://www.todocoleccion.net/buscador?bu=${encodedQuery}`,
    mercadolibre: `https://www.google.com/search?q=site:mercadolibre.com.ar+${encodedQuery}`,
    buscalibre: `https://www.buscalibre.com/libros/search?q=${encodedQuery}`,
  };
}
