import { start } from 'repl';
import { Command } from 'commander';
const figlet = require('figlet');

const program = new Command();
program
	.version('0.0.1')
	.description('My custom REPL');

let _name: string = '';
const nameCmd = program.command('name');
nameCmd
	.description('Save name')
	.arguments('<name>')
	.action((name: string) => {
		_name = name;
		console.log(`Name saved: ${name}`);
	});

const helloCmd = program.command('hello');
helloCmd
	.description('Say hello to saved name')
	.action(() => {
		if (_name.length > 0) {
			console.log(`Hello, ${_name}`);
		} else {
			console.log('No name saved');
		}
	});

program.exitOverride();
nameCmd.exitOverride();
helloCmd.exitOverride();

console.log(figlet.textSync('My REPL'));
program.outputHelp();

start({
	prompt: 'my-repl> ',
	ignoreUndefined: true,
	eval: (cmd, context, filename, callback) => {
		const args = cmd.trim().split(' ');
		try {
			program.parse(args, { from: 'user' });
			callback(null, undefined);
		} catch (err) {
			callback(null, undefined);
		}
	}
});