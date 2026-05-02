const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3.listObjectsV2({ Bucket: S3_BUCKET, Prefix: "commits/" }).promise();
    const objects = data.Contents;

    for(const obj of objects) {
      const key = obj.Key;
      const commitDir = path.join(commitsPath, path.dirname(key).split('/').pop());
      await fs.mkdir(commitDir, { recursive: true });

      const params = {
        Bucket: S3_BUCKET,
        Key: key,
      };

      const fileData = await s3.getObject(params).promise();
      await fs.writeFile(path.join(commitDir, path.basename(key)), fileData.Body);

      console.log(`Pulled ${key} from S3.`);
  }
}
    catch (err) {
    console.error("Error pulling from S3 : ", err); 
    }
}

module.exports = { pullRepo };
