import fs from 'fs';
import { categories, toolPaths } from './src/config/tools.js';

const baseUrl = 'https://alltools.com';
const langs = ['en', 'pt', 'es'];
const legalPages = ['privacy', 'terms', 'cookies', 'contact'];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Home pages
langs.forEach(lang => {
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/${lang}</loc>\n`;
  langs.forEach(l => {
    xml += `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}" />\n`;
  });
  xml += `  </url>\n`;
});

// Legal pages
legalPages.forEach(page => {
  langs.forEach(lang => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${lang}/${page}</loc>\n`;
    langs.forEach(l => {
      xml += `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}/${page}" />\n`;
    });
    xml += `  </url>\n`;
  });
});

// Tools
categories.forEach(category => {
  category.tools.forEach(toolId => {
    langs.forEach(lang => {
      const path = toolPaths[toolId][lang];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/${lang}/${path}</loc>\n`;
      langs.forEach(l => {
        const p = toolPaths[toolId][l];
        xml += `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}/${p}" />\n`;
      });
      xml += `  </url>\n`;
    });
  });
});

xml += `</urlset>\n`;

fs.writeFileSync('./public/sitemap.xml', xml);
console.log('Sitemap generated successfully!');
