# Python Interpreter Frontend

Next.js frontend for the online Python interpreter.

## Setup

1. Install dependencies:
```
npm install
```

2. Run the development server:
```
npm run dev
```

The website will be available at http://localhost:3000

## Note on Tailwind CSS

This project uses Tailwind CSS via CDN for styling. If you want to use the full Tailwind CSS with PostCSS:

1. Install Node.js and npm
2. Run `npm install` to install dependencies
3. Replace the CDN link in `_app.js` with the local Tailwind CSS setup
4. Update `globals.css` to include Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
