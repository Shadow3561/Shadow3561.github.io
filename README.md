# Neue Website

The folder contains a local combined website for BaseBar Menu and Old Launchpad:

- `index.html` is the shared product overview.
- `basebar-menu/` contains the copied BaseBar Menu website, updated for the Dock and menu bar features.
- `old-launchpad/` contains the copied Old Launchpad website.
- `robots.txt` and `sitemap.xml` are prepared for search engine crawling.

## Local preview

From this directory, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Google Search Console and deployment

SEO metadata, canonical URLs, language alternates, structured data, `robots.txt`, and the sitemap use the combined GitHub Pages site:

```text
https://shadow3561.github.io/
```

The Search Console verification tag is retained on the root page. After deployment, submit `https://shadow3561.github.io/sitemap.xml` in Search Console.

The shared home page and both product pages support German, English, Spanish, and French. The language selector uses the `lang` URL parameter and does not store a preference in cookies or local browser storage.

The product pages keep their checkout and download destinations. BaseBar Menu's trial download is served by the `Shadow3561/BaseBar-Menu_Trail` repository.

No analytics or tracking scripts have been added.
