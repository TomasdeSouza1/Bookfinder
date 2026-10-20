# 📚 BookFinder

Buscador y agregador web de libros antiguos, primeras ediciones y títulos descatalogados, construido con **TypeScript** y **Vite**.

## ✨ Características

- **Búsqueda precisa e independiente:** Filtrado por **Título**, **Autor**, **Editorial**, **Idioma** y **Rango de años de publicación** conectando con la API de Open Library.
- **Filtro rápido en pantalla:** Desplegable dinámico que extrae todas las editoriales de los resultados obtenidos para filtrar al instante sin recargar ni volver a consultar la API.
- **Lectura digital directa:**
  - Detección de obras en dominio público o con acceso digital abierto (`ebook_access: public` / pre-1929).
  - Botón directo para buscar y abrir el **PDF completo** en el visor del navegador (`filetype:pdf`).
- **Compra física en 1 clic:** Generación automática de enlaces de búsqueda hacia librerías especializadas en libros usados, antiguos y de catálogo:
  - **IberLibro**
  - **Todocoleccion**
  - **MercadoLibre**
  - **BuscaLibre**

## 🛠️ Tecnologías

- **TypeScript** (Tipado estricto, interfaces para API y modelo de dominio)
- **Vite** 
- **HTML5 & CSS3** 
- **Open Library Search API**

## 🚀 Instalación y uso local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/TomasdeSouza1/BookFinder.git
   cd BookFinder
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Compilar para producción:
   ```bash
   npm run build
   ```

## 📂 Estructura del proyecto

```text
BookFinder/
├── index.html          # Estructura principal y formulario de filtros
├── src/
│   ├── types.ts        # Interfaces y tipos de TypeScript (Book, SearchFilters, OpenLibraryDoc)
│   ├── api.ts          # Cliente HTTP para Open Library y mapeo de datos
│   ├── links.ts        # Generador de enlaces a PDF y tiendas físicas
│   ├── main.ts         # Lógica del DOM, renderizado de tarjetas y eventos
│   └── style.css       # Estilos y grilla responsive
├── package.json
└── tsconfig.json
```
