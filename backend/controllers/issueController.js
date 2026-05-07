const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const DB_NAME = "versionControl";

async function getDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(DB_NAME);
}

async function createIssue(req, res) {
  const { title, description, status = "open" } = req.body;
  const { id } = req.params;

  if (!title) {
    return res.status(400).json({ error: "Issue title is required!" });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Repository ID!" });
  }

  try {
    const db = await getDB();

    const issueCollection = db.collection("issues");
    const repoCollection = db.collection("repositories");

    const newIssue = {
      title,
      description,
      status,
      repository: new ObjectId(id),
      createdAt: new Date(),
    };

    const result = await issueCollection.insertOne(newIssue);

    await repoCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          issues: result.insertedId,
        },
      }
    );

    return res.status(201).json({
      message: "Issue created successfully!",
      issueID: result.insertedId,
    });

  } catch (err) {
    console.error("Error during issue creation:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function getAllIssues(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Repository ID!" });
  }

  try {
    const db = await getDB();

    const issueCollection = db.collection("issues");

    const issues = await issueCollection
      .find({ repository: new ObjectId(id) })
      .toArray();

    return res.json(issues);

  } catch (err) {
    console.error("Error fetching issues:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Issue ID!" });
  }

  try {
    const db = await getDB();

    const issueCollection = db.collection("issues");

    const issue = await issueCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    return res.json(issue);

  } catch (err) {
    console.error("Error fetching issue:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Issue ID!" });
  }

  try {
    const db = await getDB();

    const issueCollection = db.collection("issues");

    const result = await issueCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          status,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    return res.json({
      message: "Issue updated successfully!",
    });

  } catch (err) {
    console.error("Error updating issue:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Issue ID!" });
  }

  try {
    const db = await getDB();

    const issueCollection = db.collection("issues");
    const repoCollection = db.collection("repositories");

    const issue = await issueCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    await issueCollection.deleteOne({
      _id: new ObjectId(id),
    });

    await repoCollection.updateOne(
      { _id: issue.repository },
      {
        $pull: {
          issues: new ObjectId(id),
        },
      }
    );

    return res.json({
      message: "Issue deleted successfully!",
    });

  } catch (err) {
    console.error("Error deleting issue:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueById,
  deleteIssueById,
};
