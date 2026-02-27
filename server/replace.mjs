import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes('@prisma/client') || content.includes('generated/prisma/index.js')) {
        const depth = file.split(path.sep).length - 2; // relative to src
        let relativePath = '';
        if (depth === 0) relativePath = './generated/prisma/client.js';
        else if (depth === 1) relativePath = '../generated/prisma/client.js';
        else if (depth === 2) relativePath = '../../generated/prisma/client.js';
        else if (depth === 3) relativePath = '../../../generated/prisma/client.js';
        else if (depth === 4) relativePath = '../../../../generated/prisma/client.js';

        // Replace @prisma/client with relativePath
        content = content.replace(/from\s+['"]@prisma\/client['"]/g, `from "${relativePath}"`);
        // Also fix the ones that point to index.js
        content = content.replace(/generated\/prisma\/index\.js/g, `generated/prisma/client.js`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}
