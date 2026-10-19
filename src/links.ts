import type { Book } from "./types";

export interface StoreLinks {
  iberlibro: string;
  todocoleccion: string;
  mercadolibre: string;
  buscalibre: string;
}

export function generateStoreLinks(book: Book): StoreLinks {
  const mainAuthor = book.authors[0] ?? "";
  const rawSearchTerms = `${book.title} ${mainAuthor}`.trim();

  const encodedQuery = encodeURIComponent(rawSearchTerms);
  const mlSlug = encodeURIComponent(rawSearchTerms.replace(/\s+/g, "-"));

  return {
    iberlibro: `https://www.iberlibro.com/servlet/SearchResults?kn=${encodedQuery}`,
    todocoleccion: `https://www.todocoleccion.net/buscador?bu=${encodedQuery}`,
    mercadolibre: `https://listado.mercadolibre.com.ar/${mlSlug}#D[A:${encodedQuery}]`,
    buscalibre: `https://www.buscalibre.com/libros/search?q=${encodedQuery}`,
  };
}
