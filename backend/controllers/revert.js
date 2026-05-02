const fs = require('fs').promises;
const path = require('path');

async function revertRepo(commitID) {
  try {
    const repoPath = path.resolve(process.cwd(), ".mygit");
    const commitsPath = path.join(repoPath, "commits");
    const commitDir = path.join(commitsPath, commitID);

    // Check if commit exists
    const files = await fs.readdir(commitDir);

    // Restore files to project root
    for (const file of files) {
      const src = path.join(commitDir, file);
      const dest = path.join(process.cwd(), file);

      await fs.copyFile(src, dest);
    }

    console.log(`Reverted to commit ${commitID}`);
  } catch (error) {
    console.error("Error reverting repository:", error.message);
  }
}

module.exports = { revertRepo };