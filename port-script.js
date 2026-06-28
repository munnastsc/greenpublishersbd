const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\Faisa\\.gemini\\antigravity\\scratch\\green-publishers-bd\\src';
const destDir = 'C:\\Users\\Faisa\\.gemini\\antigravity\\scratch\\green-publishers-cpanel\\frontend\\src';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy components
copyRecursiveSync(path.join(sourceDir, 'components'), path.join(destDir, 'components'));

// Transform files
function transformFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace next/link
  content = content.replace(/import Link from ['"]next\/link['"];?/g, "import { Link } from 'react-router-dom';");
  
  // Replace next/image
  content = content.replace(/import Image from ['"]next\/image['"];?/g, "");
  content = content.replace(/<Image([^>]+)\/>/g, (match, p1) => {
    // Convert Image to img, retaining src and alt
    return `<img${p1} loading="lazy" />`;
  });

  // Replace usePathname
  content = content.replace(/import { usePathname } from ['"]next\/navigation['"];?/g, "import { useLocation } from 'react-router-dom';");
  content = content.replace(/const pathname = usePathname\(\);?/g, "const location = useLocation(); const pathname = location.pathname;");
  
  // Replace next/navigation useRouter
  content = content.replace(/import { useRouter } from ['"]next\/navigation['"];?/g, "import { useNavigate } from 'react-router-dom';");
  content = content.replace(/const router = useRouter\(\);?/g, "const navigate = useNavigate();");
  content = content.replace(/router\.push\((.*?)\)/g, "navigate($1)");
  content = content.replace(/router\.back\(\)/g, "navigate(-1)");

  // Replace next-auth useSession
  content = content.replace(/import { useSession } from ['"]next-auth\/react['"];?/g, "import { useSession } from '../context/SessionContext';");

  fs.writeFileSync(filePath, content);
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      transformFile(fullPath);
    }
  });
}

processDirectory(path.join(destDir, 'components'));

console.log("Transformation complete.");
