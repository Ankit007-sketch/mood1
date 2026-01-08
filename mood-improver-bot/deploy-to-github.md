# Deploy to GitHub Pages

1. Create a new GitHub repository (public or private).
2. In this project folder run:

```bash
git init
git add .
git commit -m "Initial commit - Mood Improver Bot"
git branch -M main
git remote add origin https://github.com/<YOUR_USER>/<YOUR_REPO>.git
git push -u origin main
```

3. In your repository settings -> Pages: Set Source to `main` branch and `/ (root)` or `/docs` as appropriate. Save.
4. Wait a minute — your site will be available at `https://<YOUR_USER>.github.io/<YOUR_REPO>/mood-improver-bot/` (or root if you pushed to root).

Tip: If you want the site at the repository root, keep files in the repository root. For a single-folder site, you can push only `mood-improver-bot` contents to repo root.
