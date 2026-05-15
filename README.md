# Gear5 - Deploy Notes

Quick steps to publish this React + Vite prototype to Vercel.

1. Push your changes to GitHub (this repo is `https://github.com/2icekubes/gear5`).

2. Import the repository on Vercel:
   - Go to https://vercel.com/new and select the GitHub repo `2icekubes/gear5`.
   - Vercel will detect settings. Use **Build Command**: `npm run build` and **Output Directory**: `dist`.
   - `vercel.json` is included to enable SPA routing.

3. After the first deployment, future pushes to `master` will auto-deploy.

CLI deploy (optional):
```bash
npm i -g vercel
vercel login
vercel --prod
```

If you want, I can complete the Vercel import step or provide a Netlify alternative.
