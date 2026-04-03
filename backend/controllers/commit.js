const fs = require('fs').promises;
const path = require('path');
const {v4: uuidv4} = require('uuid');

async function commitRepo({ message }) {
  const repoPath = path.resolve(process.cwd(), '.mygit');
  if (!await fs.access(repoPath).then(() => true).catch(() => false)) {
    console.error('Error: Not a mygit repository. Please run "mygit init" first.');
    return;
  }
  const stagingPath = path.join(repoPath, 'staging');
  if (!await fs.access(stagingPath).then(() => true).catch(() => false)) {
    console.error('Error: No staging directory. Run "mygit add" first.');
    return;
  }
  const files = await fs.readdir(stagingPath);
  if (files.length === 0) {
    console.error('Error: No files in staging area. Add files first.');
    return;
  }
  const commitsPath = path.join(repoPath, 'commits');
  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitsPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });
    
    for (const file of files) {
      await fs.copyFile(path.join(stagingPath, file), path.join(commitDir, file));
    }
    await fs.writeFile(path.join(commitDir, 'message.txt'), JSON.stringify({ message, timestamp: new Date().toISOString() }));
    console.log(`Committed with ID: ${commitID}`);
    // Clear staging after successful commit (git-like)
    for (const file of files) {
      await fs.unlink(path.join(stagingPath, file)).catch(() => {}); // Ignore unlink fails
    }
  } catch (err) {
    console.error('Commit failed:', err.message);
  }
}

module.exports = { commitRepo };
