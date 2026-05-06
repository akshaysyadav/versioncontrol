const createRepository = (req, res) => {
    res.send("created repository");
}

const getAllRepositories = (req, res) => {
    res.send("get all repositories");
}

const fetchRepositoryById = (req, res) => {
    res.send("get repository by id");
}

const fetchRepositoryByName  = (req, res) => {
    res.send("get repository by name");
}

const fetchRepositoriesForCurrentUser = (req, res) => {
    res.send("get repositories for User");
}

const updateRepositoryById = (req, res) => {
    res.send("update repository");
}   

const toggleVisibilityById = (req, res) => {
    res.send("toggle repository visibility");
}

const deleteRepositoryById = (req, res) => {
    res.send("delete repository");
}

module.exports = {
    createRepository,
    getAllRepositories, 
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById
};

