const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/serco/OneDrive/Desktop/clases/proyecto SAM/front real/Frontend-SAM-Events/src/app/core/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
  const filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('environment.apiUrl') && !content.includes('import { environment }')) {
    content = "import { environment } from '../../../environments/environment.development';\n" + content;
    fs.writeFileSync(filepath, content);
    console.log(`Fixed import in ${f}`);
  }
});
