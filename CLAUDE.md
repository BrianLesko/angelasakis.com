# CLAUDE.md - Guidelines for angelasakis.com

## Commands
- **Start server**: `./start.sh` (uses Caddy server)
- **View locally**: After starting, visit `http://localhost` or `http://angelasakis.com`
- **Lint JS**: `npx eslint public/script.js`
- **Format code**: `npx prettier --write public/*.{js,html,css,md}`

## File Structure
- `public/` - Contains all public-facing website files
- `public/index.html` - Main HTML structure
- `public/home.md` - Main content rendered via markdown
- `public/script.js` - JavaScript for markdown rendering and interactions
- `public/*.png` - Portfolio images

## Code Style Guidelines
- **HTML**: Use TailwindCSS classes with DaisyUI components
- **JS**: Modern ES6+, async/await for fetch operations
- **Markdown**: Used for main content, supports HTML and TailwindCSS classes
- **Error handling**: Use try/catch blocks with console.error logging
- **Naming**: Use camelCase for JS variables/functions
- **Documentation**: Include comments for function purpose and parameters

## Architecture Notes
- Content is primarily loaded from markdown files and rendered via marked.js
- Site uses TailwindCSS for styling with DaisyUI component library
- Deployment uses Caddy server with automatic configuration