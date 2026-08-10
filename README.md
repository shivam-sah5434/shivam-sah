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
