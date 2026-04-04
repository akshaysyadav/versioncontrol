const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function commitRepo({ message }) {
    const repoPath = path.resolve(process.cwd(), '.mygit');

    // Check repo exists
    try {
        await fs.access(repoPath);
    } catch {
        console.error('Error: Not a mygit repository. Run "mygit init" first.');
        return;
    }

    const stagingPath = path.join(repoPath, 'staging');

    // Check staging exists
    try {
        await fs.access(stagingPath);
    } catch {
        console.error('Error: No staging directory. Run "mygit add" first.');
        return;
    }

    const files = await fs.readdir(stagingPath);

    if (files.length === 0) {
        console.error('Error: No files in staging area.');
        return;
    }

    const commitsPath = path.join(repoPath, 'commits');

    try {
        const commitID = uuidv4();
        const commitDir = path.join(commitsPath, commitID);

        await fs.mkdir(commitDir, { recursive: true });

        for (const file of files) {
            await fs.copyFile(
                path.join(stagingPath, file),
                path.join(commitDir, file)
            );
        }

        await fs.writeFile(
            path.join(commitDir, 'message.json'),
            JSON.stringify({
                message,
                timestamp: new Date().toISOString()
            }, null, 2)
        );

        console.log(`Committed with ID: ${commitID}`);

        // Clear staging
        for (const file of files) {
            await fs.unlink(path.join(stagingPath, file));
        }

    } catch (err) {
        console.error('Commit failed:', err.message);
    }
}

module.exports = { commitRepo };