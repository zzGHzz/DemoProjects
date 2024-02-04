import * as repl from 'repl';
import { Command } from 'commander';
const figlet = require('figlet');

const mainProgram = new Command();
mainProgram
	.version('0.0.1')
	.description('My custom REPL');

const helloCmd = mainProgram.command('hello');
helloCmd
	.description('Say hello to input name')
	.argument('<name>', 'Name to say hello to')
	.action((name: string) => {
		console.log(`Hello, ${name}`);
	});

const splitCmd = mainProgram.command('split');
splitCmd
	.description('Split input string')
	.argument('<str>', 'String to split')
	.option('--first', 'display just the first substring')
	.option('-s, --separator <char>', 'separator character', ',')
	.action((str, options) => {
		const limit = options.first ? 1 : undefined;
		console.log(str.split(options.separator, limit));
	});

mainProgram.exitOverride();
helloCmd.exitOverride();
splitCmd.exitOverride();

console.log(figlet.textSync('My REPL'));
mainProgram.outputHelp();

repl.start({
	prompt: 'my-repl> ',
	ignoreUndefined: true,
	eval: (cmd, context, filename, callback) => {
		const args = cmd.trim().split(' ');
		try {
			mainProgram.parse(args, { from: 'user' });
			callback(null, undefined);
		} catch (err) {
			callback(null, undefined);
		}
	}
});