const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');

const { initRepo } = require('./controllers/init');
const { addRepo } = require('./controllers/add');

yargs(hideBin(process.argv))
.command('init', 'Initialize the new repo',{}, initRepo)
.command("add <file>", "Add file to staging area",
    (yargs) => {
        yargs.positional('file', {
            describe: 'File to add to staging area',
            type: 'string'
        });
    }
   , addRepo
)
.demandCommand(1, 'You need at least one command before moving on')
.help().argv;