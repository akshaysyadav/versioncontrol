const createIssue = (req ,res) => {
    res.send("issue created");
}

const updateIsuueById = (req ,res ) => {
    res.send("issue updated") ;
}

const deleteIssueById = (req ,res ) => {
    res.send("issue deleted") ;
}

const getAllIssues = (req ,res ) => {
    res.send("all issues") ;
}

const getIssueById = (req ,res ) => {
    res.send("issue details") ;
}

module.exports = {
    createIssue,
    updateIsuueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
}