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

    // Remove standalone prisma instantiations
    if (content.includes('new PrismaClient()')) {
        content = content.replace(/const\s+prisma\s*=\s*new\s+PrismaClient\([^)]*\);?\n?/g, '');
        changed = true;
    }

    // Replace imports from generated/prisma/client.js to prisma/client.js
    if (content.includes('generated/prisma/client.js')) {
        content = content.replace(/generated\/prisma\/client\.js/g, 'prisma/client.js');
        // Now also replace PrismaClient with prisma
        content = content.replace(/PrismaClient/g, 'prisma');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}
