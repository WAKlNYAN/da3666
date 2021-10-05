#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const { setOptions, addUser } = require('./lib/da3000');

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  },
  {
    name: 'file',
    alias: 'f',
    type: String,
    multiple: false,
    description: 'Database file to use',
    typeLabel: '<files>'
  },
  {
    name: 'adduser',
    alias: 'u',
    type: String,
    description: 'Add user'
  },
  {
    name: 'test',
    alias: 't',
    type: Boolean,
    description: 'Run Test'
  }
]

const options = commandLineArgs(optionDefinitions)
const noOptions = Object.keys(options).length < 1;
if (!options.db) options.db = './db.json';
setOptions(options);

if (options.help || noOptions) {
  const usage = commandLineUsage([
    {
      header: 'DA3666',
      content: 'D3 Demonstration CLI'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    },
    {
      content: 'Project home: {underline https://github.com/WAKlNYAN/da3666}\n'+
        `Database File: ${options.db}`
    }
  ])
  console.log(usage)
} else if (options.adduser) {
  addUser(options.adduser);
}
