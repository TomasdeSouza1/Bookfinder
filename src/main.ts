import "./style.css";
import { searchBooks } from "./api";
import { generateStoreLinks } from "./links";
import type { Book, LanguageFilter, SearchFilters } from "./types";

//Elementos del DOM
const form = document.querySelector<HTMLFormElement>("#search-form")!;
const titleInput = document.querySelector<HTMLInputElement>("#title")!;
const authorInput = document.querySelector<HTMLInputElement>("#author")!;
const publisherInput = document.querySelector<HTMLInputElement>("#publisher")!;
const languageSelect = document.querySelector<HTMLSelectElement>("#language")!;
const yearFromInput = document.querySelector<HTMLInputElement>("#year-from")!;
const yearToInput = document.querySelector<HTMLInputElement>("#year-to")!;
const onlyFreeCheckbox =
  document.querySelector<HTMLInputElement>("#only-free")!;
const sortBySelect = document.querySelector<HTMLSelectElement>("#sort-by")!;
const quickPublisherSelect =
  document.querySelector<HTMLSelectElement>("#quick-publisher")!;
const statusEl = document.querySelector<HTMLElement>("#status")!;
const resultsEl = document.querySelector<HTMLElement>("#results")!;

let currentBooks: Book[] = [];

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderCard(book: Book): string {
  const links = generateStoreLinks(book);
  const title = escapeHtml(book.title);
  const authors = escapeHtml(book.authors.join(", "));
  const year = book.firstPublishYear
    ? `Publicado en ${book.firstPublishYear}`
    : "Año desconocido";
  const publishers = escapeHtml(
    book.publishers.slice(0, 3).join(", ") || "Sin editorial registrada",
  );
  const langs = escapeHtml(
    book.languages.slice(0, 5).join(", ").toUpperCase() || "N/A",
  );

  const coverHtml = book.coverUrl
    ? `<img src="${book.coverUrl}" alt="Portada de ${title}" class="book-cover" loading="lazy" />`
    : `<div class="book-cover placeholder"><span>${title}</span></div>`;

  const badgeHtml = book.hasFullText
    ? `<span class="badge available"> Disponible para leer online</span>`
    : `<span class="badge physical"> Solo en librerías físicas / catálogo</span>`;

  const readBtnHtml = `<a href="${links.readPdf}" target="_blank" rel="noopener noreferrer" class="btn-read">📄 Buscar PDF para leer</a>`;

  return `                                                                                                                                           
        <article class="book-card">                                                                                                                      
          ${coverHtml}                                                                                                                                   
          <div class="book-info">                                                                                                                        
            <h3>${title}</h3>                                                                                                                            
            <p class="authors">${authors}</p>                                                                                                            
            <p class="meta">${year} · ${book.editionCount} ${book.editionCount === 1 ? "edición" : "ediciones"}</p>                                      
            <p class="meta"><strong>Editoriales:</strong> ${publishers}</p>                                                                              
            <p class="meta"><strong>Idiomas:</strong> ${langs}</p>                                                                                       
            ${badgeHtml}                                                                                                                                 
            <div class="actions">                                                                                                                        
              ${readBtnHtml}                                                                                                                             
              <div class="store-links">                                                                                                                  
                <a href="${links.iberlibro}" target="_blank" rel="noopener noreferrer">IberLibro</a>                                                     
                <a href="${links.todocoleccion}" target="_blank" rel="noopener noreferrer">Todocoleccion</a>                                             
                <a href="${links.mercadolibre}" target="_blank" rel="noopener noreferrer">MercadoLibre</a>                                               
                <a href="${links.buscalibre}" target="_blank" rel="noopener noreferrer">BuscaLibre</a>                                                   
              </div>                                                                                                                                     
            </div>                                                                                                                                       
          </div>                                                                                                                                         
        </article>                                                                                                                                       
      `;
}
function renderResults(): void {
  const selectPub = quickPublisherSelect.value;
  const filtered = selectPub
    ? currentBooks.filter((b) => b.publishers.includes(selectPub))
    : currentBooks;

  if (filtered.length === 0) {
    resultsEl.innerHTML = "";
    statusEl.textContent = "No se encontraron Libros con esos filtros.";
    return;
  }
  statusEl.textContent = `Mostrando ${filtered.length} ${filtered.length === 1 ? "libro" : "libros"}`;
  resultsEl.innerHTML = filtered.map(renderCard).join("");
}

function updateQuickPublisherOptions(books: Book[]): void {
  const pubSet = new Set<string>();
  for (const book of books) {
    for (const pub of book.publishers) {
      pubSet.add(pub);
    }
  }
  const sorted = [...pubSet].sort((a, b) => a.localeCompare(b));

  quickPublisherSelect.innerHTML =
    `<option value="">Todas las editoriales (${sorted.length})</option>` +
    sorted
      .map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`)
      .join("");
  quickPublisherSelect.disabled = sorted.length === 0;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const publisher = publisherInput.value.trim();

  if (!title && !author && !publisher) {
    statusEl.textContent = "Ingresá al menos un título, autor o editorial.";
    return;
  }

  const yearFrom = yearFromInput.value ? Number(yearFromInput.value) : undefined;
  const yearTo = yearToInput.value ? Number(yearToInput.value) : undefined;

  if (yearFrom !== undefined && yearTo !== undefined && yearFrom > yearTo) {
    statusEl.textContent = "El 'Año desde' no puede ser mayor que el 'Año hasta'.";
    return;
  }

  const filters: SearchFilters = {
    title,
    author,
    publisher,
    language: languageSelect.value as LanguageFilter,
    yearFrom,
    yearTo,
    onlyFreeReading: onlyFreeCheckbox.checked,
    sortBy: sortBySelect.value as SearchFilters["sortBy"],
  };

  statusEl.textContent = "Buscando Libros...";
  resultsEl.innerHTML = "";
  quickPublisherSelect.disabled = true;

  try {
    currentBooks = await searchBooks(filters);
    updateQuickPublisherOptions(currentBooks);
    renderResults();
  } catch (erros) {
    statusEl.textContent =
      erros instanceof Error ? erros.message : "Error inesperado al Buscar.";
  }
});

quickPublisherSelect.addEventListener("change", renderResults);
