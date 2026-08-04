const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/serco/OneDrive/Desktop/clases/proyecto SAM/front real/Frontend-SAM-Events/src/app/core/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
  const filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('http://localhost:3000/api')) {
    content = content.replace(/['"]http:\/\/localhost:3000\/api(.*?)['"]/g, '`${environment.apiUrl}$1`');
    if (!content.includes('environment')) {
      content = `import { environment } from '../../../environments/environment.development';\n` + content;
    }
    fs.writeFileSync(filepath, content);
    console.log(`Updated ${f}`);
  }
});
