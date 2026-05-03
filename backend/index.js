const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');

const dotenv = require("dotenv");
dotenv.config();

const { initRepo } = require('./controllers/init');
const { addRepo } = require('./controllers/add');
const { commitRepo } = require('./controllers/commit');
const { pushRepo } = require('./controllers/push');
const { pullRepo } = require('./controllers/pull');
const { revertRepo } = require('./controllers/revert');

yargs(hideBin(process.argv))
  .command("start", "Start new server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help().argv;

  function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(cors({origin : '*' }));
    app.use(bodyParser.json());
    app.use(express.json());

    const mongouri = process.env.MONGODB_URI;
    mongoose.connect(mongouri)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });

    app.get('/', (req, res) => {
      res.send('Hello');
    });

//temp user
    let user = "testUser";

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      socket.on('joinRepo', (repoID) => { 
        console.log(`User ${user} joined repository ${repoID}`);
        socket.join(repoID);
    });
  });

  const db = mongoose.connection;

  db.once('open',async () => {
      console.log("Crud operations can be performed on the database");
  });
  
  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
}  