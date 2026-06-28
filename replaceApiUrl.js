const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace single quote strings
      if (content.includes("'http://localhost:5000")) {
        content = content.replace(/'http:\/\/localhost:5000/g, "(import.meta.env.VITE_API_URL || 'http://localhost:5000') + '");
        changed = true;
      }
      
      // Replace double quote strings
      if (content.includes('"http://localhost:5000')) {
        content = content.replace(/"http:\/\/localhost:5000/g, "(import.meta.env.VITE_API_URL || 'http://localhost:5000') + \"");
        changed = true;
      }
      
      // Replace template literals
      if (content.includes('`http://localhost:5000')) {
        content = content.replace(/`http:\/\/localhost:5000/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}");
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'frontend', 'src'));
console.log('API URLs updated successfully!');
