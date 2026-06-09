# CampusSync (Smart Mess Menu)

This is a React Single Page Application (SPA) powered by Vite.

## Deploying to GitHub Pages 🚀

Because this is a Vite-based TypeScript and React application, **you cannot deploy the raw files (like `index.html` or `index.tsx`) directly to GitHub Pages**. Browsers do not understand TypeScript natively, and absolute paths will result in a blank white screen. 

We have updated the project configuration so that it now natively supports easy deployment to subpaths (such as your GitHub Pages project subdirectory) by using relative (`./`) asset paths.

Here are the two ways you can set up error-free deployment:

---

### Method 1: Build locally and push the `dist/` folder (Easiest)

1. **Install dependencies** on your local machine:
   ```bash
   npm install
   ```

2. **Generate the production build**:
   ```bash
   npm run build
   ```
   This will compile all TypeScript files, generate bundle optimized assets, and place everything into a folder called `dist/`.

3. **Deploy the `dist/` folder**:
   To deploy just the contents of `dist/` to your `gh-pages` branch, you can use the `gh-pages` utility:
   ```bash
   # Install gh-pages utility as a dev dependency
   npm install -D gh-pages
   ```

   Add these scripts to your `package.json` under `"scripts"`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

   Now, simply run:
   ```bash
   npm run deploy
   ```
   This command automatically builds the project and uploads the contents of the `dist/` folder to a branch called `gh-pages` on your GitHub repository.

---

### Method 2: Automatic Deploy with GitHub Actions (Recommended)

You can let GitHub automatically compile and publish your site every time you type `git push` by adding a workflow file:

1. Create a file at `.github/workflows/deploy.yml` with the following content:

   ```yaml
   name: Deploy static content to Pages

   on:
     push:
       branches: ["main"] # Change to your default branch name if it is master

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: true

   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Set up Node
           uses: actions/node-versions@v4
           with:
             node-version: 20

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build

         - name: Setup Pages
           uses: actions/configure-pages@v4

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: './dist'

         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

2. Push this file to your GitHub repository.
3. In your GitHub repository settings:
   * Go to **Settings** -> **Pages**.
   * Under **Build and deployment**, change the Source to **GitHub Actions**.

Whenever you push code, GitHub will automatically compile the TypeScript files and deploy the built `dist` folder to your site without you having to build it locally!
