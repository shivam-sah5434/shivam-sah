# Shivam Sah — GitHub Pages Portfolio

Clean static version of the Shivam Sah portfolio, prepared for GitHub Pages.

## Deploy

1. Upload the contents of this folder to the root of your GitHub repository.
2. Keep `index.html` at the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, select `main`, and choose `/ (root)`.
4. After publishing, hard-refresh the site with `Ctrl + Shift + R` if an older CSS version is cached.

## Structure

- `index.html` — main page
- `css/style.css` — all site styling
- `js/script.js` — interactions, animation, theme toggle, project modal, and contact fallback
- `images/core-profile.jpg` — hero portrait used inside the framed engineering visual
- `images/profile.png` — About section portrait
- `images/logo.png` — site logo
- `images/projects/` — project artwork

## Hero frame fix

The hero portrait is deliberately contained by `.core` and `.core img` with explicit dimensions, overflow clipping, object-fit, and border-radius rules. The final frame rules are also reinforced in the page head so the portrait cannot fall back to its original rectangular shape because of a stale/partial stylesheet.

## Contact form

The site is GitHub Pages compatible. If no backend API is configured, the contact form opens the visitor's default email application with the submitted details. A backend can still be added later by setting `window.API_BASE_URL` before `script.js`.

## SEO deployment notes

This version includes a canonical URL, crawl directives, Open Graph/Twitter metadata, Person + WebSite structured data, `robots.txt`, `sitemap.xml`, and a web manifest for `https://shivams.com.np/`.

After deploying the files to GitHub Pages:
1. Confirm `https://shivams.com.np/robots.txt` loads.
2. Confirm `https://shivams.com.np/sitemap.xml` loads.
3. Add/verify the domain in Google Search Console.
4. Submit the sitemap URL and request indexing for `https://shivams.com.np/`.

A Google Search Console verification token is intentionally not hard-coded because it is unique to the verified Search Console property.
