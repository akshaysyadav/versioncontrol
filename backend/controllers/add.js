const fs = require('fs').promises;
const path  = require('path');

async function addRepo(file) {
    const repoPath = path.resolve(process.cwd(), '.mygit');
    const stagingPath = path.join(repoPath, 'staging');

    try {
        await fs.mkdir(stagingPath, { recursive: true });

        const fileName = path.basename(file);
        await fs.copyFile(file, path.join(stagingPath, fileName));

        console.log(`File ${file} added to staging area.`);
    } 
    catch (err) {
        console.error('Error adding file to staging area:', err);
    }
}

module.exports = { addRepo };