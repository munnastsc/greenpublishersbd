const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../green-publishers-bd/src/app/admin');
const destDir = path.join(__dirname, 'frontend/src/pages/admin');
const appTsxPath = path.join(__dirname, 'frontend/src/App.tsx');

const skipDirs = ['login'];

function capitalize(s) {
  return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

let importsToAdd = [];
let routeReplacements = {};

fs.readdirSync(srcDir).forEach(item => {
  const itemPath = path.join(srcDir, item);
  if (fs.statSync(itemPath).isDirectory() && !skipDirs.includes(item)) {
    const pagePath = path.join(itemPath, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      let content = fs.readFileSync(pagePath, 'utf8');
      
      // Remove use client
      content = content.replace(/'use client';?\n?/g, '');
      content = content.replace(/"use client";?\n?/g, '');
      
      // Fix fetch URLs (point to backend port 5000)
      content = content.replace(/fetch\(['"`]\/api\//g, "fetch('http://localhost:5000/api/");
      
      const componentName = `Admin${capitalize(item)}`;
      const newFileName = `${componentName}.tsx`;
      
      // Make sure the export default function has the right name
      content = content.replace(/export default function \w+\(/, `export default function ${componentName}(`);
      
      fs.writeFileSync(path.join(destDir, newFileName), content);
      console.log(`Migrated ${item} -> ${newFileName}`);
      
      importsToAdd.push(`import ${componentName} from './pages/admin/${componentName}';`);
      routeReplacements[item] = `<Route path="${item}" element={<${componentName} />} />`;
    }
  }
});

// Update App.tsx
let appContent = fs.readFileSync(appTsxPath, 'utf8');

// Insert imports after the PlaceholderAdminPage import
const placeholderImport = "import PlaceholderAdminPage from './pages/admin/PlaceholderAdminPage';";
appContent = appContent.replace(placeholderImport, placeholderImport + '\n' + importsToAdd.join('\n'));

// Replace placeholders in routes
for (const [route, replacement] of Object.entries(routeReplacements)) {
  const regex = new RegExp(`<Route path="${route}" element={<PlaceholderAdminPage />} />`, 'g');
  appContent = appContent.replace(regex, replacement);
}

fs.writeFileSync(appTsxPath, appContent);
console.log('App.tsx updated!');
