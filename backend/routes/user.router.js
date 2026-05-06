const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/allUsers', userController.getAllUsers); 
userRouter.post('/signUp', userController.signUp);       
userRouter.post('/login', userController.login);
userRouter.get('/userProfile',userController.getUserProfile);
userRouter.put('/UpdateProfile', userController.updateUserProfile);
userRouter.delete('/deleteProfile', userController.deleteUserProfile);
module.exports = userRouter;