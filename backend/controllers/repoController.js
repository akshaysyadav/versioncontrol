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

async function createRepository(req, res) {
  const { owner, name, issues = [], content = [], description, visibility = "public" } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Repository name is required!" });
  }

  if (!ObjectId.isValid(owner)) {
    return res.status(400).json({ error: "Invalid User ID!" });
  }

  try {
    const db = await getDB();
    const repoCollection = db.collection("repositories");

    const newRepo = {
      name,
      description,
      visibility,
      owner: new ObjectId(owner),
      content,
      issues,
    };

    const result = await repoCollection.insertOne(newRepo);

    return res.status(201).json({
      message: "Repository created!",
      repositoryID: result.insertedId,
    });

  } catch (err) {
    console.error("Error during repository creation:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function getAllRepositories(req, res) {
  try {
    const db = await getDB();
    const repoCollection = db.collection("repositories");

    const repos = await repoCollection.find().toArray();

    return res.json(repos);

  } catch (err) {
    console.error("Error fetching repos:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function fetchRepositoryById(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const db = await getDB();
    const repoCollection = db.collection("repositories");

    const repo = await repoCollection.findOne({ _id: new ObjectId(id) });

    if (!repo) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    return res.json(repo); // ✅ FIXED

  } catch (err) {
    console.error("Error fetching repo:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function fetchRepositoryByName(req, res) {
  const { name } = req.params;

  try {
    const db = await getDB();
    const repoCollection = db.collection("repositories");

    const repos = await repoCollection.find({ name }).toArray();

    return res.json(repos);

  } catch (err) {
    console.error("Error fetching repo by name:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  const { userID } = req.params;

  if (!ObjectId.isValid(userID)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }

  try {
    const db = await getDB();
    const repoCollection = db.collection("repositories");

    const repos = await repoCollection
      .find({ owner: new ObjectId(userID) })
      .toArray();

    if (repos.length === 0) {
      return res.status(404).json({ error: "No repositories found!" });
    }

    return res.json({ message: "Repositories found!", repos });

  } catch (err) {
    console.error("Error fetching user repos:", err);
    return res.status(500).json({ error: "Server error" });
  }
}



async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const db = await getDB();
    const repoCollection = db.collection("repositories");

    const result = await repoCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { content },
        $set: { description },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    return res.json({ message: "Repository updated successfully!" });

  } catch (err) {
    console.error("Error updating repo:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const db = await getDB();
    const repoCollection = db.collection("repositories");

    const repo = await repoCollection.findOne({ _id: new ObjectId(id) });

    if (!repo) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    const newVisibility = repo.visibility === "public" ? "private" : "public";

    await repoCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { visibility: newVisibility } }
    );

    return res.json({ message: "Visibility toggled!" });

  } catch (err) {
    console.error("Error toggling visibility:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;

  try {
    const db = await getDB();
    const repoCollection = db.collection("repositories");

    const result = await repoCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    return res.json({ message: "Repository deleted successfully!" });

  } catch (err) {
    console.error("Error deleting repo:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};