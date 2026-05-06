const express = require('express');
const issueController = require('../controllers/issueController');

const issueRouter = express.Router();

issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.put("/issue/update/:id", issueController.updateIsuueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);
issueRouter.get("/issue/all", issueController.getAllIssues);
issueRouter.get("/issue/id/:id", issueController.getIssueById);

module.exports = issueRouter;
