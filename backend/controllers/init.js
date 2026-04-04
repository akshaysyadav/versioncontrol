const fs = require('fs').promises;
const path = require('path');

async function initRepo() {
    const repoPath = path.resolve(process.cwd(), '.mygit');
    const commitPath = path.join(repoPath, 'commits');
    const stagingPath = path.join(repoPath, 'staging');

    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitPath, { recursive: true });
        await fs.mkdir(stagingPath, { recursive: true });

        await fs.writeFile(
            path.join(repoPath, 'config.json'),
            JSON.stringify({ bucket: process.env.S3_BUCKET || "default-bucket" })
        );

        console.log('Repository initialized successfully at', repoPath);
    } 
    catch (err) {
        console.error('Error initializing repository:', err);
    }
}

module.exports = { initRepo };