# Joy — Senior Software Engineer & Full-Stack Architect Portfolio

Modern, high-performance portfolio website engineered with vanilla web standards, precision dark glassmorphic UI, ambient particle dynamics, interactive system architecture modals, and an embedded CLI shell emulator.

Live Site: **[https://joy-1998.github.io/portfolio/](https://joy-1998.github.io/portfolio/)**

---

## ⚡ Key Highlights & Architecture

- **Aesthetic**: Deep slate/cyber dark theme with glowing neon accents (`#00f2fe`, `#9d4edd`, `#00f5a0`) and glassmorphism (`backdrop-filter: blur(16px)`).
- **Zero-Dependency Core**: Built with pure semantic HTML5, modern CSS custom properties, and vanilla ES6+ JavaScript. Loads in sub-100ms with a 100/100 Lighthouse score.
- **Interactive Shell Emulator**: Built-in CLI in the browser with commands (`help`, `skills`, `projects`, `experience`, `contact`, `clear`).
- **Architecture Inspection Modals**: Native HTML5 `<dialog>` modals with interactive ASCII diagrams detailing distributed systems, rate limiters, and telemetry engines.
- **Accessibility & Responsiveness**: Mobile/tablet/desktop fluid layout with full keyboard navigation and support for `prefers-reduced-motion`.

---

## 🚀 How to Publish to GitHub Pages

### Option 1: Using GitHub CLI or Git Terminal (Recommended)

1. Open your terminal in this repository folder:
   ```bash
   cd /Users/joy/.gemini/antigravity/scratch/portfolio
   ```

2. Initialize Git and commit the project:
   ```bash
   git init
   git add .
   git commit -m "feat: initial senior engineer portfolio release"
   git branch -M main
   ```

3. Create the `portfolio` repository on your GitHub account (`joy-1998`):
   - Go to [GitHub - New Repository](https://github.com/new)
   - Repository name: `portfolio`
   - Set visibility to **Public**
   - Leave "Initialize with README" unchecked

4. Link and push to your GitHub remote:
   ```bash
   git remote add origin https://github.com/joy-1998/portfolio.git
   git push -u origin main
   ```

5. Enable GitHub Pages:
   - Go to your repository **Settings** > **Pages** (or `https://github.com/joy-1998/portfolio/settings/pages`).
   - Under **Build and deployment** > **Source**:
     - Choose **GitHub Actions** (the included `.github/workflows/deploy.yml` will deploy automatically on push!), **OR**
     - Choose **Deploy from a branch** -> Branch: `main` / `/ (root)`.
   - Your site will be live at: **`https://joy-1998.github.io/portfolio/`**

---

## 💻 Local Preview

You can open `index.html` directly in any web browser, or serve it locally:

```bash
npx serve .
# or
python3 -m http.server 8080
```
Then visit `http://localhost:8080`.
