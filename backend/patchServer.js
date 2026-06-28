const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'src', 'server.ts');
let content = fs.readFileSync(serverPath, 'utf8');

const entities = [
  'Author', 'Publisher', 'Unit', 'Order', 'Coupon', 'User', 
  'HomeSection', 'MenuItem', 'EducationalMaterial', 'TrainingManual', 
  'CustomPage', 'Banner', 'Video', 'AudioLesson'
];

let imports = '';
let routes = '';

entities.forEach(e => {
  imports += `import { ${e}Controller } from './controllers/${e}Controller';\n`;
  const routeName = e.toLowerCase() + 's';
  routes += `
app.get('/api/${routeName}', ${e}Controller.getAll);
app.get('/api/${routeName}/:id', ${e}Controller.getById);
app.post('/api/${routeName}', ${e}Controller.create);
app.put('/api/${routeName}/:id', ${e}Controller.update);
app.delete('/api/${routeName}/:id', ${e}Controller.delete);
`;
});

// For books and categories, we already have get, but need post/put/delete
imports += `
// Adding POST/PUT/DELETE for existing controllers in a safe way if they don't exist
`;
routes += `
app.post('/api/books', BookController.create || ((req, res) => res.status(501).send('Not implemented')));
app.put('/api/books/:id', BookController.update || ((req, res) => res.status(501).send('Not implemented')));
app.delete('/api/books/:id', BookController.delete || ((req, res) => res.status(501).send('Not implemented')));

app.post('/api/categories', CategoryController.create || ((req, res) => res.status(501).send('Not implemented')));
app.put('/api/categories/:id', CategoryController.update || ((req, res) => res.status(501).send('Not implemented')));
app.delete('/api/categories/:id', CategoryController.delete || ((req, res) => res.status(501).send('Not implemented')));
`;

const importSplit = content.split('dotenv.config();');
content = importSplit[0] + imports + '\ndotenv.config();' + importSplit[1];

const routeSplit = content.split('// Media & Activation Routes');
content = routeSplit[0] + '// Generated CRUD Routes\n' + routes + '\n// Media & Activation Routes' + routeSplit[1];

fs.writeFileSync(serverPath, content);
console.log('server.ts patched');
