const AdmZip = require('./backend/node_modules/adm-zip');
const path = require('path');
const fs = require('fs');

async function createDeploymentZip() {
  const zip = new AdmZip();
  console.log('Packaging Frontend...');
  const frontendDist = path.join(__dirname, 'frontend', 'dist');
  if (fs.existsSync(frontendDist)) {
    zip.addLocalFolder(frontendDist, 'frontend_public_html');
  }

  console.log('Packaging Backend...');
  const backendDir = path.join(__dirname, 'backend');
  const backendFiles = fs.readdirSync(backendDir);
  for (const file of backendFiles) {
    if (file !== 'node_modules' && file !== '.env.local') {
      const fullPath = path.join(backendDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        zip.addLocalFolder(fullPath, `backend_app/${file}`);
      } else {
        zip.addLocalFile(fullPath, 'backend_app');
      }
    }
  }

  const outPath = path.join(__dirname, 'green-publishers-live.zip');
  zip.writeZip(outPath);
  console.log('Deployment ZIP created at:', outPath);
}

createDeploymentZip();
