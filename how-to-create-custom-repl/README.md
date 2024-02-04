# Building a NodeJS REPL CLI system

REPL stands for Read-Eval-Print Loop and is often referred to as a simple interactive computer programming environment that takes single user inputs, executes them, and returns the result to the user [1]. For intance, NodeJS provides such an evironment after you execute `node` in a terminal. The REPL allows you to type JS code and execute it in NodeJS right away. 

Having understood that, you can think of a REPL CLI system as a REPL environment that only executes some predefined commands. Such a system would be useful especially when you want to create or udpate some state information which is used by other commands as inputs.

## A simple example
By using the [`repl`](https://nodejs.org/api/repl.html) module shipped with NodeJS and [`Commander.js`](https://github.com/tj/commander.js/tree/master), we can build such a system with relative ease. Here, we demonstrate it by creating a simple system that allows users to use command `name` to save their names and command `hello` to print a message to say hello to that name.
```bash
Commands:
  name <name>     Save name
  hello           Say hello to saved name
```
Check [`index.ts`](https://github.com/zzGHzz/DemoProjects/blob/main/how-to-create-custom-repl/index.ts) for the full code.

### Setting up commands
We first load `Commander.js`
```typescript
import { Command } from 'commander';
``` 
and generate an instance of class `Command` 
```typescript
const program = new Command();
program
  .version('0.0.1')
  .description('My custom REPL');
```
We then creates two separate sub-commands
```typescript
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
    if(_name.length > 0) {
      console.log(`Hello, ${_name}`);
    } else {
      console.log('No name saved');
    }
  });
```
### Overriding exit behaviours
By default, `commander` calls `process.exit` when it detects errors, or after displaying the help or version. We don't want such a behaviour since it would termiate the program. Intead, we only want the error message shown in the terminal. Luckly, `commander` allows us to do that by `exitOverride`:
```typescript
program.exitOverride();
nameCmd.exitOverride();
helloCmd.exitOverride();
```
Note that we have to call `exitOverride` not only for `program`, but for `nameCmd` and `nameCmd`. It is important to call `exitOverride` for all instances of class `Command` during the creation of the CLI system.

### Setting up REPL
The last thing to do is to call function `start` from module `repl`. We need to first import `start` at the beginning:
```typescript
import { start } from 'repl';
```
then add 
```typescript
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
```
To run the code, install `typescript` and `ts-node` and execute
```bash
npx ts-node ./index.ts
```

## References
[1] https://en.wikipedia.org/wiki/Read–eval–print_loop