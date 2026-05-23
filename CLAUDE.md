# Build White Families

Dating website built with React + Vite, deployed to Cloudflare Pages.

## Deploying changes

**Push to `main` = auto-deploy.** GitHub Actions builds the app and deploys to Cloudflare Pages automatically. No manual steps needed.

- Production URL: `buildwhitefamilies.pages.dev`
- Cloudflare account ID: `bfa7ab5ab9d8079599d35435e885f010`
- Cloudflare Pages project: `buildwhitefamilies`
- GitHub repo: `zenontherocks/buildwhitefamilies`
- Deploy branch: `main`

## Development

```bash
npm install
npm run dev      # local dev server at localhost:5173
npm run build    # production build to dist/
```

## Git workflow

The working branch is `claude/magical-cerf-xD9Wu`. To ship changes:

```bash
git add -A
git commit -m "description"
git push origin claude/magical-cerf-xD9Wu:main
git push origin claude/magical-cerf-xD9Wu
```

Both pushes are needed: `main` triggers the deploy, the feature branch keeps it in sync.

## Project structure

```
src/
  App.jsx        # main app component
  main.jsx       # entry point
index.html
vite.config.js
.github/workflows/deploy.yml   # CI/CD pipeline
```
