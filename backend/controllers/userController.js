const getAllUsers = (req, res) => {
    res.send("get all user");
}

const signUp = (req, res) => {
    res.send("sign up");
}

const login = (req, res) => {
    res.send("login");
}

const getUserProfile = (req, res) => {
    res.send("get user profile");
}

const updateUserProfile = (req, res) => {
    res.send("update user profile");
}

const deleteUserProfile = (req, res) => {
    res.send("delete user profile");
}   

module.exports = {
    getAllUsers,
    signUp,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};