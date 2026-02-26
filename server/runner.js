const { execSync } = require('child_process');
try {
    execSync('npx prisma generate', { encoding: 'utf-8', stdio: 'pipe' });
} catch (e) {
    console.log(e.stdout);
    console.log(e.stderr);
    console.log(e.message);
}
